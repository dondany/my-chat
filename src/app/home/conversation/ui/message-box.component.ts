import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MessageService } from '../../../shared/data-access/message.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageDetails } from '../../../shared/model/message';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-message-box',
  template: `
    <div class="w-full flex flex-col p-2 gap-3">
      <div class="overflow-y-scroll container flex flex-col-reverse">
        <ul class="flex flex-col grow justify-end mt-auto">
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
                {{ message.sender?.username }}, }
                {{ message.created | date : 'shortTime' }}
              </div>
              <span
                [ngClass]="
                  message.isCurrentUser
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200'
                "
                class="p-2 rounded-xl"
                >{{ message.content }}</span
              >
            </div>
          </li>
          }
        </ul>
      </div>

      <form
        [formGroup]="msgForm"
        (ngSubmit)="onSubmit()"
        class="h-14 mt-auto gap-3 px-2 flex items-center"
      >
        <input
          formControlName="msg"
          type="text"
          class="grow p-2 rounded-2xl bg-gray-200 outline-0"
          placeholder="Aa"
        />
        <button type="submit">
          <mat-icon class="text-indigo-600 scale-90">send</mat-icon>
        </button>
      </form>
    </div>
  `,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  styles: `
  .container {
    max-height: calc(100vh - 125px);
    height: calc(100vh - 125px);
  }
  `
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
