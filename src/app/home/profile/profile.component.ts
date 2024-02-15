import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ImageUploadService } from '../../shared/data-access/image-upload.service';
import { AuthService } from '../../shared/data-access/auth.service';
import { UserService } from '../../shared/data-access/user.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-profile',
  template: `
    <div class="flex h-full">
      <div class="flex flex-col w-full">
        <header class="flex items-center gap-3 p-3 border-b h-14">
          <span class="font-medium text-2xl">Edit Profile</span>
        </header>
        <div class="p-6">
          <div class="relative w-28 h-28">
            <img class="w-28 h-28 rounded-full"[src]="authService.userDetails()?.imgUrl" alt="">
              <button (click)="imgInput.click()"  class="absolute right-0 bottom-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600">
              <mat-icon class="material-symbols-outlined text-white">photo_camera</mat-icon>
            </button>
            <input hidden type="file" #imgInput (change)="onFileSelected($event)">
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [MatButtonModule, MatIconModule],
})
export default class ProfileComponent {
  authService = inject(AuthService);
  userService = inject(UserService);

  selectedImg: File | null = null;
  uploadedImgUrl: string | undefined;

  onFileSelected(event: any) {
    if (!event.target.files[0]) {
      return;
    }
    this.userService.profilePicture$.next(event.target.files[0]);
  }
}
