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
import {
  from,
  defer,
  map,
  Observable,
  switchMap,
  tap,
  filter,
  EMPTY,
  of,
  pairwise,
  Subject,
} from 'rxjs';
import { UserDetails } from '../model/user';
import { docData } from 'rxfire/firestore';
import { doc } from 'firebase/firestore';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  //sources
  private user$ = authState(this.auth);
  private update$ = new Subject<void>();

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
      .with(this.user$.pipe(
        tap(() => this.router.navigate(['home'])),
        map((user) => ({ user })))
        )
      .with(
        this.user$.pipe(
          switchMap((user) => this.getAuthenticatedUserDetails(user)),
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

  getAuthenticatedUserDetails(user: AuthUser) {
    if (!user) {
      return of(undefined);
    }
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return docData(userDoc, { idField: 'uid' }) as Observable<UserDetails>;
  }
}
