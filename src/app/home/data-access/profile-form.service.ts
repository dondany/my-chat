import { Injectable, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroupDirective, Validators } from "@angular/forms";
import { AuthService } from "../../shared/data-access/auth.service";
import { UserService } from "../../shared/data-access/user.service";
import { Subject } from "rxjs";
import { UserUpdate } from "../../shared/model/user";
import { confirmPasswordValidator } from "../../shared/validators/confirm-password.validator";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable()
export class ProfileFormService {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private formBuilder = inject(FormBuilder);

    readonly userDetailsForm = this.formBuilder.group({
        firstName: [this.authService.userDetails()?.firstName, [Validators.required]],
        lastName: [this.authService.userDetails()?.lastName, [Validators.required]],
        email: [this.authService.userDetails()?.email, [Validators.email, Validators.required]],
    }
    );

    readonly passwordForm = this.formBuilder.group({
        password: ["", [Validators.required]],
        confirmPassword: ["", [Validators.required]],
    },
    { validators: [confirmPasswordValidator] }
    )

    get password() {
        return this.passwordForm.get("password")!;
    }

    get confirmPassword() {
        return this.passwordForm.get("confirmPassword")!;
    }

    confirmErrorMatcher = {
        isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
            const controlInvalid = control.touched && control.invalid;
            const formInvalid = control.touched && this.confirmPassword.touched && this.userDetailsForm.invalid;
            return controlInvalid || formInvalid;
        }
    }

    onUpdateDetails() {
        this.userDetailsForm.markAllAsTouched();
        if (!this.userDetailsForm.valid) {
            return;
        }

        let username = this.authService.userDetails()?.username;

        if (this.userDetailsForm.value!.firstName) {
            username = this.userDetailsForm.value!.firstName;
            if (this.userDetailsForm.value!.lastName) {
                username = username + ' ' + this.userDetailsForm.value!.lastName;
            }
        }
        
        const userUpdate = {
            firstName: this.userDetailsForm.value!.firstName,
            lastName: this.userDetailsForm.value!.lastName,
            email: this.userDetailsForm.value!.email,
            username: username,
        } as UserUpdate;
        this.userService.updateDetails$.next(userUpdate);
    }

    onUpdatePassword() {
        if (!this.passwordForm.valid) {
            return;
        }
        this.userService.updatePassword$.next(this.passwordForm.value!.password!);
    }
}