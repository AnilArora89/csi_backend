import { User } from "../user/userTypes";

export interface Agency {
  _id: string;
  title: string;
  description: string;
  author: User;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
