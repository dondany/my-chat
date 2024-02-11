import { computed, inject, signal } from "@angular/core";
import { FIRESTORE } from "../../app.config";
import { AuthService } from "./auth.service";
import { LatestMessage } from "../model/latest-message";
import { ConversationService } from "./conversation.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { connect } from "ngxtension/connect";
import { Observable, filter, map, switchMap } from "rxjs";
import { collection, query, where } from "firebase/firestore";
import { collectionData } from "rxfire/firestore";

interface LatestMessageState {
    latestMessages: LatestMessage[];
    error: string | null;
}

export class LatestMessageService {
    private firestore = inject(FIRESTORE);
    private authService = inject(AuthService);
    private conversationService = inject(ConversationService);

    private authUser$ = toObservable(this.authService.user);

    //sources
    latestMessages$ = this.authUser$.pipe(
        filter((user) => !!user),
        switchMap((user) => this.getLatestMessages(user!.uid)))
    )
    currentConversation$ = toObservable(this.conversationService.currentConversation);

    //state
    private state = signal<LatestMessageState>({
        latestMessages: [],
        error: null
    });

    //selectors
    latestMessages = computed(() => this.state().latestMessages);
    error = computed(() => this.state().error);

    constructor() {
        //reducers
        connect(this.state)
            .with(
                this.latestMessages$.pipe(
                    map((latestMessages) => ({ latestMessages }))
                )
            )
    }

    getLatestMessages(userId: string) {
        const latestMessageCollection = query(
            collection(this.firestore, 'latestMessages'),
            where('userUid', '==', userId)
        );

        return collectionData(latestMessageCollection, {
            idField: 'uid',
        }) as Observable<LatestMessage[]>;
    }

}