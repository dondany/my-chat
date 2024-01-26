import { Component, inject } from "@angular/core";
import { LoginService } from "./data-access/login.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-login',
    template: `
    <a routerLink="/auth/register">Sign up</a>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label for="email"></label>
        <input formControlName="email" type="email" id="email">
        
        <label for="password"></label>
        <input formControlName="password" type="password" id="password">

        <button type="submit">Submit</button>

    </form>
    `,
    imports: [ReactiveFormsModule, RouterLink],
    providers: [LoginService]
})
export default class LoginComponent {
    loginService = inject(LoginService);

    private fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
       email: ['', [Validators.email, Validators.required]],
       password: ['', [Validators.required]]
    });

    onSubmit() {
        this.loginService.login$.next(this.form.getRawValue());
    }
}