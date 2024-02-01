import { Component, Input } from '@angular/core';
import { Conversation } from '../../../shared/model/conversation';
import { AvatarComponent } from '../../../shared/ui/avatar-component';
import { MatIconModule } from '@angular/material/icon';

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
          <span>{{ member.username }}</span>
          <button class="ml-auto flex items-center justify-center p-1 rounded-full cursor-pointer hover:bg-gray-200">
            <mat-icon class="material-icons-outlined font-thin scale-75">person_remove</mat-icon>
          </button>
        </li>
        }
      </ul>
    </div>
  `,
  imports: [AvatarComponent, MatIconModule],
})
export class ConversationSettingsComponent {
  @Input({ required: true }) conversation!: Conversation;
}
