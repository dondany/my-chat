import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MessageService } from '../../../shared/data-access/message.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageDetails } from '../../../shared/model/message';

@Component({
  standalone: true,
  selector: 'app-message-box',
  template: `
    <div class="flex flex-col grow p-2 gap-3">
      <ul class="h-full flex flex-col justify-end">
        @for(message of messages; track $index) {
        <li class="flex gap-1 items-center">
          @if (!message.isCurrentUser) {
          <img class="w-8 h-8 rounded-full" [src]="message.sender?.imgUrl" />
          }
          <div
            [ngClass]="{ 'ml-auto': message.isCurrentUser }"
            class="flex flex-col"
          >
            <div
              class="text-xs"
              [ngClass]="{ 'ml-auto': message.isCurrentUser }"
            >
              @if(!message.isCurrentUser) {
              {{ message.sender?.display }}, }
              {{ message.created | date : 'shortTime' }}
            </div>
            <span
              [ngClass]="message.isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200'"
              class="p-2 rounded-xl"
              >{{ message.content }}</span
            >
          </div>
        </li>
        }
      </ul>
      <form
        [formGroup]="msgForm"
        (ngSubmit)="onSubmit()"
        class="mt-auto gap-3 flex"
      >
        <input
          formControlName="msg"
          type="text"
          class="grow p-2 rounded-2xl bg-gray-200 outline-0"
          placeholder="Aa"
        />
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
