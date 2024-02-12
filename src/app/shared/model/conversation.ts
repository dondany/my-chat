import { Member, UserDetails } from "./user";

export interface Conversation {
    uid: string;
    name: string;
    type?: 'PRIVATE' | 'GROUP';
    memberIds?: string[];
    members?: Member[];
    created?: string;
    updated?: string;
    createdBy?: string;
    latestMessage?: string;
    latestMessageUid?: string;
    imgUrls?: string[];
    newMessage?: boolean;
}

export interface CreateConversation {
    name: string;
    type: 'PRIVATE' | 'GROUP';
    memberIds: string[];
    members: Member[];
}
