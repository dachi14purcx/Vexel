import { PutObjectCommand } from "@aws-sdk/client-s3"
import env from "../config/env.js"
import { S3 } from "../config/S3.config.js"
import { db } from "../db/db.js"
import { genderEnum, statusEnum, userProfiles } from "../db/schema.js"
import { eq } from "drizzle-orm"


export const userService = {

    saveProfilePicture: async (userId: string, imageBuffer: Buffer, contentType: string ): Promise<string> => {
        if(!contentType.startsWith('image/')) throw new Error('invalid file type')

        const fileExtention = contentType.split('/')[1]
        const r2Key = `avatars/original/user_${userId}_${Date.now()}.${fileExtention}`
        const command = new PutObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: r2Key,
            Body: imageBuffer,
            ContentType: contentType
        })

        await (S3 as unknown as { send: (command: PutObjectCommand) => Promise<unknown> }).send(command)
        await db
        .update(userProfiles)
        .set({pfp: r2Key})
        .where(eq(userProfiles.id, userId))

        return r2Key
    },

    saveBio: async (userId: string, userBio: string): Promise<string> => {
        const finalBio = userBio.trim()

        if (finalBio.length > 500) throw new Error('Bio must be under 500 characters')

        await db.update(userProfiles).set({ bio: finalBio }).where(eq(userProfiles.id, userId))

        return finalBio
    },

    getBio: async (userId: string) => {
        const [profile] = await db
            .select({ bio: userProfiles.bio })
            .from(userProfiles)
            .where(eq(userProfiles.id, userId))

        return profile?.bio ?? null
    },


    saveDateOfBirth: async (userId: string, userBirth: string): Promise<Date> => {
        const parsedDate = new Date(userBirth)

        if (isNaN(parsedDate.getTime())) throw new Error('Invalid date format')

        await db.update(userProfiles)
        .set({ dateOfBirth: parsedDate })
        .where(eq(userProfiles.id, userId))

        return parsedDate
    },

    getDateOfBirth: async (userId: string): Promise<Date|null>=> {
        const [profile] =await db
        .select({ dateOfBirth: userProfiles.dateOfBirth })
        .from(userProfiles)
        .where(eq(userProfiles.id, userId))

        return profile?.dateOfBirth ?? null
    },

    saveGender: async (userId: string, userGender: string): Promise<string> => {
        await db.update(userProfiles)
        .set({ gender: userGender as typeof genderEnum.enumValues[number] })
        .where(eq(userProfiles.id, userId))

        return userGender
    },

    getGender: async (userId: string): Promise<string|null> => {
        const [profile] = await db
        .select({ gender: userProfiles.gender })
        .from(userProfiles)
        .where(eq(userProfiles.id, userId))

        return profile?.gender ?? null
    },

    saveStatus: async (userId: string, userStatus: string): Promise<string> => {
        await db.update(userProfiles)
        .set({ status: userStatus as typeof statusEnum.enumValues[number] })
        .where(eq(userProfiles.id, userId))

        return userStatus
    },

    getStatus: async (userId: string): Promise<string|null> => {
        const [profile] = await db
        .select({ status: userProfiles.status })
        .from(userProfiles)
        .where(eq(userProfiles.id, userId))

        return profile?.status ?? null
    }
}