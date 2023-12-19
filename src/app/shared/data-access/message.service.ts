import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Message } from '../model/message';
import { connect } from 'ngxtension/connect';
import { Observable, Subject, map, switchMap, tap } from 'rxjs';
import { collection, doc, limit, orderBy, query } from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import { Conversation } from '../model/conversation';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);

  //sources
  // messages$ = this.getMessages();
  currentConversation$ = new Subject<Conversation>;
  conversation$ = new Subject<string>;

  //state
  private state = signal<MessageState>({
    messages: [],
    error: null,
  });

  //selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  constructor() {
    //reducers
    connect(this.state)
    .with(this.currentConversation$.pipe(
      switchMap((conversation) => this.getMessages(conversation.uid)),
      map((messages) => ({ messages }))));
  }

  private getMessages(conversationUid: string) {
    const messagesCollection = query(
      collection(this.firestore, `conversations/${conversationUid}/messages`),
      //   orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
        map((messages) => [...messages].reverse())
      ) as Observable<Message[]>;
  }
}
