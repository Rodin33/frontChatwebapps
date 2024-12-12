import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{

  message: string = '';
  isLogin: boolean = true;
  formMessage!:FormGroup;
  isLoading: boolean = false;
   // Par défaut, on affiche le formulaire de connexion

  constructor(private http: HttpClient, private fb:FormBuilder,private authService:AuthService,private router:Router) {}

  ngOnInit(): void {
    this.formMessage=this.fb.group({
      email:this.fb.control(null,[Validators.required]),
      firstName:this.fb.control(null,[Validators.required,Validators.email]),
      password:this.fb.control("",[Validators.required]),
    })
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.message = ''; // Réinitialiser le message
  }

  login(): void {
    this.message=""
    let email=this.formMessage.get('email')?.value
    let pwd=this.formMessage.get('password')?.value
    if (!email  || !pwd ) {
      this.message = 'Email et mot de passe sont requis pour la connexion.';
      return;
    }

    this.isLoading = true;
    this.authService.login(email, pwd).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/chat']); // Redirection après connexion
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading=false
        this.message = error.error.message ;

      },
    });
  }

  register() {
       this.message=""
       this.isLoading=true
    if (!this.formMessage.get('email')?.value || !this.formMessage.get('firstName')?.value  || !this.formMessage.get('password')?.value ) {
      this.message = 'Tous les champs sont requis pour l’inscription.';
      this.isLoading=false
      return;
    }

    this.http

     .post('http://localhost:3000/register', {
        email: this.formMessage.get('email')?.value ,
        firstName: this.formMessage.get('firstName')?.value ,
        password: this.formMessage.get('password')?.value ,
      })
      .subscribe(
        (response: any) => {
          this.message = response.message;
          this.isLoading=false
          this.toggleMode(); // Basculer sur le formulaire de connexion après l'inscription
        },
        (error) => {
          this.isLoading=false
          this.message = error.error.message || 'Erreur lors de l’inscription.';
        }
      );
  }
}
