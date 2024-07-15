import { User } from "../user/userTypes";

export interface Agency {
  _id: string;
  routeNo: string;
  description: string;
  person: User;
  agencyNo: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
