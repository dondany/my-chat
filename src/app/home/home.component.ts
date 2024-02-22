import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../auth/login/data-access/login.service';
import { AuthService } from '../shared/data-access/auth.service';
import { ConversationService } from '../shared/data-access/conversation.service';
import { AvatarComponent } from '../shared/ui/avatar-component';
import { MessageBoxComponent } from './conversation/ui/message-box.component';
import { ConversationList } from './ui/conversation-list.component';
import { EditProfileDialogComponent } from './ui/edit-profile-dialog.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="flex h-screen w-full">
      <div class="w-[360px] flex flex-col">
        <div
          class="flex justify-center m-8 mb-0 p-6 rounded-lg h-48 bg-indigo-50"
        >
          <div class="flex flex-col items-center">
            <button [matMenuTriggerFor]="userMenu">
              <app-avatar
                [imgUrls]="[authService.userDetails()?.imgUrl!]"
                size="xl"
              />
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item (click)="openEditProfileDialog()">
                <mat-icon class="material-icons-outlined font-thin scale-75">
                  edit
                </mat-icon>
                <span>Edit profile</span>
              </button>
              <button mat-menu-item (click)="authService.logout()">
                <mat-icon class="material-icons-outlined font-thin scale-75">
                  logout
                </mat-icon>
                <span>Log out</span>
              </button>
            </mat-menu>
            <span class="font-medium">
              {{ authService.userDetails()?.firstName }}
              {{ authService.userDetails()?.lastName }}
            </span>
            <span class="text-gray-700">
              {{ authService.userDetails()?.email }}
            </span>
          </div>
        </div>

        <app-conversation-list
          [conversations]="conversationService.conversations()"
          (conversation)="
            conversationService.currentConversation$.next($event.uid)
          "
        />
      </div>

      <div class="w-full">
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
    RouterModule,
  ],
})
export default class HomeComponent {
  conversationService = inject(ConversationService);
  authService = inject(AuthService);

  private router = inject(Router);

  constructor(public dialog: MatDialog) {
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

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {});
  }
}
