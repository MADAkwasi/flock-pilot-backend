import { Types } from "mongoose";
import { IUser } from "./user.type";

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
