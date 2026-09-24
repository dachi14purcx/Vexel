import { PutObjectCommand } from "@aws-sdk/client-s3"
import env from "../config/env.js"
import { S3 } from "../config/S3.config.js"
import { db } from "../db/db.js"
import { genderEnum, statusEnum, userProfiles } from "../db/schema.js"
import { eq } from "drizzle-orm"
import { BadRequestError, NotFoundError } from "../lib/Error.js"

const genderValues = genderEnum.enumValues
const statusValues = statusEnum.enumValues

type ProfileUpdate = {
    username?: string
    bio?: string | null
    dateOfBirth?: string | null
    gender?: typeof genderValues[number] | null
    status?: typeof statusValues[number] | null
    occupation?: string | null
    background?: string | null
}

export const userService = {

    saveProfilePicture: async (userId: string, imageBuffer: Buffer, contentType: string ): Promise<string> => {
        if(!contentType.startsWith('image/')) throw new BadRequestError('Invalid file type')

        const fileExtension = contentType.split('/')[1]
        if (!fileExtension) throw new BadRequestError('Invalid file type')
        const r2Key = `avatars/original/user_${userId}_${Date.now()}.${fileExtension}`
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

        if (finalBio.length > 500) throw new BadRequestError('Bio must be under 500 characters')

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

        if (isNaN(parsedDate.getTime())) throw new BadRequestError('Invalid date format')

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
        if (!genderValues.includes(userGender as typeof genderValues[number])) {
            throw new BadRequestError('Invalid gender')
        }
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
        if (!statusValues.includes(userStatus as typeof statusValues[number])) {
            throw new BadRequestError('Invalid relationship status')
        }
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
    },

    getProfile: async (userId: string) => {
        const [profile] = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.id, userId))

        if (!profile) throw new NotFoundError('User profile not found')
        return profile
    },

    updateProfile: async (userId: string, input: ProfileUpdate) => {
        const values: {
            username?: string
            bio?: string | null
            dateOfBirth?: Date | null
            gender?: typeof genderValues[number] | null
            status?: typeof statusValues[number] | null
            occupation?: string | null
            background?: string | null
        } = {}

        if (input.username !== undefined) {
            const username = input.username.trim()
            if (username.length < 3 || username.length > 32) {
                throw new BadRequestError('Username must be between 3 and 32 characters')
            }
            values.username = username
        }

        if (input.bio !== undefined) {
            const bio = input.bio?.trim() ?? null
            if (bio !== null && bio.length > 500) {
                throw new BadRequestError('Bio must be under 500 characters')
            }
            values.bio = bio
        }

        if (input.dateOfBirth !== undefined) {
            if (input.dateOfBirth === null) {
                values.dateOfBirth = null
            } else {
                const date = new Date(input.dateOfBirth)
                if (Number.isNaN(date.getTime())) throw new BadRequestError('Invalid date format')
                values.dateOfBirth = date
            }
        }

        if (input.gender !== undefined) {
            if (input.gender !== null && !genderValues.includes(input.gender)) {
                throw new BadRequestError('Invalid gender')
            }
            values.gender = input.gender
        }

        if (input.status !== undefined) {
            if (input.status !== null && !statusValues.includes(input.status)) {
                throw new BadRequestError('Invalid relationship status')
            }
            values.status = input.status
        }

        for (const field of ['occupation', 'background'] as const) {
            if (input[field] !== undefined) {
                const value = input[field]?.trim() ?? null
                if (value !== null && value.length > 500) {
                    throw new BadRequestError(`${field} must be under 500 characters`)
                }
                values[field] = value
            }
        }

        if (Object.keys(values).length === 0) {
            throw new BadRequestError('At least one profile field is required')
        }

        const [profile] = await db
            .update(userProfiles)
            .set(values)
            .where(eq(userProfiles.id, userId))
            .returning()

        if (!profile) throw new NotFoundError('User profile not found')
        return profile
    }
}