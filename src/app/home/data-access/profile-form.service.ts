import { Injectable, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../shared/data-access/auth.service";
import { UserService } from "../../shared/data-access/user.service";
import { Subject } from "rxjs";
import { UserUpdate } from "../../shared/model/user";

@Injectable()
export class ProfileFormService {
    private authService = inject(AuthService);
    private userService = inject(UserService);

    readonly form = inject(FormBuilder).group({
        firstName: [this.authService.userDetails()?.firstName, [Validators.required]],
        lastName: [this.authService.userDetails()?.lastName, [Validators.required]],
        email: ["", []],
        password: ["", []]
    });

    onSubmit() {
        const userUpdate = {
            firstName: this.form.value!.firstName,
            lastName: this.form.value!.lastName,
        } as UserUpdate;
        this.userService.update$.next(userUpdate);
    }
}