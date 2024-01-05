import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';
import { UserDetails } from '../model/user';
import { EMPTY, Observable, Subject, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { FormControl } from '@angular/forms';

interface UserState {
    users: UserDetails[],
    error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private firestore = inject(FIRESTORE);

    usernameFromControl = new FormControl();

    //sources
    username$ = this.usernameFromControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
    );

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
        .with(this.username$.pipe(
            switchMap((username) => this.getUsers(username)),
            map((users) => ({ users }))
        ));
    }

    getUsers(username: string) {
        if (!username) {
            return of([]);
        }
        const usersCollection = query(
            collection(this.firestore, 'users'),
            where('username', ">=", username),
            where("username", "<=", username + "\uf8ff"),
            orderBy('username'),
            limit(50)
        );

        return collectionData(usersCollection, {idField: 'uid'}) as Observable<UserDetails[]>;
    }
}



