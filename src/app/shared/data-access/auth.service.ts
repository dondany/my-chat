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
import { from, defer, map } from 'rxjs';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
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
  });

  //selectors
  user = computed(() => this.state().user);

  constructor() {
    connect(this.state).with(this.user$.pipe(map((user) => ({ user }))));
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
}
