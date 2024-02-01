import { Injectable, computed, inject, signal } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { AUTH, FIRESTORE } from '../../app.config';
import { connect } from 'ngxtension/connect';
import { Credentials } from '../model/credentials';
import { from, defer, map, Observable, switchMap } from 'rxjs';
import { UserDetails } from '../model/user';
import { UserService } from './user.service';
import { docData } from 'rxfire/firestore';
import { doc } from 'firebase/firestore';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
  userDetails: UserDetails | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);
  private firestore = inject(FIRESTORE);

  //sources
  private user$ = authState(this.auth);

  //state
  private state = signal<AuthState>({
    user: undefined,
    userDetails: undefined,
  });

  //selectors
  user = computed(() => this.state().user);
  userDetails = computed(() => this.state().userDetails);

  constructor() {
    connect(this.state)
      .with(this.user$.pipe(map((user) => ({ user }))))
      .with(
        this.user$.pipe(
          switchMap((user) => this.getAuthenticatedUserDetails(user!.uid)),
          map((userDetails) => ({ userDetails }))
        )
      );
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  logout() {
    signOut(this.auth);
  }

  register(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  getAuthenticatedUserDetails(uid: string) {
    const user = doc(this.firestore, `users/${uid}`);

    return docData(user, { idField: 'uid' }) as Observable<UserDetails>;
  }

}
