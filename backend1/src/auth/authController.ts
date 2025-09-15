import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { signToken, verifyToken } from "./jwt";

const prisma = new PrismaClient();



//singup
export async function signup(req: Request, res: Response) {
    const { username, password } = req.body;


    if (!username || !password) {
        return res.status(403).json({
            message: "email and password required"
        })
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                username: username,
                password: password
            }
        })

        if (existingUser) return res.status(403).json({
            message: "user already exist"
        })

        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,

            }
        })

        console.log(user);

        const token = signToken({ userId: user.id });
        res.json({ token })

    } catch (e) {
        res.status(403).json({
            message: "failed to logn try again !!"
        })
    }
}


//login


export async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({
        messgae: "enter username and passsword"
    })

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
                password: password
            }
        })

        if (!user) return res.json({ message: "invalid cred" })

        const token = signToken({ userId: user.id });
        res.json({ token });

    } catch (e) {
        res.json({
            message: e
        })
    }
}

export async function verify(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.json({
        message: "please sing up"
    })

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({
        message: "invalid"
    })
    res.json({ payload })
}