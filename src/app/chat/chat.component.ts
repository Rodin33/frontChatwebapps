import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { HttpClient } from '@angular/common/http'; // Importer HttpClient
import { Observable } from 'rxjs';
import { UserService } from '../services/user-service.service';
import { AuthService } from '../auth.service';
import * as Tone from 'tone';

// Vérifiez avec votre version installée


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messages: { userId: number; content: string ,firstName:string,timestamp:string}[] = []; // Tableau d'objets avec userId et content
  newMessage: string = '';
  userInfo:any
  usercurrentId!:number
  showLogoutModal:boolean=false



  constructor(private wsService: WebSocketService, private http: HttpClient,private service:UserService,private autservice:AuthService) {}

  ngOnInit() {
    this.wsService.connect();
    this.userInfo=this.autservice.getUserInfo()
    this.usercurrentId=this.userInfo.id

    // Récupérer les messages de l'API lorsque le composant est initialisé
    // Recevoir des messages via WebSocket
    this.wsService.onMessage().subscribe((message: { userId: number; content: string ,firstName:string,timestamp:string}) => {
      this.messages.push(message); // Ajouter l'objet message au tableau
      setTimeout(() => this.scrollToBottom(), 0);
      if (message.userId !== this.usercurrentId) {
        this.playNotificationSound();
      }else{
        this.playSendMessageSound();
      }
    });

   this.getMessages()

  }



  playNotificationSound() {

    // Créer un synthétiseur simple
    const synth = new Tone.Synth().toDestination();
    // Déclencher une note (par exemple, "C4") pour une durée de "8n" (croche)

    synth.triggerAttackRelease('E7', '7n');
  }
  playSendMessageSound() {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("F10", "14n");
    // Note différente (E4 au lieu de C4)
  }

  actualiseScrolle(){
    setTimeout(() => this.scrollToBottom(), 500);
  }

  getMessages(){
    this.service.getMessages().subscribe({
      next:(data)=>{
        this.messages=data;
        this.actualiseScrolle()
      }
    })
  }


  ngOnDestroy() {
    this.wsService.disconnect();
  }

  sendMessage() {
    const currentDate = new Date(); // Obtenir la date et l'heure actuelles

    if (this.newMessage.trim()) {
      this.wsService.sendMessage({
        type: 'message',
        payload: {
          userId: this.userInfo.id,
          content: this.newMessage,
          firstName: this.userInfo.firstName,
          timestamp: currentDate.toISOString()
        },
      });
      this.newMessage = ''; // Réinitialiser l'entrée
      setTimeout(() => this.scrollToBottom(), 0);
    }

  }



  scrollToBottom(): void {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight; // Défiler jusqu'en bas
    }
  }

  formatMessageTimestamp(timestamp: string | Date): string {
    const messageDate = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const currentDate = new Date();

    // Calcul de la différence en jours entre la date actuelle et celle du message
    const diffInDays = Math.floor((currentDate.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

    // Format de l'heure
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

    if (diffInDays === 0) {
      // Aujourd'hui
      return `Aujourd'hui à ${messageDate.toLocaleTimeString('fr-FR', optionsTime)}`;
    } else if (diffInDays === 1) {
      // Hier
      return `Hier à ${messageDate.toLocaleTimeString('fr-FR', optionsTime)}`;
    } else {
      // Avant-hier ou plus
      const optionsDate: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short', // "déc" pour décembre
        year: 'numeric',
      };
      return `${messageDate.toLocaleDateString('fr-FR', optionsDate)} à ${messageDate.toLocaleTimeString('fr-FR', optionsTime)}`;
    }
  }

  logout() {
    this.showLogoutModal = true; // Afficher le modal
  }

  closeLogoutModal() {
    this.showLogoutModal = false; // Cacher le modal
  }

  confirmLogout() {
    this.showLogoutModal = false;
    // Logique de déconnexion
    this.autservice.logout(); // Exemple si vous utilisez un service d'authentification
  }

  isNewMessage(message: any): boolean {
    const now = new Date();
    const messageTime = new Date(message.timestamp);
    return now.getTime() - messageTime.getTime() < 5000; // 5 secondes
  }



}
