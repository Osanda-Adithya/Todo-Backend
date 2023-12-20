declare namespace Express {
  export interface Request {
    user: UserType;
  }
}
interface UserType {
  _id: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
}
