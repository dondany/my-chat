import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';
import { UserDetails } from '../model/user';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  debounceTime,
  defer,
  distinctUntilChanged,
  exhaustMap,
  filter,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { connect } from 'ngxtension/connect';
import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { FormControl } from '@angular/forms';
import { ImageUploadService } from './image-upload.service';

interface UserState {
  users: UserDetails[];
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
  username$ = this.usernameFromControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );
  profilePicture$ = new Subject<File>();

  //state
  private state = signal<UserState>({
    users: [],
    error: null,
  });

  //selectors
  users = computed(() => this.state().users);
  error = computed(() => this.state().error);

  constructor() {
    //reducers
    connect(this.state)
      .with(
        this.username$.pipe(
          switchMap((username) => this.getUsers(username)),
          map((users) => ({ users }))
        )
      )
      .with(
        this.profilePicture$.pipe(
          exhaustMap((file) => this.updateProfilePicture(file)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      );
  }

  getUsers(username: string) {
    if (!username) {
      return of([]);
    }
    const usersCollection = query(
      collection(this.firestore, 'users'),
      where('username', '>=', username),
      where('username', '<=', username + '\uf8ff'),
      orderBy('username'),
      limit(50)
    );

    return collectionData(usersCollection, { idField: 'uid' }) as Observable<
      UserDetails[]
    >;
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
}
