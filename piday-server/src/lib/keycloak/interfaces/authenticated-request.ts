import { Request } from "express";

interface UserPayload {
  userID: string;
  // 可以根据需要添加更多属性
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
