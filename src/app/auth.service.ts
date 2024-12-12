import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

// Interface pour typer les informations utilisateur décodées
interface DecodedToken {
  email: string;
  nom: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000'; // Remplacez par l'URL de votre API
 
  private readonly TOKEN_KEY = 'token'; // Clé pour le token dans le localStorage

  constructor(private http: HttpClient, private router:Router) {}

  // Méthode pour se connecter
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  // Ajouter cette méthode dans AuthService
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
        return decodedToken.exp > currentTime; // Vérifier si le token est valide
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error);
        return false;
      }
    }
    return false; // Aucun token trouvé
  }



  // Sauvegarde du token dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Récupération du token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Suppression du token lors de la déconnexion
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  // Décodage et récupération des informations utilisateur depuis le token
  getUserInfo(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken;
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
      }
    }
    return null;
  }
}
