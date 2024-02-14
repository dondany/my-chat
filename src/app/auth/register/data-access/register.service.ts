import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../shared/data-access/auth.service';
import { Subject, catchError, map, switchMap, EMPTY, tap, defer } from 'rxjs';
import { Credentials } from '../../../shared/model/credentials';
import { connect } from 'ngxtension/connect';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { FIRESTORE } from '../../../app.config';
import { User } from '../../../shared/model/user';
import { Router } from '@angular/router';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);

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
    )
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

}
