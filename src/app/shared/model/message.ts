import { UserDetails } from "./user";

export interface Message {
    content: string;
    sender: string;
    created: string;
}

export interface MessageDetails {
    content: string;
    sender: UserDetails | undefined;
    isCurrentUser: boolean;
    created: string;
}
