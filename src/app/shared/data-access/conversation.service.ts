import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Conversation } from '../model/conversation';
import { collection, doc, query, where } from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import { Observable, Subject, filter, map, retry, switchMap, tap } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { AuthService, AuthUser } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  private authUser$ = toObservable(this.authService.user);

  //sources
  conversations$ = this.authUser$.pipe(
    filter((user) => !!user),
    switchMap((user) => this.getConversations(user!.uid))
  );
  currentConversation$ = new Subject<string>();

  //state
  private state = signal<ConversationState>({
    conversations: [],
    currentConversation: null,
    error: null,
  });

  //selectors
  conversations = computed(() => this.state().conversations);
  currentConversation = computed(() => this.state().currentConversation);

  constructor() {
    //reducers
    connect(this.state)
      .with(
        this.conversations$.pipe(map((conversations) => ({ conversations })))
      )
      .with(
        this.currentConversation$.pipe(
          switchMap((conversationId) => this.getConversation(conversationId)),
          map((currentConversation) => ({ currentConversation }))
        )
      );
  }

  getConversations(userUid: string) {
    const conversationsCollection = query(
      collection(this.firestore, 'conversations'),
      where('members', 'array-contains', userUid)
    );

    return collectionData(conversationsCollection, {
      idField: 'uid',
    }) as Observable<Conversation[]>;
  }

  getConversation(conversationUid: string) {
    const conversationDoc = doc(
      this.firestore,
      'conversations',
      conversationUid
    );
    return docData(conversationDoc, {
      idField: 'uid',
    }) as Observable<Conversation>;
  }
}
