import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageService } from '../shared/data-access/message.service';
import { AuthService } from '../shared/data-access/auth.service';
import { RegisterService } from '../auth/register/data-access/register.service';
import { ConversationService } from '../shared/data-access/conversation.service';
import { LoginService } from '../auth/login/data-access/login.service';
import { ConversationList } from "./ui/conversation-list.component";
import { MessageBoxComponent } from "./ui/message-box.component";

@Component({
    standalone: true,
    selector: 'app-home',
    template: `
    <app-conversation-list/>
    <app-message-box/>
  `,
    providers: [LoginService],
    imports: [CommonModule, RouterOutlet, ConversationList, MessageBoxComponent]
})
export default class HomeComponent {
  messageService = inject(MessageService);
  conversationService = inject(ConversationService);
  authService = inject(AuthService);
  loginService = inject(LoginService);
}
