import { Injectable, computed, inject, signal } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Message } from '../model/message';
import { connect } from 'ngxtension/connect';
import { Observable, map, tap } from 'rxjs';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';

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
  messages$ = this.getMessages();

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
    connect(this.state).with(
      this.messages$.pipe(
        tap((m) => console.log(m)),
        map((messages) => ({ messages }))
      )
    );
  }

  private getMessages() {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
    //   orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      tap((messages) => console.log(messages)),
      map((messages) => [...messages].reverse())
    ) as Observable<Message[]>;
  }
}
