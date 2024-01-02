import { Component, inject } from '@angular/core';
import { ConversationService } from '../../shared/data-access/conversation.service';

@Component({
  standalone: true,
  selector: 'app-conversation-list',
  template: `
    <h1>Conversations</h1>
    <ul>
      @for (conversation of conversationService.conversations(); track $index) {
      <li>{{ conversation.name }}</li>
      <button (click)="conversationService.currentConversation$.next(conversation.uid)" >Open</button>
      }
    </ul>
  `,
})
export class ConversationList {
    conversationService = inject(ConversationService);
}
