import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Conversation } from '../../../shared/model/conversation';
import { AvatarComponent } from '../../../shared/ui/avatar-component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog.component';
import { AddMembersDialogComponent } from './add-members-dialog.component';
import { ChangeConversationNameDialogComponent } from './change-conversation-name-dialog.component';

@Component({
  standalone: true,
  selector: 'app-conversation-settings',
  template: `
    <div class="pr-8">
      <div
        class="w-60 h-full flex flex-col items-center p-2 rounded-xl bg-indigo-50 shadow-md"
      >
        <div class="flex flex-col gap-3 items-center mt-12">
          <app-avatar
            [imgUrls]="conversation.imgUrls ? conversation.imgUrls : []"
          ></app-avatar>
          <span class="font-medium text-lg">{{ conversation.name }}</span>
        </div>

        <div class="w-full">
          <button
            (click)="configurationOpened = !configurationOpened"
            class="flex items-center w-full p-2 rounded hover:bg-white/70"
          >
            <span>Configure chat</span>
            @if (!configurationOpened) {
              <mat-icon class="ml-auto">chevron_right</mat-icon>
            } @else {
              <mat-icon class="ml-auto">expand_more</mat-icon>
            }
          </button>
          @if (configurationOpened) {
            <ul>
              <li>
                <button
                  (click)="openChangeConversationNameDialog()"
                  class="flex items-center w-full p-2 gap-3 rounded hover:bg-white/70"
                >
                  <div
                    class="flex items-center justify-center  w-6 h-6 rounded-full bg-white/80"
                  >
                    <mat-icon class="scale-[.6]">edit</mat-icon>
                  </div>
                  <span>Change name</span>
                </button>
              </li>
            </ul>
          }
        </div>

        <div class="w-full">
          <button
            (click)="membersOpened = !membersOpened"
            class="flex items-center w-full p-2 rounded hover:bg-white/60"
          >
            <span>Members</span>
            @if (!membersOpened) {
              <mat-icon class="ml-auto">chevron_right</mat-icon>
            } @else {
              <mat-icon class="ml-auto">expand_more</mat-icon>
            }
          </button>
          @if (membersOpened) {
            <ul class="font-medium w-full">
              @for (member of conversation.members; track member.uid) {
                <li class="w-full rounded flex gap-3 items-center p-2">
                  <app-avatar [imgUrls]="[member.imgUrl]" size="s"></app-avatar>
                  <div class="flex flex-col">
                    <span>{{ member.username }}</span>
                    @if (member.admin) {
                      <span class="text-xs text-gray-400">Administrator</span>
                    }
                  </div>
                  @if (admin) {
                    <button
                      class="ml-auto flex items-center justify-center p-1 rounded-full cursor-pointer hover:bg-white/80"
                      [matMenuTriggerFor]="menu"
                    >
                      <mat-icon
                        class="material-icons-outlined font-thin scale-75"
                        >more_horiz</mat-icon
                      >
                    </button>
                    <mat-menu #menu="matMenu">
                      <button
                        mat-menu-item
                        (click)="openRemoveMemberConfirmDialog(member.uid)"
                      >
                        <mat-icon
                          class="material-icons-outlined font-thin scale-75"
                          >person_remove</mat-icon
                        >
                        <span>Remove member</span>
                      </button>
                      @if (admin) {
                        <button
                          mat-menu-item
                          (click)="this.toggleAdmin.emit(member.uid)"
                        >
                          <mat-icon
                            class="material-icons-outlined font-thin scale-75"
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
              <li>
                <button
                  (click)="openAddMembersDialog()"
                  class="w-full flex items-center gap-2 p-2 rounded hover:bg-white/70 cursor-pointer"
                >
                  <div
                    class="flex justify-center items-center p-1 rounded-full cursor-pointer bg-white/80"
                  >
                    <mat-icon class="material-symbols-outlined">add</mat-icon>
                  </div>
                  <span>Add members</span>
                </button>
              </li>
            </ul>
          }
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
  @Output() changeConversationName: EventEmitter<string> =
    new EventEmitter<string>();

  configurationOpened: boolean = false;
  membersOpened: boolean = false;

  constructor(public dialog: MatDialog) {}

  openAddMembersDialog() {
    const dialogRef = this.dialog.open(AddMembersDialogComponent, {
      enterAnimationDuration: 120,
      exitAnimationDuration: 120,
    });
  }

  openRemoveMemberConfirmDialog(memberUid: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '640px',
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

  openChangeConversationNameDialog() {
    const dialogRef = this.dialog.open(ChangeConversationNameDialogComponent, {
      width: '360px',
      enterAnimationDuration: 120,
      exitAnimationDuration: 120,
      data: {
        name: this.conversation.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result.data) {
        return;
      }
      if (result.data !== this.conversation.name) {
        this.changeConversationName.emit(result.data);
      }
    });
  }
}
