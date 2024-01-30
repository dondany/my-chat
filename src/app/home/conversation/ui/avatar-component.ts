import { Component, Input } from "@angular/core";

@Component({
    standalone: true,
    selector: 'app-avatar',
    template: `
    @if (imgUrls && imgUrls.length < 2) {
        <img class="w-12 h-12 rounded-full" [src]="imgUrls[0] ? imgUrls[0] : defaultAvatarUrl"/>
    } @else if (imgUrls) {
        <div class="relative w-12 h-12">
            <img class="w-8 h-8 absolute top-0 right-0  rounded-full" [src]="imgUrls[1] ? imgUrls[1] : defaultAvatarUrl"/>
            <img class="w-8 h-8 absolute bottom-0 left-0 rounded-full border-white border-2" [src]="imgUrls[0] ? imgUrls[0] : defaultAvatarUrl"/>
        </div>
    }
    `
})
export class AvatarComponent {
    @Input({ required: true}) imgUrls: string[] = [];
    defaultAvatarUrl: string = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png';
}