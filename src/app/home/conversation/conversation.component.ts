import { Component, inject } from '@angular/core';
import { ConversationService } from '../../shared/data-access/conversation.service';
import { MessageBoxComponent } from './ui/message-box.component';
import { MessageService } from '../../shared/data-access/message.service';
import { AvatarComponent } from "./ui/avatar-component";

@Component({
    standalone: true,
    selector: 'app-conversation',
    template: `
    <div class="flex flex-col h-full">
      <header class="flex items-center gap-3 p-3 border-b">
        <app-avatar [imgUrls]="conversationService.currentConversation()?.imgUrls!"></app-avatar>
        <div class="flex flex-col">
          <span class="font-medium">
            {{ conversationService.currentConversation()?.name }}
          </span>
        </div>
      </header>
      <app-message-box
        [messages]="messageService.messages()"
        (message)="messageService.add$.next($event)"
        class="grow flex"
      />
    </div>
  `,
    imports: [MessageBoxComponent, AvatarComponent]
})
export default class ConversationComponent {
  conversationService = inject(ConversationService);
  messageService = inject(MessageService);
}
