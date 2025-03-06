import express from "express";
import query from '../Database/DBConnection.js';
import { body, check, validationResult } from "express-validator";
import e from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const adminAuth = express();
adminAuth.use(express.Router());
const key = "secretkey";


adminAuth.post('/login',
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const sqlSelect = "SELECT * FROM admin WHERE email = ?";
            const result = await query(sqlSelect, [req.body.email]);
            if (result.length > 0) {
                if (req.body.password == result[0].password) {
                    res.status(200).json({ login: true, firstLogin: true });
                } else {

                    const match = await bcrypt.compare(req.body.password, result[0].password);
                    if (match) {
                        const payload = {
                            id: result[0].id,
                            email: result[0].email,
                            type: "admin"
                        };
                        const token = jwt.sign(payload, key);
                        req.session.token = "Bearer " + token;
                        return res.status(200).json({ login: true, token: token, firstLogin: false });

                    } else {
                        error.push("كلمة السر غير صحيحه");
                        return res.status(400).json({ message: error });
                    }
                }
            } else {
                error.push("الادمن غير موجود");
                return res.status(400).json({ message: error });
            }

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    });

adminAuth.post('/firstlogin',
    body('email').notEmpty().withMessage('الايميل مطلوب').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('يجب ادخال الباسورد القديم').isLength({ min: 8 }).withMessage('الباسورد يجب ان يكون علي الاقل 8 حروف'),
    body('newPassword').notEmpty().withMessage('يجب ادخال الباسورد الجديده').isLength({ min: 8 }).withMessage('الباسورد الجديد يجب ان يكون علي الاقل 8 حروف'),
    body('confirmPassword').notEmpty().withMessage('يجب تاكيد الباسورد الجديده').isLength({ min: 8 }).withMessage('الباسورد الجديد يجب ان يكون علي الاقل 8 حروف'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const sqlSelect = "SELECT * FROM admin WHERE email = ?";
            const result = await query(sqlSelect, [req.body.email]);
            if (result.length > 0) {
                if (req.body.password == result[0].password) {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        const password = await bcrypt.hash(req.body.newPassword, 10);
                        const sqlUpdate = "UPDATE admin SET password = ? WHERE email = ?";
                        const result = await query(sqlUpdate, [password, req.body.email]);
                        return res.status(200).json({ message: "Password updated successfully" });
                    } else {
                        error.push("كلمة السر الجديده غير متطابقه");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("كلمة السر القديمه غير صحيحه");
                    return res.status(400).json({ message: error });
                }
            } else {
                error.push("الادمن غير موجود");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    });


adminAuth.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "User logged out successfully" });
});


export default adminAuth;