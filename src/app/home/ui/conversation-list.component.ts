import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Conversation } from '../../shared/model/conversation';
import { MatIconModule } from '@angular/material/icon';
import { UsersSearchModalComponent } from './users-search-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AvatarComponent } from '../../shared/ui/avatar-component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-conversation-list',
  template: `
    <div class="px-6 py-4 h-14 flex justify-between items-center fill-none border-b">
      <span class="text-3xl text-indigo-600 font-['Pacifico'] cursor-pointer" routerLink="/home">Chats</span>
      <div
        (click)="openDialog()"
        class="flex justify-center items-center p-2 rounded-full cursor-pointer hover:bg-gray-100"
      >
        <mat-icon class="material-symbols-outlined">add</mat-icon>
      </div>
    </div>

    <ul class="p-2">
      @for (conversation of conversations; track $index) {
      <li
        (click)="conversationEmitter.emit(conversation)"
        class="flex gap-3 items-center px-4 py-2 rounded cursor-pointer hover:bg-gray-100"
      >
        <app-avatar [imgUrls]="conversation.imgUrls!"></app-avatar>
        <div class="flex flex-col">
          <span class="text-sm font-medium">{{ conversation.name }}</span>
          <span class="text-gray-500 text-xs">{{ conversation.latestMessage | truncate : 25 }}</span>
        </div>
      </li>
      }
    </ul>
  `,
  imports: [MatIconModule, AvatarComponent, TruncatePipe, RouterModule],
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
