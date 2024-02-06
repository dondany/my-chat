import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conversation } from '../../../shared/model/conversation';
import { AvatarComponent } from '../../../shared/ui/avatar-component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog.component';
import { AddMembersDialogComponent } from './add-members-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { Member } from '../../../shared/model/user';

@Component({
  standalone: true,
  selector: 'app-conversation-settings',
  template: `
    <div class="w-60 h-full border-l flex flex-col items-center">
      <div class="flex flex-col gap-3 items-center mt-12">
        <app-avatar
          [imgUrls]="conversation.imgUrls ? conversation.imgUrls : []"
        ></app-avatar>
        <span class="font-medium text-lg">{{ conversation.name }}</span>
      </div>

      <span class="mt-12">Chat members</span>
      <ul class="font-medium w-full p-4">
        @for(member of conversation.members; track member.uid) {
        <li class="p-2 w-full rounded flex gap-3 items-center">
          <app-avatar [imgUrls]="[member.imgUrl]" size="s"></app-avatar>
          <div class="flex flex-col">
            <span>{{ member.username }}</span>
            @if(member.admin) {
            <span class="text-xs text-gray-400">Administrator</span>
            }
          </div>
          @if (admin) {
          <button
            class="ml-auto flex items-center justify-center p-1 rounded-full cursor-pointer hover:bg-gray-200"
            [matMenuTriggerFor]="menu"
          >
            <mat-icon class="material-icons-outlined font-thin scale-75"
              >more_horiz</mat-icon
            >
          </button>
          <mat-menu #menu="matMenu">
            <button
              mat-menu-item
              (click)="openRemoveMemberConfirmDialog(member.uid)"
            >
              <mat-icon class="material-icons-outlined font-thin scale-75"
                >person_remove</mat-icon
              >
              <span>Remove member</span>
            </button>
            @if (admin) {
            <button
              mat-menu-item
              (click)="this.toggleAdmin.emit(member.uid)"
            >
              <mat-icon class="material-icons-outlined font-thin scale-75"
                >shield_person</mat-icon
              >
              <span>{{
                member.admin ? 'Take away admin' : 'Grant admin'
              }}</span>
            </button>
            }
          </mat-menu>
          }
        </li>
        }
      </ul>
      <div class="w-full flex px-4">
        <div
          (click)="openAddMembersDialog()"
          class="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
        >
          <div
            class="flex justify-center items-center p-1 rounded-full cursor-pointer bg-gray-200"
          >
            <mat-icon class="material-symbols-outlined">add</mat-icon>
          </div>
          <span>Add members</span>
        </div>
      </div>
    </div>
  `,
  imports: [AvatarComponent, MatIconModule, MatMenuModule],
})
export class ConversationSettingsComponent {
  @Input({ required: true }) conversation!: Conversation;
  @Input({ required: true }) admin!: boolean;
  @Output() removeMember: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggleAdmin: EventEmitter<string> = new EventEmitter<string>();

  constructor(public dialog: MatDialog) {}

  openAddMembersDialog() {
    const dialogRef = this.dialog.open(AddMembersDialogComponent, {
      enterAnimationDuration: 120,
      exitAnimationDuration: 120,
    });
  }

  openRemoveMemberConfirmDialog(memberUid: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      enterAnimationDuration: 120,
      exitAnimationDuration: 120,
      data: {
        message: 'Are You sure You want to remove the member?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result.data) {
        return;
      }
      if (result.data === true && memberUid) {
        this.removeMember.emit(memberUid);
      }
    });
  }
}
