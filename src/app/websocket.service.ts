import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<{ userId: number; content: string ,firstName:string,timestamp:string}>(); // Attendez un objet avec userId et content

  connect() {
    this.socket = new WebSocket('ws://localhost:3000'); // Remplacez par l'URL de votre serveur WebSocket


    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        // Émettre un objet contenant userId et content
        this.messageSubject.next(data.payload);
      }
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  sendMessage(message: { type: string; payload: { userId: number; content: string , firstName:string,timestamp:string} }) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket non connecté ou fermé.');
    }
  }



  onMessage() {
    return this.messageSubject.asObservable(); // Retourne un observable qui émet un objet { userId, content }
  }
}
