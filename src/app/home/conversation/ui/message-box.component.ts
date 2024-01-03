import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MessageService } from '../../../shared/data-access/message.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageDetails } from '../../../shared/model/message';

@Component({
  standalone: true,
  selector: 'app-message-box',
  template: `
    <h2>Messages</h2>
    <ul>
      @for(message of messages; track $index) {
      <li>
        {{ message.sender?.username }}
        {{ message.created | date : 'short' }}
        {{ message.content }}
      </li>
      }
    </ul>
    <form [formGroup]="msgForm" (ngSubmit)="onSubmit()">
      <input formControlName="msg" type="text" />
      <button type="submit">Send</button>
    </form>
  `,
  imports: [ReactiveFormsModule, CommonModule],
})
export class MessageBoxComponent {
  @Input({ required: true }) messages: MessageDetails[] = [];

  @Output('message') messageEmitter = new EventEmitter<string>();

  private fb = inject(FormBuilder);

  msgForm = this.fb.nonNullable.group({
    msg: ['', [Validators.required]],
  });

  onSubmit() {
    this.messageEmitter.emit(this.msgForm.getRawValue().msg);
    this.msgForm.reset();
  }
}
