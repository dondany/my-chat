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
} from 'rxjs';
import { UserDetails } from '../model/user';
import { docData } from 'rxfire/firestore';
import { doc } from 'firebase/firestore';
import { Router } from '@angular/router';

export type AuthUser = {
  user: User;
  userDetails: UserDetails;
};

interface AuthState {
  user: AuthUser | undefined | null;
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

  //state
  private state = signal<AuthState>({
    user: undefined,
  });

  //selectors
  user = computed(() => (!!this.state().user ? this.state().user!.user : null));
  userDetails = computed(() =>
    !!this.state().user ? this.state().user!.userDetails : null
  );

  constructor() {
    connect(this.state).with(
      this.user$.pipe(
        switchMap((user) => this.getAuthenticatedUserDetails(user)),
        pairwise(),
        tap(([oldUser, newUser]) => {
          if (!oldUser) {
            this.router.navigate(['home']);
          }
        }),
        map(([oldUser, newUser]) => ({ user: newUser }))
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

  getAuthenticatedUserDetails(user: User | null) {
    if (!user) {
      return of(null);
    }
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    const details = docData(userDoc, {
      idField: 'uid',
    }) as Observable<UserDetails>;
    return details.pipe(
      map((details) => ({ user: user, userDetails: details } as AuthUser))
    );
  }
}
