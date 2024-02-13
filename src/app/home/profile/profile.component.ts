import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ImageUploadService } from '../../shared/data-access/image-upload.service';
import { AuthService } from '../../shared/data-access/auth.service';
import { UserService } from '../../shared/data-access/user.service';

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
          <img class="w-24 h-24"[src]="authService.userDetails()?.imgUrl" alt="">
          <div class="">
            <button mat-raised-button (click)="imgInput.click()">Upload file</button>
            <input hidden type="file" #imgInput (change)="onFileSelected($event)">
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [MatButtonModule],
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
