import { Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  and,
  collection,
  limit,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import { collectionData } from 'rxfire/firestore';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { FIRESTORE } from '../../app.config';
import { UserDetails } from '../model/user';

interface UserState {
  users: UserDetails[];
  error: string | null;
}

@Injectable()
export class FindUsersService {
  private firestore = inject(FIRESTORE);
  private formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.group({
    username: ['', [Validators.required]],
  });

  get username() {
    return this.form.get('username')!;
  }

  //state
  private state = signal<UserState>({
    users: [],
    error: null,
  });

  //sources
  username$ = this.username.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  );

  //selectors
  users = computed(() => this.state().users);

  constructor() {
    connect(this.state).with(
      this.username$.pipe(
        switchMap((username) => this.getUsers(username!)),
        map((users) => ({ users })),
      ),
    );
  }

  getUsers(username: string) {
    if (!username) {
      return of([]);
    }
    const usersCollection = query(
      collection(this.firestore, 'users'),
      and(
        where('username', '>=', username),
        where('username', '<=', username + '\uf8ff'),
      ),
      orderBy('username'),
      limit(50),
    );

    return collectionData(usersCollection, { idField: 'uid' }) as Observable<
      UserDetails[]
    >;
  }
}
