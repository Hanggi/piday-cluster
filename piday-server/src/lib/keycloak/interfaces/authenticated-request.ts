import { Request } from "express";

interface UserPayload {
  userID: string;
  email: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
