import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MessageDetails } from '../../../shared/model/message';

@Component({
  standalone: true,
  selector: 'app-message-box',
  template: `
    <div class="w-full h-full relative flex flex-col p-2 gap-3">
      <div class="grow relative">
        <div
          class="overflow-y-scroll absolute top-0 bottom-0 left-0 right-0 flex flex-col-reverse"
        >
          <ul class="flex flex-col justify-end grow mt-auto gap-1">
            @for (message of messages; track $index) {
              <li class="flex gap-1 items-center">
                @if (
                  (!message.isCurrentUser &&
                    messages[$index - 1] &&
                    messages[$index - 1].sender !== message.sender) ||
                  (!message.isCurrentUser && $index === 0)
                ) {
                  <img
                    class="w-8 h-8 rounded-full"
                    [src]="message.sender?.imgUrl"
                  />
                } @else {
                  <div class="w-8 h8"></div>
                }
                <div
                  [ngClass]="{ 'ml-auto items-end': message.isCurrentUser }"
                  class="flex flex-col items-start"
                >
                  <div
                    class="text-xs"
                    [ngClass]="{ 'ml-auto': message.isCurrentUser }"
                  >
                    @if (
                      (!message.isCurrentUser &&
                        $index > 0 &&
                        messages[$index - 1].sender !== message.sender) ||
                      $index === 0
                    ) {
                      {{ message.sender?.username }},
                    }
                    @if (
                      ($index > 0 &&
                        (messages[$index - 1].sender !== message.sender ||
                          +message.created - +messages[$index - 1].created >
                            60000)) ||
                      $index === 0
                    ) {
                      {{ message.created | date: 'shortTime' }}
                    }
                  </div>
                  <span
                    [ngClass]="
                      message.isCurrentUser
                        ? 'bg-slate-800 text-white'
                        : 'bg-white'
                    "
                    class="px-3 py-2 rounded-xl shadow-md"
                    >{{ message.content }}</span
                  >
                </div>
              </li>
            }
          </ul>
        </div>
      </div>

      <form
        [formGroup]="msgForm"
        (ngSubmit)="onSubmit()"
        class="h-14 mt-auto gap-3 px-2 flex items-center"
      >
        <input
          formControlName="msg"
          type="text"
          class="grow p-2 rounded-2xl outline-0"
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
    /* ===== Scrollbar CSS ===== */
    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgb(165 180 252) rgb(224 231 255);
    }

    /* Chrome, Edge, and Safari */
    *::-webkit-scrollbar {
      width: 16px;
    }

    *::-webkit-scrollbar-track {
      background: rgb(165 180 252);
    }

    *::-webkit-scrollbar-thumb {
      background-color: rgb(224 231 255);
      border-radius: 0px;
    }
  `,
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
