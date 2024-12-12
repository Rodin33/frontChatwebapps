import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isLoggedIn$ = new BehaviorSubject<boolean>(false); // Suivi de l'état d'authentification
  private apiUrl = 'http://localhost:3000'; // Remplacez par l'URL de votre API
  


  constructor(private http: HttpClient) {}

  // Inscription de l'utilisateur
  register(user: { email: string; firstName: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Connexion de l'utilisateur
  login(user: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  // Mise à jour de l'état de connexion
  setLoggedIn(status: boolean): void {
    this.isLoggedIn$.next(status);
  }

  // Vérification de l'état de connexion
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/currentUser`);
  }

  getMessages(): Observable<any> {
    const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token non disponible.');
    return throwError(() => new Error('Utilisateur non authentifié'));
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    return this.http.get(`${this.apiUrl}/api/messages`,{headers});
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/users`);
  }

}
