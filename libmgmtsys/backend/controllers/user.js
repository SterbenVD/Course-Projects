import Prisma from "../prisma/prisma_client.js";
import { saltPass } from "./auth.js";

export const createUser = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.memberType) {
            return res.json({ error: "Please fill all fields" });
        }
        req.body.password = await saltPass(req.body, req.body.password);
        const user = await Prisma.user.create({
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const user = await Prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        if (req.body.memberType && req.body.memberType !== user.memberType) {
            return res.json({ error: "Cannot change member type" });
        }
        if (req.body.email && req.body.email !== user.email) {
            return res.json({ error: "Cannot change email" });
        }
        if (req.body.password) {
            req.body.password = await saltPass(user, req.body.password);
        }
        const updatedUser = await Prisma.user.update({
            where: { id: id },
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const user = await Prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        await Prisma.user.delete({
            where: { id: id },
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getUserbyId = async (req, res) => {
    try {
        var { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const user = await Prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getFuzzyUser = async (req, res) => {
    try {
        var { email } = req.params;
        if (!email) {
            return res.json({ error: "No email provided" });
        }
        const user = await Prisma.user.findMany({
            where: { email: { contains: email } },
        });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        user.password = undefined;
        return res.json(user);
    }
    catch (error) {
        return res.json({ error: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        var size = parseInt(req.params.size) || 25;
        var page = parseInt(req.params.page) || 1;
        if (size < 1 || page < 1) {
            return res.json({ error: "Invalid page or size" });
        }
        const users = await Prisma.user.findMany({
            skip: (page - 1) * size,
            take: size
        });
        users.forEach(user => {
            user.password = undefined;
        });
        return res.json(users);
    } catch (error) {
        return res.json({ error: error.message });
    }
}