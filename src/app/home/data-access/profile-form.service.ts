import { Injectable, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroupDirective, Validators } from "@angular/forms";
import { AuthService } from "../../shared/data-access/auth.service";
import { UserService } from "../../shared/data-access/user.service";
import { Subject } from "rxjs";
import { UserUpdate } from "../../shared/model/user";
import { confirmPasswordValidator } from "../../shared/validators/confirm-password.validator";

@Injectable()
export class ProfileFormService {
    private authService = inject(AuthService);
    private userService = inject(UserService);

    readonly form = inject(FormBuilder).group({
        firstName: [this.authService.userDetails()?.firstName, [Validators.required]],
        lastName: [this.authService.userDetails()?.lastName, [Validators.required]],
        email: [this.authService.userDetails()?.email, [Validators.email]],
        password: ["", []],
        confirmPassword: ["", []],
    },
    { validators: [confirmPasswordValidator] }
    );

    get password() {
        return this.form.get("password")!;
    }

    get confirmPassword() {
        return this.form.get("confirmPassword")!;
    }

    constructor() {
        this.password.valueChanges.subscribe((value) => {
            if (!value) {
               this.confirmPassword.removeValidators(Validators.required);
            } else {
                this.confirmPassword.addValidators(Validators.required);
            }
        });
    }

    confirmErrorMatcher = {
        isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
            const controlInvalid = control.touched && control.invalid;
            const formInvalid = control.touched && this.confirmPassword.touched && this.form.invalid;
            return controlInvalid || formInvalid;
        }
    }

    onSubmit() {
        this.form.markAllAsTouched();
        if (!this.form.valid) {
            return;
        }

        const userUpdate = {
            firstName: this.form.value!.firstName,
            lastName: this.form.value!.lastName,
            email: this.form.value.email,
            password: this.form.value.password
        } as UserUpdate;
        this.userService.update$.next(userUpdate);
    }
}