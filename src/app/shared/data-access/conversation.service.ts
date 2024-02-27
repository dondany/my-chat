import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  addDoc,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import { collectionData, docData } from 'rxfire/firestore';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  defer,
  distinct,
  distinctUntilKeyChanged,
  exhaustMap,
  filter,
  ignoreElements,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FIRESTORE } from '../../app.config';
import { Conversation, CreateConversation } from '../model/conversation';
import { LatestMessage } from '../model/latest-message';
import { AuthService } from './auth.service';
import { LatestMessageService } from './latest-message.service';

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
  private latestMessageService = inject(LatestMessageService);

  private authUser$ = toObservable(this.authService.user);
  private latestMessages$ = toObservable(
    this.latestMessageService.latestMessages,
  );

  //sources
  conversations$ = this.authUser$.pipe(
    filter((user) => !!user),
    switchMap((user) => this.getConversations(user!.uid)),
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
        combineLatest([this.conversations$, this.latestMessages$]).pipe(
          map(([conversations, latestMessages]) => {
            return conversations.map((conversation: Conversation) => {
              const latestMessage = latestMessages
                .filter(
                  (lm) =>
                    lm.conversationUid !== this.currentConversation()?.uid,
                )
                .filter((lm) => lm.conversationUid === conversation.uid)
                .find((lm) => lm.messageUid !== conversation.latestMessageUid);
              return {
                ...conversation,
                imgUrls: this.getImgUrls(conversation),
                name: this.getName(conversation),
                newMessage: latestMessage,
              } as Conversation;
            });
          }),
          map((conversations) => ({ conversations })),
        ),
      )
      .with(
        this.currentConversation$.pipe(
          switchMap((conversationId) => this.getConversation(conversationId)),
          filter((conversation) => !!conversation),
          map((conversation) => ({
            ...conversation,
            imgUrls: this.getImgUrls(conversation),
            name: this.getName(conversation),
          })),
          tap((currentConversation) =>
            localStorage.setItem('latestConversation', currentConversation.uid),
          ),
          map((currentConversation) => ({ currentConversation })),
        ),
      )
      .with(
        this.add$.pipe(
          exhaustMap((conversation) => this.createConversation(conversation)),
          ignoreElements(),
          catchError((error) => of({ error })),
        ),
      )
      .with(
        this.update$.pipe(
          exhaustMap((conversation) => this.updateConversation(conversation)),
          ignoreElements(),
          catchError((error) => of({ error })),
        ),
      );

    const latestConversationUid = localStorage.getItem('latestConversation');

    // if (!!latestConversationUid) {
    //   this.currentConversation$.next(latestConversationUid);
    // } else {
    //   if (this.conversations().length > 0) {
    //     this.currentConversation$.next(this.conversations()[0].uid);
    //   }
    // }
  }

  getConversations(userUid: string) {
    const conversationsCollection = query(
      collection(this.firestore, 'conversations'),
      where('memberIds', 'array-contains', userUid),
    );

    return collectionData(conversationsCollection, {
      idField: 'uid',
    }) as Observable<Conversation[]>;
  }

  getConversation(conversationUid: string) {
    const conversationDoc = doc(
      this.firestore,
      'conversations',
      conversationUid,
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
    if (conversation.name !== null && conversation.name !== '') {
      return conversation.name;
    }

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
      `conversations/${conversation.uid}`,
    );
    return defer(() =>
      updateDoc(conversationDoc, {
        memberIds: conversation.memberIds,
        members: conversation.members,
        name: conversation.name,
      }),
    );
  }

  isNewMessage(latestMessage: LatestMessage, latestMessageUid: string) {
    if (!latestMessage || latestMessage.messageUid !== latestMessageUid) {
      return true;
    }
    return false;
  }
}
