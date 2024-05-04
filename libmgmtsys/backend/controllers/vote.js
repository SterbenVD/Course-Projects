import Prisma from "../prisma/prisma_client.js";

export const setVote = async (req, res) => {
    try{
        if (!req.body.userId || !req.body.requestId || !req.body.vote) {
            return res.send({
                success: false,
                message: 'Please fill all fields.'
            });
        }
        const vote = await Prisma.votes.create({
            data: {
                userId: req.body.userId,
                requestId: req.body.requestId,
                vote: req.body.vote
            }
        });
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getVote = async (req, res) => {
    try{
        const votelist = await Prisma.votes.findMany(
            {
                where: {
                    userId: req.params.userId,
                    requestId: req.params.requestId
                }
            }
        );
        return res.json(votelist);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const resetVote = async (req, res) => {
    try{
        const vote = await Prisma.votes.deleteMany(
            {
                where: {
                    userId: req.params.userId,
                    requestId: req.params.requestId
                }
            }
        );
        return res.json({ success: "true" });
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const getVoteCount = async (req, res) => {
    try{
        const voteCount = await Prisma.votes.count(
            {
                where: {
                    requestId: req.params.requestId
                }
            }
        );
        return res.json(voteCount);
    } catch (error) {
        return res.json({ error: error.message });
    }
}