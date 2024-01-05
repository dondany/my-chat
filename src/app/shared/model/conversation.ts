import { UserDetails } from "./user";

export interface Conversation {
    uid: string;
    name: string;
    type?: 'PRIVATE' | 'GROUP';
    members?: string[];
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
