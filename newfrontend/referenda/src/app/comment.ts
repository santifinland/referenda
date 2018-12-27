import { User } from './_models';

export class Comment {
  _id: string;
  positive: number;
  negative: number;
  comment: string;
  userId: any;
}
