import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './shared/data-access/message.service';
import { AuthService } from './shared/data-access/auth.service';
import { RegisterService } from './shared/data-access/register.service';
import { ConversationService } from './shared/data-access/conversation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  <ul>
    @for (message of messageService.messages(); track $index) {
      <li> {{ message.content }}</li>
    }
  </ul>
  <p>Current conversation: {{ conversationService.currentConversation()?.name }}</p>
  <button (click)="login()">login</button>
  <button (click)="messageService.currentConversation$.next({ uid: 'sZfiQ69RiyFRoCXpOm0l', name: ''})">get</button>
  <button (click)="setConversationId()">set conversation</button>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  messageService = inject(MessageService);
  conversationService = inject(ConversationService);
  authService = inject(AuthService);
  registerService = inject(RegisterService);

  login() {
    this.registerService.createUser$.next({email: "test@test.com", password: "password"});
  }

  setConversationId() {
    this.conversationService.currentConversation$.next('sZfiQ69RiyFRoCXpOm0l');
  }

}
