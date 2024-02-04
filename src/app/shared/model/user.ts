export interface User {
    username: string;
    avatar: string;
}

export interface UserDetails {
    uid: string;
    username: string;
    email: string;
    imgUrl: string;
}

export interface Member {
    uid: string;
    username: string;
    email: string;
    imgUrl: string;
    admin?: boolean;
}