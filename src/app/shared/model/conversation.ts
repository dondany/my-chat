import { UserDetails } from "./user";

export interface Conversation {
    uid: string;
    name: string;
    type?: 'PRIVATE' | 'GROUP';
    memberIds?: string[];
    members?: UserDetails[];
    created?: string;
    updated?: string;
    createdBy?: string;
    lastMessage?: string;
}

export interface ConversationDetails {
    uid: string;
    name: string;
    type?: 'PRIVATE' | 'GROUP';
    members?: UserDetails[];
}

export interface CreateConversation {
    name: string;
    type: 'PRIVATE' | 'GROUP';
    members: string[];
}
