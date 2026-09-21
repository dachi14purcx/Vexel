import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.js";
import * as schema from '../db/schema.js'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
        usePlural: true, 
        schema: schema
    }),
    emailAndPassword: { 
        enabled: true, 
        minPasswordLength: 1
    }, 
    trustedOrigins: [
        "http://localhost:5173"
    ]
});