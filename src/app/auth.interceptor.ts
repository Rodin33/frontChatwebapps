import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router:Router,private authService:AuthService){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (request.url.includes('auth')) {
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `${token}`
          }
        });
      }
    } else {

    }
    
    return next.handle(request).pipe(
      catchError (( error: HttpErrorResponse)=>{
        if(error.status===401){
          const getUserInfo=this.authService.getToken()
          if(getUserInfo){
            this.removeLocaleStrore()
            setTimeout(() => {
              window.location.reload();
              this.router.navigate(['/login'])
            }, 300);
          }

        }
        return throwError(error);
      })
    );
  }

  removeLocaleStrore(){
            localStorage.removeItem('token');
  }
}
