import { Component, inject } from '@angular/core';
import { MessageService } from '../../shared/data-access/message.service';

@Component({
  standalone: true,
  selector: 'app-message-box',
  template: `
  <h1>Messages</h1>
    <ul>
      @for(message of messageService.messages(); track $index) { 
        <li>
            {{ message.content }}
        </li>
      }
    </ul>
  `,
})
export class MessageBoxComponent {
  messageService = inject(MessageService);
}
