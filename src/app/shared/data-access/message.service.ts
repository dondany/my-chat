import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Message, MessageDetails } from '../model/message';
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
import { collectionData } from 'rxfire/firestore';
import { AuthService } from './auth.service';
import { Conversation } from '../model/conversation';

interface MessageState {
  messages: MessageDetails[];
  error: string | null;
  currentConversation: Conversation | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  //sources
  currentConversation$ = new Subject<Conversation>();
  conversation$ = new Subject<string>();
  add$ = new Subject<string>();

  //state
  private state = signal<MessageState>({
    messages: [],
    error: null,
    currentConversation: null,
  });

  //selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  constructor() {
    //reducers
    connect(this.state)
      .with(
        this.currentConversation$.pipe(
          map((currentConversation) => ({ currentConversation }))
        )
      )
      .with(
        this.currentConversation$.pipe(
          switchMap((conversation) => this.getMessages(conversation.uid)),
          map((messages) => 
            messages.map((message) => ({
              ...message,
              sender: this.mapMember(message.sender),
              isCurrentUser: this.isCurrentUser(message.sender),
            }))
          ),
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
      sender: this.authService.user()?.uid!,
      created: Date.now().toString(),
    };

    const conversationUid = this.state().currentConversation?.uid;
    const messagesCollection = collection(
      this.firestore,
      `conversations/${conversationUid}/messages`
    );
    return defer(() => addDoc(messagesCollection, newMessage));
  }

  private getMessages(conversationUid: string) {
    const messagesCollection = query(
      collection(this.firestore, `conversations/${conversationUid}/messages`),
      orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse())
    ) as Observable<Message[]>;
  }

  private mapMember(uid: string) {
    if (!this.state() && !this.state().currentConversation) {
      return undefined;
    }
    return this.state()?.currentConversation?.members?.find(
      (member) => member.uid === uid
    );
  }

  private isCurrentUser(uid: string) {
    return this.authService.user()?.uid === uid;
  }
}
