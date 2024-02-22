import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Conversation } from '../../shared/model/conversation';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { AvatarComponent } from '../../shared/ui/avatar-component';
import { NewConversationDialogComponent } from './new-conversation-dialog.component';

@Component({
  standalone: true,
  selector: 'app-conversation-list',
  template: `
    <div class="px-6 h-14 flex justify-between items-center fill-none">
      <div
        (click)="openDialog()"
        class="flex justify-center items-center py-2 px-4 rounded-full cursor-pointer hover:bg-indigo-50"
      >
        <span class="cursor-pointer" routerLink="/home">New Conversation</span>
        <mat-icon class="material-symbols-outlined">add</mat-icon>
      </div>
    </div>

    <ul class="py-2 px-8">
      @for (conversation of conversations; track $index) {
        <li
          (click)="conversationEmitter.emit(conversation)"
          class="flex gap-3 items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-indigo-50"
        >
          <app-avatar [imgUrls]="conversation.imgUrls!"></app-avatar>
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ conversation.name }}</span>
            <span
              class="text-gray-400 text-xs"
              [ngClass]="{
                'font-semibold text-gray-700': conversation.newMessage
              }"
              >{{ conversation.latestMessage | truncate: 25 }}</span
            >
          </div>
        </li>
      }
    </ul>
  `,
  imports: [
    MatIconModule,
    AvatarComponent,
    TruncatePipe,
    RouterModule,
    CommonModule,
  ],
})
export class ConversationList {
  @Input({ required: true }) conversations: Conversation[] = [];

  @Output('conversation') conversationEmitter =
    new EventEmitter<Conversation>();

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NewConversationDialogComponent, {});

    // dialogRef.afterClosed().subscribe((result) => {
    // });
  }
}
