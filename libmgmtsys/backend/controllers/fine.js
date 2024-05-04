import Prisma from "../prisma/prisma_client.js";

export const getFinebyId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const fine = await Prisma.fine.findUnique({
            where: { id: id },
        });
        if (!fine) {
            return res.json({ error: "Fine not found" });
        }
        res.json(fine);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const createFine = async (req, res) => {
    try {
        if (!req.body || !req.body.userId || !req.body.amount || !req.body.bookId) {
            return res.json({ error: "Please fill all fields" });
        }
        const fine = await Prisma.fine.create({
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const updateFine = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const fine = await Prisma.fine.findUnique({
            where: { id: id },
        });
        if (!fine) {
            return res.json({ error: "Fine not found" });
        }
        const updatedFine = await Prisma.fine.update({
            where: { id: id },
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const deleteFine = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const fine = await Prisma.fine.findUnique({
            where: { id: id },
        });
        if (!fine) {
            return res.json({ error: "Fine not found" });
        }
        await Prisma.fine.delete({
            where: { id: id },
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getFinebyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.json({ error: "No user ID provided" });
        }
        const fine = await Prisma.fine.findMany({
            where: { userId: userId },
        });
        if (!fine) {
            return res.json({ error: "Fine not found" });
        }
        return res.json(fine);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getAllFines = async (req, res) => {
    try {
        var size = parseInt(req.query.size) || 25;
        var page = parseInt(req.query.page) || 1;
        if (size < 1 || page < 1) {
            return res.json({ error: "Invalid page or size" });
        }
        var fines = await Prisma.fine.findMany({
            take: size,
            skip: (page - 1) * size,
        });
        return res.json(fines);
    } catch (error) {
        return res.json({ error: error.message });
    }
}