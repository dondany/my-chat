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
        <div class="mt-auto p-6">
          <button (click)="authService.logout()" class="flex gap-1 items-center px-2 py-1 rounded bg-indigo-400 text-white hover:bg-indigo-500">
            <!-- <app-avatar [imgUrls]="[]"></app-avatar> -->
            <mat-icon>logout</mat-icon>
            Sign out
          </button>
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
    MatIconModule
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
    })
  }
}
