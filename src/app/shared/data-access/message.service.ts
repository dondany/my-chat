import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { addDoc, collection, limit, orderBy, query } from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import { collectionData } from 'rxfire/firestore';
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
import { FIRESTORE } from '../../app.config';
import { Conversation } from '../model/conversation';
import { LatestMessage } from '../model/latest-message';
import { Message, MessageDetails } from '../model/message';
import { AuthService } from './auth.service';
import { ConversationService } from './conversation.service';
import { LatestMessageService } from './latest-message.service';

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
  private conversationService = inject(ConversationService);
  private latestMessageService = inject(LatestMessageService);

  //sources
  currentConversation$ = toObservable(
    this.conversationService.currentConversation,
  );
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
          map((currentConversation) => ({ currentConversation })),
        ),
      )
      .with(
        this.currentConversation$.pipe(
          switchMap((conversation) =>
            conversation ? this.getMessages(conversation!.uid) : [],
          ),
          tap((messages) => this.addLatestMessage(messages)),
          map((messages) =>
            messages.map((message) => ({
              uid: message.uid,
              ...message,
              sender: this.mapMember(message.sender),
              isCurrentUser: this.isCurrentUser(message.sender),
            })),
          ),
          map((messages) => ({ messages })),
        ),
      )
      .with(
        this.add$.pipe(
          exhaustMap((message) => this.addMessage(message)),
          ignoreElements(),
          catchError((error) => of({ error })),
        ),
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
      `conversations/${conversationUid}/messages`,
    );
    return defer(() => addDoc(messagesCollection, newMessage));
  }

  private getMessages(conversationUid: string) {
    const messagesCollection = query(
      collection(this.firestore, `conversations/${conversationUid}/messages`),
      orderBy('created', 'desc'),
      limit(50),
    );

    return collectionData(messagesCollection, { idField: 'uid' }).pipe(
      map((messages) => [...messages].reverse()),
    ) as Observable<Message[]>;
  }

  private mapMember(uid: string) {
    if (!this.state() && !this.state().currentConversation) {
      return undefined;
    }
    return this.state()?.currentConversation?.members?.find(
      (member) => member.uid === uid,
    );
  }

  private isCurrentUser(uid: string) {
    return this.authService.user()?.uid === uid;
  }

  private addLatestMessage(messages: Message[]) {
    if (!messages || messages.length === 0) {
      return;
    }
    const lastMessage = messages[messages.length - 1];
    const latestMessage = {
      conversationUid: this.conversationService.currentConversation()?.uid,
      userUid: this.authService.user()?.uid,
      messageUid: lastMessage.uid,
      messageCreated: lastMessage.created,
    } as LatestMessage;
    this.latestMessageService.set$.next(latestMessage);
  }
}
