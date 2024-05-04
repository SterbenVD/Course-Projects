import Prisma from "../prisma/prisma_client.js";

export const createIssue = async (req, res) => {
    try {
        if (!req.body || !req.body.userId || !req.body.bookId) {
            return res.json({ error: "Please fill all fields" });
        }
        req.body.issue_status = "pending";
        const issue = await Prisma.issue.create({
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getIssuebyId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const issue = await Prisma.issue.findUnique({
            where: { id: id },
        });
        if (!issue) {
            return res.json({ error: "Issue not found" });
        }
        return res.json(issue);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getIssuebyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.json({ error: "No user ID provided" });
        }
        const issue = await Prisma.issue.findMany({
            where: { userId: userId },
        });
        if (!issue) {
            return res.json({ error: "Issue not found" });
        }
        return res.json(issue);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const issue = await Prisma.issue.findUnique({
            where: { id: id },
        });
        if (!issue) {
            return res.json({ error: "Issue not found" });
        }
        const updatedIssue = await Prisma.issue.update({
            where: { id: id },
            data: req.body,
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({ error: "No ID provided" });
        }
        const issue = await Prisma.issue.delete({
            where: { id: id },
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getAllIssues = async (req, res) => {
    try {
        var size = parseInt(req.query.size) || 25;
        var page = parseInt(req.query.page) || 1;
        if (size < 1 || page < 1) {
            return res.json({ error: "Invalid page or size" });
        }
        const issues = await Prisma.issue.findMany({
            take: size,
            skip: (page - 1) * size,
        });
        return res.json(issues);
    }
    catch (error) {
        return res.json({ error: error.message });
    }
}