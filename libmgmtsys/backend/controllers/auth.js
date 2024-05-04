import Prisma from "../prisma/prisma_client.js";
import jwt from "jsonwebtoken";
import { sha256 } from "js-sha256";

const salt = "salt"

export const saltPass = async (user, pass) => {
    const salt = user.createdAt;
    let enpass = sha256(pass + salt);
    return enpass;
}

export const authToken = async (req, res, next) => {
    try {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (!token) {
            return res.send({
                success: false,
                message: 'No token provided.'
            });
        }
        let decoded = jwt.verify(token, salt);
        req.decoded = decoded;
        const user = await Prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });
        if (!user) {
            return res.json({
                success: false,
                message: 'Failed to authenticate token.'
            });
        }
        else {
            req.body.id = decoded.id;
            next();
        }
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const checkToken = async (req, res) => {
    try {
        let token = req.body.token;
        if (!token) {
            return res.send({
                success: false,
                message: 'No token provided.'
            });
        }
        let decoded = jwt.verify(token, salt);
        req.decoded = decoded;
        const user = await Prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });
        if (!user) {
            return res.json({
                success: false,
                message: 'Failed to authenticate token.'
            });
        }
        else {
            return res.json({
                success: true,
                message: 'Token is valid.',
                id: decoded.id,
                memberType: user.memberType
            });
        }
    } catch (error) {
        return res.json({ error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ error: "No email or password provided" });
        }
        const user = await Prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        // if (user.password !== await saltPass(user, password)) {
        //     return res.json({ error: "Incorrect password" });
        // }
        if (user.password !== password) {
            return res.json({ error: "Incorrect password" });
        }
        const token = jwt.sign({ id: user.id }, salt, {
            expiresIn: 86400
        });
        return res.json({
            success: true,
            token: token,
            id: user.id
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
}