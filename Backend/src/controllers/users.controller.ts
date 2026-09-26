import {UserService} from "../services/users.service.js"
import { wrap } from "../lib/helpers.js"
import { Request, Response } from "express"

const getPresignedUrl = (type: "avatars" | "banners") => 
    wrap(async (req: Request, res: Response) => {
        if(!req.user) throw new Error('') //TODO
        const { contentType } = req.body
        if(!contentType) return res.status(400).json({ error: 'contentType is missing!' })
        const result = type === 'avatars' ? await UserService.getAvatarPresignedUrl(req.user.id, contentType) : await UserService.getBannerPresignedUrl(req.user.id, contentType)
        return res.status(200).json(result)
    })


const saveMedia = (type: "avatar" | "banner") =>
    wrap(async (req: Request, res: Response) => {
        if (!req.user) throw new Error(); // TODO
        const { publicUrl } = req.body;
        if (!publicUrl) return res.status(400).json({ error: "publicUrl is required." });
        type === "avatar"
            ? await UserService.saveAvatar(req.user.id, publicUrl)
            : await UserService.saveBanner(req.user.id, publicUrl);
        res.status(200).json({ success: true });
    });

const saveProfile = () =>
    wrap(async (req: Request, res: Response) => {
        if (!req.user) throw new Error(); // TODO
        await UserService.saveProfile(req.user.id, req.body);
        res.status(200).json({ success: true });
    });



export const UserController = {
    getAuthenticatedUserProfile: wrap(async (req: Request, res: Response) => {
        if (!req.user) throw new Error(); // TODO
        const userProfile = await UserService.getAuthenticatedUserProfile(req.user.id);
        res.status(200).json(userProfile);
    }),

    getAvatarPresignedUrl: getPresignedUrl("avatars"),
    getBannerPresignedUrl: getPresignedUrl("banners"),
    saveAvatar: saveMedia("avatar"),
    saveBanner: saveMedia("banner"),
    saveProfile: saveProfile(),

};