import { User } from "../user/userTypes";
import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose, { Schema, Document } from 'mongoose';


export interface Book {
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
