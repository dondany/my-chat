import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Message } from '../model/message';
import { connect } from 'ngxtension/connect';
import {
  Observable,
  Subject,
  catchError,
  defer,
  exhaustMap,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  addDoc,
  collection,
  doc,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import { Conversation } from '../model/conversation';
import { ConversationService } from './conversation.service';
import { AuthService } from './auth.service';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);
  private conversationService = inject(ConversationService);
  private authService = inject(AuthService);

  //sources
  currentConversation$ = new Subject<Conversation>();
  conversation$ = new Subject<string>();
  add$ = new Subject<string>();

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
      .with(
        this.conversationService.currentConversation$.pipe(
          switchMap((conversationUid) => this.getMessages(conversationUid)),
          map((messages) => ({ messages }))
        )
      )
      .with(
        this.add$.pipe(
          exhaustMap((message) => this.addMessage(message)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      );
  }

  private addMessage(message: string) {
    const newMessage: Message = {
      content: message,
      sender: this.authService.user()?.email!,
    };

    const conversationUid = this.conversationService.currentConversation()?.uid;
    const messagesCollection = collection(
      this.firestore,
      `conversations/${conversationUid}/messages`
    );
    return defer(() => addDoc(messagesCollection, newMessage));
  }

  private getMessages(conversationUid: string) {
    const messagesCollection = query(
      collection(this.firestore, `conversations/${conversationUid}/messages`),
        //  orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse())
    ) as Observable<Message[]>;
  }
}
