import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';

export interface ReactionResult {
  time: number;
  level: ReactionMessageLevelEnum;
  message?: string[];
}
