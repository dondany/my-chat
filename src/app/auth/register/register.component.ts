import { Component, Inject, inject } from "@angular/core";
import { RegisterService } from "./data-access/register.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    standalone: true,
    selector: 'app-register',
    template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label for="email"></label>
        <input formControlName="email" type="email" id="email">
        
        <label for="password"></label>
        <input formControlName="password" type="password" id="password">

        <button type="submit">Submit</button>

    </form>
    `,
    imports: [ReactiveFormsModule],
    providers: [RegisterService]
})
export default class RegisterComponent {
    registerService =  inject(RegisterService);

    private fb = inject(FormBuilder);

    form = this.fb.nonNullable.group({
       email: ['', [Validators.email, Validators.required]],
       password: ['', [Validators.required]]
    });

    onSubmit() {
        this.registerService.createUser$.next(this.form.getRawValue());
    }
}