import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../shared/data-access/auth.service';
import { Subject, catchError, map, switchMap, EMPTY, tap, defer } from 'rxjs';
import { Credentials } from '../../../shared/model/credentials';
import { connect } from 'ngxtension/connect';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { FIRESTORE } from '../../../app.config';
import { User } from '../../../shared/model/user';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);
  private firestore = inject(FIRESTORE);

  //sources
  error$ = new Subject<any>();
  createUser$ = new Subject<Credentials>();

  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.register(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    ),
    switchMap((credentials) => {
        const user = credentials.user;
        const uid = user.uid!;
        const username = user.email!;

        return this.createUser(uid, username);
    })
  );

  //state
  private state = signal<RegisterState>({
    status: 'pending',
  });

  //selectors
  status = computed(() => this.state().status);

  constructor() {
    //reducers
    connect(this.state)
      .with(this.userCreated$.pipe(map(() => ({ status: 'success' }))))
      // .with(this.createUser$.pipe(map(() => ({ status: 'creating' }))))
      .with(this.error$.pipe(map(() => ({ status: 'error' }))));
  }

  createUser(uid: string, username: string) {
    const newUser: User ={
        username,
        avatar: 'https://i.pravatar.cc/50?img=' + Math.floor(Math.random() * 49 + 1),
    };
    return defer(() => setDoc(doc(this.firestore, 'users', uid), newUser)); 
  }
}
