import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserDetails } from '../../shared/model/user';
import { AuthService } from '../../shared/data-access/auth.service';
import { UserService } from '../../shared/data-access/user.service';

@Component({
  standalone: true,
  selector: 'app-edit-profile-dialog',
  template: `
    <div class="p-14" mat-dialog-content>
    <h1 mat-dialog-title>My Profile</h1>
      <div class="flex gap-14">
        <div class="">
          <div
            class="rounded-full w-32 h-32 p-2 border-2 flex items-center justify-center"
          >
            <div class="relative w-28 h-28">
              <img
                class="w-28 h-28 rounded-full"
                [src]="authService.userDetails()?.imgUrl"
                alt=""
              />
              <button
                (click)="imgInput.click()"
                class="absolute right-0 bottom-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <mat-icon class="material-symbols-outlined text-white"
                  >photo_camera</mat-icon
                >
              </button>
              <input
                hidden
                type="file"
                #imgInput
                (change)="onFileSelected($event)"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <form action="" class="flex flex-col">
            <div class="flex gap-6">
              <mat-form-field class="">
                <mat-label>First name</mat-label>
                <input matInput type="text" />
              </mat-form-field>

              <mat-form-field class="">
                <mat-label>Last name</mat-label>
                <input matInput type="text" />
              </mat-form-field>
            </div>

            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput type="text" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput type="text" />
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="ml-auto"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatDialogTitle, MatDialogContent],
})
export class EditProfileDialogComponent {
  authService = inject(AuthService);
  userService = inject(UserService);

  selectedImg: File | null = null;
  uploadedImgUrl: string | undefined;

  constructor(public dialogRef: MatDialogRef<EditProfileDialogComponent>) {}

  onFileSelected(event: any) {
    if (!event.target.files[0]) {
      return;
    }
    this.userService.profilePicture$.next(event.target.files[0]);
  }
  
}
