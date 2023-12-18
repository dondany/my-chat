import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './shared/data-access/message.service';
import { AuthService } from './shared/data-access/auth.service';
import { RegisterService } from './shared/data-access/register.service';

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
  <button (click)="login()">login</button>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  messageService = inject(MessageService);
  authService = inject(AuthService);
  registerService = inject(RegisterService);

  login() {
    this.registerService.createUser$.next({email: "test@test.com", password: "password"});
  }

}
