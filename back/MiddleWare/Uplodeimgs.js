// import multer from 'multer';
// import path from "path";
// import fs from "fs";


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         console.log(req.params.id);
//         const national_id = req.national_id || req.params.id  ;
//         if(!national_id) return cb(new Error("national_id is required"));
//         if (fs.existsSync(`../public/imgs/${national_id}`)) {
//             cb(null, `../public/imgs/${national_id}`);
//         } else {
//             fs.mkdirSync(`../public/imgs/${national_id}`);
//             cb(null, `../public/imgs/${national_id}`);
//         }
//     },
//     filename(req, file, cb) {
//         return cb(null, `${req.national_id || req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// const maxSize = 1 * 1024 * 1024;


// const upload = multer({
//     storage: storage,

// })

// export default upload;

import multer from 'multer';
import path from "path";
import fs from "fs";
import { promisify } from "util";
import query from "../Database/DBConnection.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const mkdir = promisify(fs.mkdir);
const existsSync = fs.existsSync;
const mkdirSync = fs.mkdirSync;
const diskStorage = multer.diskStorage;
const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = diskStorage({
    async destination(req, file, cb) {

        if (req.type == "admin") {
            const adminsEventsdir = join(__dirname, `../public/imgs/adminsEvents`);
            if (existsSync(adminsEventsdir)) {
                cb(null, adminsEventsdir);
            } else {
                try {
                    await mkdir(adminsEventsdir);
                    cb(null, adminsEventsdir);
                } catch (error) {
                    cb(error);
                }
            }
        } else {
            let national_id = req.national_id || req.params.id;
            // get national_id from database
            const sqlSelect = "SELECT national_id FROM users WHERE national_id = ?";
            const result = await query(sqlSelect, national_id);
            if (result.length > 0) {
                national_id = result[0].national_id;
            }else {
                return cb(new Error("national_id is required"));
            }


            if (!national_id) return cb(new Error("national_id is required"));

            const userDir = join(__dirname, `../public/imgs/${national_id}`);
            if (existsSync(userDir)) {
                cb(null, userDir);
            } else {
                try {
                    await mkdir(userDir);
                    cb(null, userDir);
                } catch (error) {
                    cb(error);
                }
            }
        }
    },
    filename(req, file, cb) {
        if (req.type === "admin") {
            return cb(
                null,
                `admin_${req.id}_${Date.now()}${path.extname(
                    file.originalname
                )}`
            );
        } else {
            return cb(
                null,
                `${req.national_id || req.params.id}_${Date.now()}${path.extname(
                    file.originalname
                )}`
            );
        }
    },
});

const upload = multer({
    storage,
});

export default upload;