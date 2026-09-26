import { PutObjectCommand } from "@aws-sdk/client-s3"
import env from "../config/env.js"
import { S3 } from "../config/S3.config.js"
import { db } from "../db/db.js"
import { genderEnum, statusEnum, userProfiles } from "../db/schema.js"
import { eq } from "drizzle-orm"
import { BadRequestError, NotFoundError } from "../lib/Error.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const getPresignedUrl = async (userId:string, contentType:string, folder:"avatars" | "banners") => {
    if(!contentType.startsWith('image/')) throw new Error('Invalid file!');
    const fileExtension = contentType.split('/')[1];
    const r2Key = `public/${folder}/${folder == "avatars" ? "original" : ""}/${fileExtension}`
    const command = new PutObjectCommand ({
        Bucket: env.BUCKET_NAME,
        Key: r2Key,
        ContentType: contentType
    })

    const presignUrl = await getSignedUrl(S3, command, { expiresIn: 60 });
    const publicUrl = `${env.WORKER_URL}/${env.BUCKET_NAME}/${r2Key}`
    return { presignUrl, publicUrl }
}

const genderValues = genderEnum.enumValues
const statusValues = statusEnum.enumValues

export type ProfileUpdate = {
    username?: string
    bio?: string | null
    dateOfBirth?: string | null
    gender?: typeof genderValues[number] | null
    status?: typeof statusValues[number] | null
    occupation?: string | null
    background?: string | null
}

export const UserService = {

    getAvatarPresignedUrl: (userId: string, contentType: string) =>
        getPresignedUrl(userId, contentType, "avatars"),
        

    getBannerPresignedUrl: (userId: string, contentType: string) =>
        getPresignedUrl(userId, contentType, "banners"),

    saveAvatar: async (userId: string, publicUrl: string) => {
        await db.update(userProfiles).set({ pfp: publicUrl }).where(eq(userProfiles.id, userId));
    },

    saveBanner: async (userId: string, publicUrl: string) => {
        await db.update(userProfiles).set({ background: publicUrl }).where(eq(userProfiles.id, userId));
    },

    getAuthenticatedUserProfile: async (userId: string) => {
        const [profile] = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.id, userId))

        if (!profile) throw new NotFoundError('User profile not found')
        return profile
    },

    saveProfile: async (userId: string, input: ProfileUpdate) => {
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