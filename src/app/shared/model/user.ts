export interface User {
  username: string;
  avatar: string;
}

export interface UserDetails {
  uid: string;
  username: string;
  email: string;
  imgUrl: string;
  firstName?: string;
  lastName?: string;
}

export interface Member {
  uid: string;
  username: string;
  email: string;
  imgUrl: string;
  admin?: boolean;
  owner?: boolean;
}

export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
}
