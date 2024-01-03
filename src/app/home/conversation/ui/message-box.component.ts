import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MessageService } from '../../../shared/data-access/message.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageDetails } from '../../../shared/model/message';

@Component({
  standalone: true,
  selector: 'app-message-box',
  template: `
    <div class="flex flex-col grow p-2">
      <ul>
        @for(message of messages; track $index) {
        <li>
          {{ message.sender?.username }}
          {{ message.created | date : 'short' }}
          {{ message.content }}
        </li>
        }
      </ul>
      <form [formGroup]="msgForm" (ngSubmit)="onSubmit()" class="mt-auto gap-3 flex">
        <input formControlName="msg" type="text" class="grow p-2 rounded-2xl bg-gray-200" placeholder="Aa"/>
        <button type="submit">Send</button>
      </form>
    </div>
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
