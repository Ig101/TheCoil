import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';

export interface ReactionResult {
  level: ReactionMessageLevelEnum;
  message?: string;
}
