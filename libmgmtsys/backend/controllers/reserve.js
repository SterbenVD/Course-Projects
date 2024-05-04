import Prisma from "../prisma/prisma_client.js";

export const createReserve = async (req, res) => {
    try {
        if (!req.body || !req.body.userId || !req.body.bookId) {
            return res.json({ error: "Please fill all fields" });
        }
        req.body.reserve_status = "pending";
        const reserve = await Prisma.reserve.create({
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getReservebyId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const reserve = await Prisma.reserve.findUnique({
            where: { id: id },
        });
        if (!reserve) {
            return res.json({ error: "Reserve not found" });
        }
        return res.json(reserve);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getReservebyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.json({ error: "No user ID provided" });
        }
        const reserve = await Prisma.reserve.findMany({
            where: { userId: userId },
        });
        if (!reserve) {
            return res.json({ error: "Reserve not found" });
        }
        return res.json(reserve);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const updateReserve = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const reserve = await Prisma.reserve.findUnique({
            where: { id: id },
        });
        if (!reserve) {
            return res.json({ error: "Reserve not found" });
        }
        const updatedReserve = await Prisma.reserve.update({
            where: { id: id },
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const deleteReserve = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const reserve = await Prisma.reserve.findUnique({
            where: { id: id },
        });
        if (!reserve) {
            return res.json({ error: "Reserve not found" });
        }
        await Prisma.reserve.delete({
            where: { id: id },
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getAllReserves = async (req, res) => {
    try {
        var size = parseInt(req.query.size) || 25;
        var page = parseInt(req.query.page) || 1;
        if (size < 1 || page < 1) {
            return res.json({ error: "Invalid page or size" });
        }
        const reserves = await Prisma.reserve.findMany({
            take: size,
            skip: size * (page - 1),
        });
        return res.json(reserves);
    } catch (error) {
        return res.json({ error: error.message });
    }
}