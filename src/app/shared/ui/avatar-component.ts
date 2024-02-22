import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-avatar',
  template: `
    @if (imgUrls && imgUrls.length < 2) {
      <img
        class="rounded-full"
        [ngClass]="containerSizeClass()"
        [src]="imgUrls[0] ? imgUrls[0] : defaultAvatarUrl"
      />
    } @else if (imgUrls) {
      <div class="relative" [ngClass]="containerSizeClass()">
        <img
          class="absolute top-0 right-0  rounded-full"
          [ngClass]="avatarSizeClass()"
          [src]="imgUrls[1] ? imgUrls[1] : defaultAvatarUrl"
        />
        <img
          class="absolute bottom-0 left-0 rounded-full border-white border-2"
          [ngClass]="avatarSizeClass()"
          [src]="imgUrls[0] ? imgUrls[0] : defaultAvatarUrl"
        />
      </div>
    }
  `,
  imports: [CommonModule],
})
export class AvatarComponent {
  @Input({ required: true }) imgUrls: string[] = [];
  @Input() size: 'xs' | 's' | 'm' | 'lg' | 'xl' = 'm';
  defaultAvatarUrl: string =
    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png';

  containerSizeClass() {
    return {
      'w-6 h-6': this.size === 'xs',
      'w-8 h-8': this.size === 's',
      'w-10 h-10': this.size === 'm',
      'w-12 h-12': this.size === 'lg',
      'w-24 h-24': this.size === 'xl',
    };
  }

  avatarSizeClass() {
    return {
      'w-5 h-5': this.size === 'xs',
      'w-6 h-6': this.size === 's',
      'w-7 h-7': this.size === 'm',
      'w-8 h-8': this.size === 'lg',
      'w-18 h-18': this.size === 'xl',
    };
  }
}
