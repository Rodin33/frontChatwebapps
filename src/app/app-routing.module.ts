import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
 { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }, // Route protégée
  { path: 'login', component: LoginComponent }, // Page de connexion
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Page par défaut
  { path: '**', redirectTo: '/login' }, // Route inconnue // Redirection par défaut
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
