import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ConversationService } from '../shared/data-access/conversation.service';
import { LoginService } from '../auth/login/data-access/login.service';
import { ConversationList } from './ui/conversation-list.component';
import { MessageBoxComponent } from './conversation/ui/message-box.component';
import { AvatarComponent } from '../shared/ui/avatar-component';
import { AuthService } from '../shared/data-access/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="flex h-screen w-full">
      <div class="w-[360px] border-r flex flex-col">
        <app-conversation-list
          [conversations]="conversationService.conversations()"
          (conversation)="
            conversationService.currentConversation$.next($event.uid)
          "
        />

        <div class="mt-auto flex gap-3 justify-start items-center p-4 border-t">
          <button [matMenuTriggerFor]="userMenu">
            <app-avatar [imgUrls]="[authService.userDetails()?.imgUrl!]">
            </app-avatar>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="authService.logout()">
              <mat-icon class="material-icons-outlined font-thin scale-75">
                logout
              </mat-icon>
              <span>Log out</span>
            </button>
          </mat-menu>
          <div class="flex flex-col">
            <span class="font-medium">
              {{ authService.userDetails()?.username }}
            </span>
            <span class="text-xs text-gray-500">
              {{ authService.userDetails()?.email }}
            </span>
          </div>
        </div>
      </div>

      <div class="w-full h-full">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  providers: [LoginService],
  imports: [
    CommonModule,
    RouterOutlet,
    ConversationList,
    MessageBoxComponent,
    AvatarComponent,
    MatIconModule,
    MatMenuModule,
  ],
})
export default class HomeComponent {
  conversationService = inject(ConversationService);
  authService = inject(AuthService);

  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.conversationService.currentConversation()) {
        this.router.navigate([
          'home',
          this.conversationService.currentConversation()?.uid,
        ]);
      } else {
        this.router.navigate(['home']);
      }
    });

    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }
}
