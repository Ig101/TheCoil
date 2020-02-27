import { ReactionMessageLevelEnum } from 'src/app/engine/models/enums/reaction-message-level.enum';

export interface LogItem {
  expiring: boolean;
  opacity: number;
  color: string;
  message: string;
}
