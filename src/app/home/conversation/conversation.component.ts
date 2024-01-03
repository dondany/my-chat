import { Component, inject } from '@angular/core';
import { ConversationService } from '../../shared/data-access/conversation.service';
import { MessageBoxComponent } from './ui/message-box.component';
import { MessageService } from '../../shared/data-access/message.service';

@Component({
  standalone: true,
  selector: 'app-conversation',
  template: `
    <h1>{{ conversationService.currentConversation()?.name }}</h1>
    <ul>
      @for(member of conversationService.currentConversation()?.members; track
      $index) {
      <li>{{ member.username }}</li>
      }
    </ul>
    <app-message-box
      [messages]="messageService.messages()"
      (message)="messageService.add$.next($event)"
    />
  `,
  imports: [MessageBoxComponent],
})
export default class ConversationComponent {
  conversationService = inject(ConversationService);
  messageService = inject(MessageService);
}
