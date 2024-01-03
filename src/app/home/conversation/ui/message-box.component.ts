import { Component, inject } from '@angular/core';
import { MessageService } from '../../../shared/data-access/message.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../../shared/data-access/conversation.service';

@Component({
  standalone: true,
  selector: 'app-message-box',
  template: `
    <h2>Messages</h2>
    <ul>
      @for(message of messageService.messages(); track $index) {
      <li>
        {{ mapMember(message.sender) }}
        {{ message.created | date: 'short'}}
        {{ message.content }}
      </li>
      }
    </ul>
    <form [formGroup]="msgForm" (ngSubmit)="onMsgSubmit()">
      <input formControlName="msg" type="text" />
      <button type="submit">Send</button>
    </form>
  `,
  imports: [ReactiveFormsModule, CommonModule]
})
export class MessageBoxComponent {
  messageService = inject(MessageService);
  conversationService = inject(ConversationService);

  private fb = inject(FormBuilder);

  msgForm = this.fb.nonNullable.group({
    msg: ['', [Validators.required]],
  });

  onMsgSubmit() {
    this.messageService.add$.next(this.msgForm.getRawValue().msg)
    this.msgForm.reset();
  }

  mapMember(uid: string) {
    return this.conversationService.currentConversation()?.members?.find(member => member.uid === uid)?.username;
  }
}
