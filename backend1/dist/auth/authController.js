"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.verify = verify;
const client_1 = require("@prisma/client");
const jwt_1 = require("./jwt");
const prisma = new client_1.PrismaClient();
//singup
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(403).json({
                message: "email and password required"
            });
        }
        try {
            const existingUser = yield prisma.user.findFirst({
                where: {
                    username: username,
                    password: password
                }
            });
            if (existingUser)
                return res.status(403).json({
                    message: "user already exist"
                });
            const user = yield prisma.user.create({
                data: {
                    username: username,
                    password: password,
                }
            });
            console.log(user);
            const token = (0, jwt_1.signToken)({ userId: user.id });
            res.json({ token });
        }
        catch (e) {
            res.status(403).json({
                message: "failed to logn try again !!"
            });
        }
    });
}
//login
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({
                messgae: "enter username and passsword"
            });
        try {
            const user = yield prisma.user.findFirst({
                where: {
                    username: username,
                    password: password
                }
            });
            if (!user)
                return res.json({ message: "invalid cred" });
            const token = (0, jwt_1.signToken)({ userId: user.id });
            res.json({ token });
        }
        catch (e) {
            res.json({
                message: e
            });
        }
    });
}
function verify(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.json({
                message: "please sing up"
            });
        const payload = (0, jwt_1.verifyToken)(token);
        if (!payload)
            return res.status(401).json({
                message: "invalid"
            });
        res.json({ payload });
    });
}
