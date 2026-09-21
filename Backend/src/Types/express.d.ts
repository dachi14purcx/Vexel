import type { User, Session } from "better-auth";

export declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: Session;
    }
  }
}