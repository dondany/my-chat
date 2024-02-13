import { Component, inject } from '@angular/core';
import { ConversationService } from '../../shared/data-access/conversation.service';
import { MessageBoxComponent } from './ui/message-box.component';
import { MessageService } from '../../shared/data-access/message.service';
import { AvatarComponent } from '../../shared/ui/avatar-component';
import { ConversationSettingsComponent } from './ui/conversation-settings.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Conversation } from '../../shared/model/conversation';
import { AuthService } from '../../shared/data-access/auth.service';

@Component({
  standalone: true,
  selector: 'app-conversation',
  template: `
    <div class="flex h-full">
      <div class="flex flex-col w-full">
        <header class="flex items-center gap-3 p-3 border-b h-14">
          <app-avatar
            [imgUrls]="conversationService.currentConversation()?.imgUrls!"
          ></app-avatar>
          <div class="flex flex-col">
            <span class="font-medium">
              {{ conversationService.currentConversation()?.name }}
            </span>
          </div>
          <button
            (click)="showSettings = !showSettings"
            class="ml-auto flex items-center justify-center p-1 rounded-full cursor-pointer hover:bg-gray-200"
          >
            <mat-icon class="material-icons-outlined font-thin scale-75"
              >more_horiz</mat-icon
            >
          </button>
        </header>
        <app-message-box
          [messages]="messageService.messages()"
          (message)="messageService.add$.next($event)"
          class="grow flex"
        />
      </div>
      @if (showSettings) {
      <app-conversation-settings
        [conversation]="conversationService.currentConversation()!"
        [admin]="isAdmin()"
        [@inOutAnimation]
        (removeMember)="removeMember($event)"
        (toggleAdmin)="grantAdmin($event)"
        (changeConversationName)="changeConversationName($event)"
      ></app-conversation-settings>
      }
    </div>
  `,
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ width: 0 }),
        animate('200ms linear', style({ width: '300px' })),
      ]),
      transition(':leave', [
        style({ width: '300px' }),
        animate('200ms linear', style({ width: 0 })),
      ]),
    ]),
  ],
  imports: [
    MessageBoxComponent,
    AvatarComponent,
    ConversationSettingsComponent,
    MatIconModule,
  ],
})
export default class ConversationComponent {
  conversationService = inject(ConversationService);
  messageService = inject(MessageService);
  authService = inject(AuthService);

  showSettings: boolean = false;

  removeMember(event: string) {
    let conversation = {
      ...this.conversationService.currentConversation(),
    } as Conversation;
    conversation.memberIds = conversation.memberIds?.filter(
      (id) => id !== event
    );
    conversation.members = conversation.members?.filter(
      (member) => member.uid !== event
    );

    this.conversationService.update$.next(conversation);
  }

  isAdmin(): boolean {
    return this.conversationService
      .currentConversation()
      ?.members?.filter((m) => m.uid === this.authService.user()?.uid)
      .find((m) => m.admin)
      ? true
      : false;
  }

  grantAdmin(event: string) {
    let conversation = {
      ...this.conversationService.currentConversation(),
    } as Conversation;
    const member = conversation.members?.find(m => m.uid == event);
    if (member) {
      member.admin = !member.admin;
    }
    this.conversationService.update$.next(conversation);
  }

  changeConversationName(event: string) {
    let conversation = {
      ...this.conversationService.currentConversation(),
      name: event
    } as Conversation;
    this.conversationService.update$.next(conversation);
  }
}
