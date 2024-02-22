import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-add-members-dialog',
  template: `
    <div class="">
      <h1 mat-dialog-title>Change name</h1>
      <form
        [formGroup]="form"
        (submit)="onSubmit()"
        mat-dialog-content
        class="w-full"
      >
        <mat-form-field class="w-full">
          <mat-label>Name</mat-label>
          <input
            matInput
            placeholder="Enter name..."
            formControlName="nameFormControl"
          />
        </mat-form-field>
        <div class="flex justify-end">
          <button mat-raised-button type="Submit" color="primary">
            Change name
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
export class ChangeConversationNameDialogComponent {
  nameFormControl: FormControl = new FormControl<string>(this.data.name);
  form = new FormGroup({
    nameFormControl: this.nameFormControl,
  });

  constructor(
    public dialogRef: MatDialogRef<ChangeConversationNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
  ) {}

  onSubmit() {
    this.dialogRef.close({ data: this.nameFormControl.getRawValue() });
  }
}
