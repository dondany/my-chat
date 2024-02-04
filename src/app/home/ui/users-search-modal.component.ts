import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../shared/data-access/user.service';
import { MatChipsModule } from '@angular/material/chips';
import { Member, UserDetails } from '../../shared/model/user';
import { MatIconModule } from '@angular/material/icon';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ConversationService } from '../../shared/data-access/conversation.service';
import { CreateConversation } from '../../shared/model/conversation';
import { AuthService } from '../../shared/data-access/auth.service';

@Component({
  standalone: true,
  selector: 'app-users-search-modal',
  template: `
    <div class="w-[640px]">
      <h1 mat-dialog-title>Create new conversation</h1>
      <form
        [formGroup]="form"
        (submit)="onSubmit()"
        mat-dialog-content
        class="w-full"
      >
        <mat-form-field class="w-full">
          <mat-label>Name</mat-label>
          <input matInput type="text" formControlName="nameFormControl" />
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Members</mat-label>
          <mat-chip-grid #chipGrid aria-lable="Members">
            @for (user of members; track user) {
            <mat-chip-row (removed)="remove(user)" class="bg-white">
              <div class="flex justify-center items-center gap-2">
                <img [src]="user.imgUrl" class="w-6 h6 rounded-full" />
                {{ user.username }}
              </div>
              <button
                matChipRemove
                [attr.aria-label]="'remove ' + user.username"
              >
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
            }
          </mat-chip-grid>
          <input
            placeholder="Add member..."
            #memberInput
            formControlName="usernameFormControl"
            [matChipInputFor]="chipGrid"
            [matAutocomplete]="auto"
            [matChipInputSeparatorKeyCodes]="separatorKeyCodes"
          />
          <mat-autocomplete
            #auto="matAutocomplete"
            (optionSelected)="selected($event)"
          >
            @for (user of users | async; track $index) {
            <mat-option [value]="user">
              <div class="flex justify-center items-center gap-2">
                <img [src]="user.imgUrl" class="w-8 h8 rounded-full" />
                {{ user.username }}
              </div>
            </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
        <div class="flex justify-end">
          <button mat-raised-button type="Submit" color="primary">
            Create
          </button>
        </div>
      </form>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatButtonModule,
  ],
})
export class UsersSearchModalComponent {
  userService = inject(UserService);
  conversationService = inject(ConversationService);
  authService = inject(AuthService);

  separatorKeyCodes: number[] = [ENTER, COMMA];
  members: UserDetails[] = [];
  users: Observable<UserDetails[]> = toObservable(this.userService.users);

  nameFormControl: FormControl = new FormControl<string>('');

  form = new FormGroup({
    usernameFormControl: this.userService.usernameFromControl,
    nameFormControl: this.nameFormControl,
  });

  @ViewChild('memberInput') memberInput!: ElementRef<HTMLInputElement>;

  constructor(public dialogRef: MatDialogRef<UsersSearchModalComponent>) {}

  remove(member: UserDetails) {
    const index = this.members.indexOf(member);

    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    if (!this.members.find((m) => m.uid === event.option.value.uid)) {
      this.members.push(event.option.value);
    }
    this.memberInput.nativeElement.value = '';
    this.userService.usernameFromControl.reset();
  }

  onSubmit() {
    const memberUids = this.members.map((member) => member.uid);
    const newConversation: CreateConversation = {
      name: this.nameFormControl.getRawValue(),
      type: this.members.length < 2 ? 'PRIVATE' : 'GROUP',
      memberIds: [...memberUids, this.authService.user()!.uid],

      members: [...this.members, { ...this.authService.userDetails()!, admin: true}],
    };
    this.conversationService.add$.next(newConversation);
    this.dialogRef.close();
  }
}
