import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title ? data.title : title }}</h2>
    <mat-dialog-content>
      {{ data.message? data.message : message }}
    </mat-dialog-content>
    <mat-dialog-actions class="flex">
      <button mat-stroked-button mat-dialog-close cdkFocusInitial color="warn" class="ml-auto">
        Cancel
      </button>
      <button
        mat-raised-button
        mat-dialog-close
        (click)="onYes()"
        color="primary"
      >
        Yes
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class ConfirmDialogComponent {
  title: string = 'Warning';
  message: string = 'Are you sure?';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onYes() {
    this.dialogRef.close({ data: true });
  }
}
