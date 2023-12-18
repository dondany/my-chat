import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './shared/data-access/message.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
  <ul>
    @for (message of messageService.messages(); track $index) {
      <li> {{ message.content }}</li>
    }
  </ul>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  messageService = inject(MessageService);
}
