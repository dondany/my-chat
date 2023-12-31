import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ConversationService } from '../shared/data-access/conversation.service';
import { LoginService } from '../auth/login/data-access/login.service';
import { ConversationList } from './ui/conversation-list.component';
import { MessageBoxComponent } from './conversation/ui/message-box.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="flex h-screen w-full">
      <app-conversation-list
        [conversations]="conversationService.conversations()"
        (conversation)="conversationService.currentConversation$.next($event.uid)"
        class="w-[360px] border-r"
      />
      <div class="w-full h-full">
      <router-outlet></router-outlet>
      </div>
      
    </div>
  `,
  providers: [LoginService],
  imports: [CommonModule, RouterOutlet, ConversationList, MessageBoxComponent],
})
export default class HomeComponent {
  conversationService = inject(ConversationService);

  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.conversationService.currentConversation()) {
        this.router.navigate([
          'home',
          this.conversationService.currentConversation()?.uid,
        ]);
      } else {
        this.router.navigate(['home']);
      }
    });
  }
}
