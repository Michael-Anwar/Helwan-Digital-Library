import express from "express";
import query from '../Database/DBConnection.js';
import { body, check, validationResult } from "express-validator";
import e from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import checkUser from "../MiddleWare/checkUser.js";


const userAuth = express();
userAuth.use(express.Router());
const key = "secretkey";


userAuth.post('/register',
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('checkpassword').notEmpty().withMessage('checkpassword is required').isLength({ min: 8 }).withMessage('checkpassword must be at least 8 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('national_id').notEmpty().withMessage('National ID is required'),
    body('nationality').notEmpty().withMessage('Nationality is required'),
    body('university').notEmpty().withMessage('University is required'),
    body('department').notEmpty().withMessage('department is required'),
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




                    
            if (req.body.password !== req.body.checkpassword) {
                error.push("Password doesn't match");
                return res.status(400).json({ message: error });
            }

            if (req.body.university == "0" && req.body.other_uni == "") {
                error.push("University is required");
                return res.status(400).json({ message: error });
            }

            if (req.body.university == "0" &&  req.body.faculity == "") {
                error.push("Faculity is required");
                return res.status(400).json({ message: error });
            }

            if (req.body.university == "1" &&  req.body.faculity_id == "") {
                error.push("Faculity is required"); 
                return res.status(400).json({ message: error });
            }

            const sqlSelect = "SELECT * FROM users WHERE email = ? OR national_id = ?";
            const result = await query(sqlSelect, [req.body.email, req.body.national_id]);
            if (result.length > 0) {
                error.push("البريد الالكتروني او الرقم القومي مسجل مسبقا");
                return res.status(400).json({ message: error});
            }
            let uni = req.body.university;
            if (req.body.university == "0" && req.body.other_uni != "") {
                uni = req.body.other_uni;
            }else {
                uni = req.body.university;
            }
            

            const user = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
                national_id: req.body.national_id,
                nationality: req.body.nationality,
                university: uni,
                faculity: req.body.faculity || null,
                department: req.body.department,
                faculity_id: req.body.faculity_id || null,
            }

            const sqlInsert = "INSERT INTO users SET ?";
            const result2 = await query(sqlInsert, user);

            if (result2.affectedRows > 0) {
                return res.status(201).json({ message: "User registered successfully" });
            } else {
                error.push("حدث خطأ ما");
                return res.status(400).json({ message: error });
            }

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message:error });
        }

});

userAuth.post('/login',
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

            const sqlSelect = "SELECT * FROM users WHERE email = ?";
            const result = await query(sqlSelect, [req.body.email]);
            if (result.length > 0) {
                const match = await bcrypt.compare(req.body.password, result[0].password);
                if (match) {
                    const payload = {
                        id: result[0].id,
                        national_id: result[0].national_id,
                        name: result[0].name,
                        email: result[0].email,
                        type : "user"
                    };
                    const token =jwt.sign(payload, key);
                    req.session.token ="Bearer "+ token;
                    return res.status(200).json({ login: true, token: token , user: result[0]});

                } else {
                    error.push("كلمة المرور غير صحيحة");
                    return res.status(400).json({ message: error });
                }
            } else {
                error.push("البريد الالكتروني غير مسجل مسبقا");
                return res.status(400).json({ message: error });
            }

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
});

userAuth.get('/check', 
    checkUser,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM users WHERE id = ?";
            const result = await query(sqlSelect, [req.id]);
            if (result.length > 0) {
                return res.status(200).json({ login: true , user: result[0]});
            } else {
                error.push("User doesn't exist");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    
});

userAuth.put('/resetpassword',
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('national_id').notEmpty().withMessage('National ID is required'),
    body('newpassword').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('checkpassword').notEmpty().withMessage('checkpassword is required').isLength({ min: 8 }).withMessage('checkpassword must be at least 8 characters'),
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

            if (req.body.newpassword !== req.body.checkpassword) {
                error.push("Password doesn't match");
                return res.status(400).json({ message: error });
            }

            const sqlSelect = "SELECT * FROM users WHERE email = ? AND national_id = ?";
            const result = await query(sqlSelect, [req.body.email, req.body.national_id]);
            if (result.length > 0) {
                const sqlUpdate = "UPDATE users SET password = ? WHERE national_id = ?";
                const result2 = await query(sqlUpdate, [await bcrypt.hash(req.body.newpassword, 10), req.body.national_id]);
                if (result2.affectedRows > 0) {
                    return res.status(200).json({ message: "Password changed successfully" });
                } else {
                    error.push("حدث خطأ ما");
                    return res.status(400).json({ message: error });
                }
            } else {
                error.push("البريد الالكتروني او الرقم القومي غير مسجل مسبقا");
                return res.status(400).json({ message: error });
            }

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

userAuth.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "User logged out successfully" });
});




export default userAuth;