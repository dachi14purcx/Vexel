import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/Error.js';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error('Unhandled Error :' , err);
    return res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
    });

};