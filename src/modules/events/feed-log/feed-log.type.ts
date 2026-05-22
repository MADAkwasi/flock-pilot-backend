import type {
  feedLogDetailSelect,
  feedLogListSelect,
} from "../../../constants/feed-log.constant.js";
import type { FeedLogGetPayload } from "../../../generated/prisma/models.js";

export type FeedLogWithListSelect = FeedLogGetPayload<{
  select: typeof feedLogListSelect;
}>;

export type FeedLogWithDetailSelect = FeedLogGetPayload<{
  select: typeof feedLogDetailSelect;
}>;
