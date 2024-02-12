import { UserDetails } from "./user";

export interface Message {
    uid?: string,
    content: string;
    sender: string;
    created: string;
}

export interface MessageDetails {
    uid?: string,
    content: string;
    sender: UserDetails | undefined;
    isCurrentUser: boolean;
    created: string;
}
