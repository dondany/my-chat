import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Conversation } from '../model/conversation';
import { collection, doc, query } from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import { Observable, Subject, map, switchMap } from 'rxjs';
import { connect } from 'ngxtension/connect';

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

  //sources
  conversations$ = this.getConversations();
  currentConversation$ = new Subject<string>();

  //state
  private state = signal<ConversationState>({
    conversations: [],
    currentConversation: null,
    error: null,
  });

  //selectors
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

  getConversations() {
    const converstationCollection = query(
      collection(this.firestore, 'conversations')
    );

    return collectionData(converstationCollection, {
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
