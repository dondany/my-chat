import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Conversation } from '../../shared/model/conversation';

@Component({
  standalone: true,
  selector: 'app-conversation-list',
  template: `
    <div class="p-4">
      <span class="font-semibold text-2xl">Chats</span>
    </div>

    <ul class="p-2">
      @for (conversation of conversations; track $index) {
      <li
        (click)="conversationEmitter.emit(conversation)"
        class="flex gap-3 items-center p-4 rounded cursor-pointer hover:bg-gray-100"
      >
        <div class="w-10 h-10 rounded-full bg-gray-300"></div>
        <div class="flex flex-col">
          <span class="font-medium">{{ conversation.name }}</span>
          <span>Ostatnia wiadomosc...</span>
        </div>
      </li>
      }
    </ul>
  `,
})
export class ConversationList {
  @Input({ required: true }) conversations: Conversation[] = [];

  @Output('conversation') conversationEmitter =
    new EventEmitter<Conversation>();
}
