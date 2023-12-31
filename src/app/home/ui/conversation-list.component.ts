import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Conversation } from '../../shared/model/conversation';
import { MatIconModule } from '@angular/material/icon';
import { UsersSearchModalComponent } from './users-search-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-conversation-list',
  template: `
    <div class="p-6 flex justify-between items-center fill-none">
      <span class="font-semibold text-2xl">Chats</span>
      <div
        (click)="openDialog()"
        class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-200"
      >
        <mat-icon class="material-symbols-outlined">add</mat-icon>
      </div>
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
  imports: [MatIconModule],
})
export class ConversationList {
  @Input({ required: true }) conversations: Conversation[] = [];

  @Output('conversation') conversationEmitter =
    new EventEmitter<Conversation>();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(UsersSearchModalComponent, {});

    // dialogRef.afterClosed().subscribe((result) => {
    // });
  }
}
