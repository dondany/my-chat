import { Component, inject } from '@angular/core';
import { LoginService } from './data-access/login.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="h-screen flex flex-col items-center justify-center bg-indigo-50">
      <div class="bg-white p-10 rounded flex flex-col gap-6">
        <div class="flex justify-center">
            <span class="text-3xl text-indigo-600 font-['Pacifico']">Chats</span>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-3">
          <div class="flex gap-3 rounded border p-2">
            <mat-icon class="material-symbols-outlined text-indigo-400 scale-75">mail</mat-icon>
            <input formControlName="email" type="email" id="email" class="bg-white outline-none" placeholder="Enter your email"/>
          </div>

          <div class="flex gap-3 rounded border p-2">
            <mat-icon class="material-symbols-outlined text-indigo-400 scale-75">lock</mat-icon>
            <input formControlName="password" type="password" id="password" class="bg-white outline-none" placeholder="Enter your password"/>
          </div>

          <button type="submit" class="bg-indigo-400 text-white rounded p-2 h-10">Submit</button>
        </form>
      </div>
      <div class="m-4 text-sm text-gray-600">Don't have an account? <a routerLink="/auth/register" class="text-indigo-600">Sign up</a> now!</div>
    </div>
  `,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  providers: [LoginService],
})
export default class LoginComponent {
  loginService = inject(LoginService);

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    this.loginService.login$.next(this.form.getRawValue());
  }
}
