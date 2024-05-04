import Prisma from "../prisma/prisma_client.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: req.body.id
            }
        });
        if (user.role !== 'admin') {
            res.status(403).send({
                success: false,
                message: 'You are not an admin.'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const isLibrarian = async (req, res, next) => {
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: req.body.id
            }
        });
        if (user.role !== 'librarian') {
            res.status(403).send({
                success: false,
                message: 'You are not a librarian.'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const isMember = async (req, res, next) => {
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: req.body.id
            }
        });
        if (user.role !== 'member') {
            res.status(403).send({
                success: false,
                message: 'You are not a member.'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

