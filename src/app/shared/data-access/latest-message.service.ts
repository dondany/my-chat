import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { collection, doc, query, setDoc, where } from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import { collectionData } from 'rxfire/firestore';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  defer,
  exhaustMap,
  filter,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FIRESTORE } from '../../app.config';
import { LatestMessage } from '../model/latest-message';
import { AuthService } from './auth.service';

interface LatestMessageState {
  latestMessages: LatestMessage[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class LatestMessageService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  private authUser$ = toObservable(this.authService.user);

  //sources
  latestMessages$ = this.authUser$.pipe(
    filter((user) => !!user),
    switchMap((user) => this.getLatestMessages(user!.uid)),
  );
  update$ = new Subject<LatestMessage>();
  set$ = new Subject<LatestMessage>();

  //state
  private state = signal<LatestMessageState>({
    latestMessages: [],
    error: null,
  });

  //selectors
  latestMessages = computed(() => this.state().latestMessages);
  error = computed(() => this.state().error);

  constructor() {
    //reducers
    connect(this.state)
      .with(
        this.latestMessages$.pipe(
          map((latestMessages) => ({ latestMessages })),
        ),
      )
      .with(
        this.set$.pipe(
          exhaustMap((latestMessage) => this.setLatestMessage(latestMessage)),
          ignoreElements(),
          catchError((error) => of({ error })),
        ),
      );
  }

  getLatestMessages(userId: string) {
    const latestMessageCollection = query(
      collection(this.firestore, 'latestMessages'),
      where('userUid', '==', userId),
    );

    return collectionData(latestMessageCollection, {
      idField: 'uid',
    }).pipe(map((o) => o)) as Observable<LatestMessage[]>;
  }

  setLatestMessage(latestMessage: LatestMessage) {
    const uid = latestMessage.conversationUid + '_' + latestMessage.userUid;
    const latestMessageCollection = doc(
      this.firestore,
      `latestMessages/${uid}`,
    );
    return defer(() => setDoc(latestMessageCollection, latestMessage));
  }
}
