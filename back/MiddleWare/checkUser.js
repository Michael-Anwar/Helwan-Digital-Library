import express from 'express';
import jwt from 'jsonwebtoken';


const key = "secretkey";


const checkUser = async (req, res, next) => {
    try {
        let error = [];
        let token = req.session.token || req.headers.authorization
        if (!token) {
            error.push({user: false, msg: "Unauthorized"});
            return res.status(401).json(error);
        } else {
            token = token.split(" ")[1];
            jwt.verify(token, key, (err, decoded) => {
                if (err) {
                    error.push({user: true, msg: err});
                    return res.status(401).json(error);
                }
                req.id = decoded.id;
                req.name = decoded.name;
                req.email = decoded.email;
                req.national_id = decoded.national_id;
                if (decoded.type !== "user") {
                    error.push({user: false, msg: "Unauthorized"});
                    return res.status(401).json(error);
                }
                next();
            }
            );
        }



    } catch (err) {
        return res.status(500).json("user Error");
    }
}

export default checkUser;