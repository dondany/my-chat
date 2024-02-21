import { Injectable, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  doc,
  updateDoc
} from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import {
  Subject,
  catchError,
  defer,
  exhaustMap,
  ignoreElements,
  of
} from 'rxjs';
import { FIRESTORE } from '../../app.config';
import { UserUpdate } from '../model/user';
import { AuthService } from './auth.service';
import { ImageUploadService } from './image-upload.service';

export interface UserUpdateState {
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(FIRESTORE);
  private imageUploadService = inject(ImageUploadService);
  private authService = inject(AuthService);

  usernameFromControl = new FormControl();

  //sources
  profilePicture$ = new Subject<File>();
  updateDetails$ = new Subject<UserUpdate>();
  updateEmail$ = new Subject<string>();
  updatePassword$ = new Subject<string>();

  //selectors
  private state = signal<UserUpdateState>({
    error: null,
  })

  constructor() {
    //reducers
    connect(this.state)
      .with(
        this.profilePicture$.pipe(
          exhaustMap((file) => this.updateProfilePicture(file)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      )
      .with(
        this.updateDetails$.pipe(
          exhaustMap((userUpdate) => this.update(userUpdate)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      )
      .with(
        this.updateEmail$.pipe(
          exhaustMap((email) => this.updateEmail(email)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      )
      .with(
        this.updatePassword$.pipe(
          exhaustMap((password) => this.updatePassword(password)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      );
  }

  //todo - probably should me moved to ImageUploadService to be able to track the upload progress?
  updateProfilePicture(file: File) {
    return this.imageUploadService.uploadImage(file).pipe(
      exhaustMap((imgUrl) => {
        const userDoc = doc(
          this.firestore,
          `users/${this.authService.userDetails()!.uid}`
        );
        return defer(() => updateDoc(userDoc, { imgUrl }));
      })
    );
  }

  private update(userUpdate: UserUpdate) {
    const userDoc = doc(
      this.firestore,
      `users/${this.authService.userDetails()!.uid}`
    );
    return defer(() => updateDoc(userDoc, { ...userUpdate }));
  }

  private updateEmail(email: string) {
    return this.authService.updateEmail(email);
  }

  private updatePassword(password: string) {
    return this.authService.updatePassword(password);
  }
}
