import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { wrap } from "../lib/helpers.js";
import { UnauthorizedError } from "../lib/Error.js";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = wrap( async (req: Request , res: Response, next: NextFunction ) => {
    const authHeader = await auth.api.getSession({
        headers : fromNodeHeaders(req.headers)
    })

    if(!authHeader) throw new UnauthorizedError()
         
    req.user = authHeader.user
    req.session = authHeader.session

    next()
})