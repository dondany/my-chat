import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageService } from '../shared/data-access/message.service';
import { AuthService } from '../shared/data-access/auth.service';
import { RegisterService } from '../auth/register/data-access/register.service';
import { ConversationService } from '../shared/data-access/conversation.service';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <ul>
      @for (message of messageService.messages(); track $index) {
      <li>{{ message.content }}</li>
      }
    </ul>
    <p>
      Current conversation:
      {{ conversationService.currentConversation()?.name }}
    </p>
    <button (click)="login()">login</button>
    <button
      (click)="
        messageService.currentConversation$.next({
          uid: 'ktYd73rYMMhvs8Piwfy0',
          name: ''
        })
      "
    >
      get
    </button>
    <button (click)="setConversationId()">set conversation</button>
    <button (click)="addMessage()">Add</button>
  `,
  imports: [CommonModule, RouterOutlet],
  providers: [RegisterService]
})
export default class HomeComponent {
  messageService = inject(MessageService);
  conversationService = inject(ConversationService);
  authService = inject(AuthService);
  registerService = inject(RegisterService);

  login() {
    this.registerService.createUser$.next({
      email: 'test@test.com',
      password: 'password',
    });
  }

  setConversationId() {
    this.conversationService.currentConversation$.next('ktYd73rYMMhvs8Piwfy0');
  }

  addMessage() {
    this.messageService.add$.next('lol');
  }
}
