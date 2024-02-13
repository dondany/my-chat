import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ImageUploadService } from '../../shared/data-access/image-upload.service';

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
          <input
            type="file"
            id="upload"
            (change)="onFileSelected($event)"
          />
        </div>
      </div>
    </div>
  `,
  imports: [MatButtonModule],
  styles: `
    input[type=file]::file-selector-button {
    border: none;
    background: #084cdf;
    margin-right: 6px;
    padding: 6px 8px;
    border-radius: .25rem;
    color: #fff;
    cursor: pointer;
    transition: background .2s ease-in-out;
  }

  input[type=file]::file-selector-button:hover {
    background: #0d45a5;
  }
  `,
})
export default class ProfileComponent {
  private imageUploadService = inject(ImageUploadService);

  selectedItem: File | null = null;

  onFileSelected(event: any) {
    this.selectedItem = event.target.files[0];

    this.imageUploadService.uploadImage(this.selectedItem!)
    .subscribe(snap => console.log(snap));
  }
}
