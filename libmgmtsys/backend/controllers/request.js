import Prisma from "../prisma/prisma_client.js";

export const createRequest = async (req, res) => {
    try {
        if (!req.body || !req.body.userId || !req.body.bookId) {
            return res.json({ error: "Please fill all fields" });
        }
        req.body.request_status = "pending";
        const request = await Prisma.requests.create({
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getRequestbyId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const request = await Prisma.requests.findUnique({
            where: { id: id },
        });
        if (!request) {
            return res.json({ error: "Request not found" });
        }
        return res.json(request);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const request = await Prisma.requests.findUnique({
            where: { id: id },
        });
        if (!request) {
            return res.json({ error: "Request not found" });
        }
        const updatedRequest = await Prisma.requests.update({
            where: { id: id },
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const request = await Prisma.requests.findUnique({
            where: { id: id },
        });
        if (!request) {
            return res.json({ error: "Request not found" });
        }
        await Prisma.requests.delete({
            where: { id: id },
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getRequestbyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.json({ error: "No user ID provided" });
        }
        const request = await Prisma.requests.findMany({
            where: { userId: userId },
        });
        if (!request) {
            return res.json({ error: "Request not found" });
        }
        return res.json(request);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getAllRequests = async (req, res) => {
    try {
        var size = parseInt(req.query.size) || 25;
        var page = parseInt(req.query.page) || 1;
        if (size < 1 || page < 1) {
            return res.json({ error: "Invalid page or size" });
        }
        const requests = await Prisma.requests.findMany({
            skip: size * (page - 1),
            take: size,
        });
        return res.json(requests);
    } catch (error) {
        return res.json({ error: error.message });
    }
}
