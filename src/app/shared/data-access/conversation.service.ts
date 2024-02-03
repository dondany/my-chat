import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Conversation, CreateConversation } from '../model/conversation';
import {
  addDoc,
  collection,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  defer,
  exhaustMap,
  filter,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { connect } from 'ngxtension/connect';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserDetails } from '../model/user';
import { MessageService } from './message.service';

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
  private messageService = inject(MessageService);

  private authUser$ = toObservable(this.authService.user);

  //sources
  conversations$ = this.authUser$.pipe(
    filter((user) => !!user),
    switchMap((user) => this.getConversations(user!.uid))
  );
  currentConversation$ = new Subject<string>();
  add$ = new Subject<CreateConversation>();
  update$ = new Subject<Conversation>();

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
        this.conversations$.pipe(
          map((conversations) => {
            return conversations.map((conversation) => ({
              ...conversation,
              imgUrls: this.getImgUrls(conversation),
              name: this.getName(conversation),
            }));
          }),
          map((conversations) => ({ conversations }))
        )
      )
      .with(
        this.currentConversation$.pipe(
          switchMap((conversationId) => this.getConversation(conversationId)),
          map((conversation) => ({
            ...conversation,
            imgUrls: this.getImgUrls(conversation),
            name: this.getName(conversation),
          })),
          tap((conversation) =>
            this.messageService.currentConversation$.next(conversation)
          ),
          map((currentConversation) => ({ currentConversation }))
        )
      )
      .with(
        this.add$.pipe(
          exhaustMap((conversation) => this.createConversation(conversation)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      )
      .with(
        this.update$.pipe(
          exhaustMap((conversation) => this.updateConversation(conversation)),
          ignoreElements(),
          catchError((error) => of({ error }))
        )
      );
  }

  getConversations(userUid: string) {
    const conversationsCollection = query(
      collection(this.firestore, 'conversations'),
      where('memberIds', 'array-contains', userUid)
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

  createConversation(conversation: CreateConversation) {
    const conversationCollection = collection(this.firestore, 'conversations');
    return defer(() => addDoc(conversationCollection, conversation));
  }

  getImgUrls(conversation: Conversation) {
    return conversation.members
      ?.filter((m) => m.uid !== this.authService.user()?.uid)
      .map((m) => m.imgUrl)
      .slice(0, 2);
  }

  getName(conversation: Conversation) {
    let name = conversation.members
      ?.filter((m) => m.uid !== this.authService.user()?.uid)
      .map((m) => m.username)
      .slice(0, 2)
      .join(', ');

    if (!name) {
      return 'Unknown conversation';
    }

    if (conversation.members?.length! > 2) {
      name += '...';
    }

    return name;
  }

  updateConversation(conversation: Conversation) {
    const conversationDoc = doc(
      this.firestore,
      `conversations/${conversation.uid}`
    );
    return defer(() =>
      updateDoc(conversationDoc, {
        memberIds: conversation.memberIds,
        members: conversation.members,
      })
    );
  }
}
