import e from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';


const key = "secretkey";


const checkFmanager = async (req, res, next) => {
    try {
        let token = req.session.token
        let type = req.session.type;
        if (!token) {
            return res.status(401).json({ facultyManager: false, msg: "Unauthorized" });
        }else {
            token = token.split(" ")[1];
            jwt.verify(token, key, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ facultyManager: false, msg: err });
                }
                
                req.id = decoded.id;
                req.email = decoded.email;
                req.faculty_id = decoded.faculty_id;
                if (decoded.type !== "facultyManager") {
                    return res.status(401).json({ facultyManager: false, msg: "Unauthorized" });
                }
                next();
            }
            );
        }



    } catch (err) {
        return res.status(500).json("user Error");
    }
}

export default checkFmanager;