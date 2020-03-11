import { User } from './user.model';

export interface ActiveUser extends User {
  email: string;
  savedGame: any;
}
