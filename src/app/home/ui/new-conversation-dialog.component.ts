import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/data-access/auth.service';
import { ConversationService } from '../../shared/data-access/conversation.service';
import { FindUsersService } from '../../shared/data-access/find-users.service';
import { CreateConversation } from '../../shared/model/conversation';
import { UserDetails } from '../../shared/model/user';

@Component({
  standalone: true,
  selector: 'app-new-conversation-dialog',
  template: `
    <div class="w-[640px]">
      <h1 mat-dialog-title>Create new conversation</h1>
      <form
        [formGroup]="findUsersService.form"
        (submit)="onSubmit()"
        mat-dialog-content
        class="w-full"
      >
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
            formControlName="username"
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
  providers: [FindUsersService],
})
export class NewConversationDialogComponent {
  findUsersService = inject(FindUsersService);
  conversationService = inject(ConversationService);
  authService = inject(AuthService);

  separatorKeyCodes: number[] = [ENTER, COMMA];
  members: UserDetails[] = [];
  users: Observable<UserDetails[]> = toObservable(this.findUsersService.users);

  @ViewChild('memberInput') memberInput!: ElementRef<HTMLInputElement>;

  constructor(public dialogRef: MatDialogRef<NewConversationDialogComponent>) {}

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
    this.findUsersService.username.reset();
  }

  onSubmit() {
    const memberUids = this.members.map((member) => member.uid);
    const newConversation: CreateConversation = {
      name: this.findUsersService.username.getRawValue(),
      type: this.members.length < 2 ? 'PRIVATE' : 'GROUP',
      memberIds: [...memberUids, this.authService.user()!.uid],
      members: [
        ...this.members,
        { ...this.authService.userDetails()!, admin: true, owner: true },
      ],
    };
    console.log(newConversation);
    this.conversationService.add$.next(newConversation);
    this.dialogRef.close();
  }
}
