import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Conversation } from '../../shared/model/conversation';

@Component({
  standalone: true,
  selector: 'app-conversation-list',
  template: `
    <h1>Conversations</h1>
    <ul>
      @for (conversation of conversations; track $index) {
      <li>{{ conversation.name }}</li>
      <button (click)="conversationEmitter.emit(conversation)" >Open</button>
      }
    </ul>
  `,
})
export class ConversationList {
  @Input({required: true}) conversations : Conversation[] = [];

  @Output('conversation') conversationEmitter = new EventEmitter<Conversation>();
}
