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

@Component({
  standalone: true,
  selector: 'app-conversation',
  template: `
    <div class="flex flex h-full">
      <div class="flex flex-col w-full">
        <header class="flex items-center gap-3 p-3 border-b">
          <app-avatar
            [imgUrls]="conversationService.currentConversation()?.imgUrls!"
          ></app-avatar>
          <div class="flex flex-col">
            <span class="font-medium">
              {{ conversationService.currentConversation()?.name }}
            </span>
          </div>
          <button (click)="showSettings = !showSettings"
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
        [@inOutAnimation]
      ></app-conversation-settings>
      }
    </div>
  `,
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ width: 0}),
            animate('200ms linear', 
                    style({ width: '300px' }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ width: '300px' }),
            animate('200ms linear', 
                    style({ width: 0 }))
          ]
        )
      ]
    )
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

  showSettings: boolean = false;
}
