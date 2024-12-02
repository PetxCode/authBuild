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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneUserAvatar = exports.updateOneUserName = exports.readOneUser = exports.changeUserPassword = exports.forgetUserPassword = exports.logInUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const authModel_1 = __importDefault(require("../model/authModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// AUTH
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const acc = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield authModel_1.default.create({
            email,
            password: hashed,
            accNumber: acc,
        });
        return res.status(201).json({
            message: "User created successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({ error: error, status: 404 });
    }
});
exports.createUser = createUser;
const logInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const getUser = yield authModel_1.default.findOne({ email });
        if (getUser) {
            const passwordCheck = yield bcrypt_1.default.compare(password, getUser.password);
            if (passwordCheck) {
                const token = jsonwebtoken_1.default.sign({ id: getUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIME });
                return res.status(201).json({
                    message: "Welcome back",
                    data: token,
                    status: 201,
                });
            }
            else {
                return res.status(404).json({
                    message: "Error with user password",
                    status: 404,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Error with user email",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({ error: error });
    }
});
exports.logInUser = logInUser;
const forgetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield authModel_1.default.findOne({
            email,
        });
        if (user) {
            return res.status(201).json({
                message: "A mail has been sent to you for account password reset",
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "No user with such Email on our DB",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({ error: error, status: 404 });
    }
});
exports.forgetUserPassword = forgetUserPassword;
const changeUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const { userID } = req.params;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            password: hashed,
        }, { new: true });
        return res.status(201).json({
            message: "password updated successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({ error: error, status: 404 });
    }
});
exports.changeUserPassword = changeUserPassword;
// PROFILE
const readOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findById(userID);
        return res.status(200).json({
            message: "User found successfully",
            data: user,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({ error: error, status: 404 });
    }
});
exports.readOneUser = readOneUser;
const updateOneUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { firstName, lastName, userName } = req.body;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            firstName,
            lastName,
            userName,
        }, { new: true });
        return res.status(201).json({
            message: "update user names successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({ error: error, status: 404 });
    }
});
exports.updateOneUserName = updateOneUserName;
const updateOneUserAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findByIdAndUpdate(userID, {
            avatar: "",
        }, { new: true });
        return res.status(201).json({
            message: "update user names successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({ error: error, status: 404 });
    }
});
exports.updateOneUserAvatar = updateOneUserAvatar;
