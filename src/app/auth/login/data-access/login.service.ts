import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../shared/data-access/auth.service';
import { EMPTY, Subject, catchError, map, switchMap, tap } from 'rxjs';
import { Credentials } from '../../../shared/model/credentials';
import { connect } from 'ngxtension/connect';
import { Router } from '@angular/router';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  //sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    ),
  );

  //state
  private state = signal<LoginState>({
    status: 'pending',
  })

  //selectors
  status = computed(() => this.state().status);

  constructor() {
    //reducers
    connect(this.state)
    .with(this.userAuthenticated$.pipe(map(() => ({status: 'success'}))))
    .with(this.login$.pipe(map(() => ({status: 'authenticating'}))))
    .with(this.error$.pipe(map(() => ({status: 'error'}))))

  }
}
