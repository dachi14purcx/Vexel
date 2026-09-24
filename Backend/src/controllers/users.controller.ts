import { Router, Request } from "express"
import multer from "multer"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { wrap } from "../lib/helpers.js"
import { BadRequestError } from "../lib/Error.js"
import { userService } from "../services/users.service.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
})

const currentUserId = (req: Request): string => {
    if (!req.user?.id) throw new BadRequestError("Authenticated user is missing")
    return req.user.id
}

export const usersController = Router()

usersController.use(authMiddleware)

usersController.get("/me", wrap(async (req, res) => {
    const profile = await userService.getProfile(currentUserId(req))
    res.status(200).json({ profile })
}))

usersController.patch("/me", wrap(async (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        throw new BadRequestError("Profile body must be an object")
    }
    const profile = await userService.updateProfile(currentUserId(req), req.body)
    res.status(200).json({ profile })
}))

usersController.post(
    "/me/avatar",
    upload.single("avatar"),
    wrap(async (req, res) => {
        if (!req.file) throw new BadRequestError("Avatar image is required")

        const key = await userService.saveProfilePicture(
            currentUserId(req),
            req.file.buffer,
            req.file.mimetype,
        )
        res.status(200).json({ key })
    }),
)