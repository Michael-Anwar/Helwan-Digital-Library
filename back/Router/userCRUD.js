import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import checkUser from "../MiddleWare/checkUser.js";
import upload from "../MiddleWare/Uplodeimgs.js";
import checkmanager from "../MiddleWare/checkManager.js";
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));



const user = express();
user.use(express.Router());


user.get('/getAllServices',
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM services";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                error.push("No services found");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

user.get('/getuser',
    checkUser,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = `SELECT users.*, faculty.*
            FROM users
            LEFT JOIN faculty ON users.faculity_id = faculty.faculty_id
            WHERE users.id = ? AND (users.faculity_id IS NULL OR users.faculity_id IS NOT NULL);
            `;
            const result = await query(sqlSelect, [req.id]);
            if (result.length > 0) {
                delete result[0].password;
                return res.status(200).json(result[0]);
            } else {
                error.push("No user found");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

user.put('/updateuser',
    checkUser,
    upload.single('img'),
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM users WHERE id = ?";
            const result = await query(sqlSelect, [req.id]);
            if (result.length > 0) {
                let image = result[0].img;
                if (req.file) {
                    image = req.file.filename;

                }
                // validate extention
                if (req.file?.mimetype != 'image/png' && req.file?.mimetype != 'image/jpg' && req.file?.mimetype != 'image/jpeg') {
                    error.push(" يجب ان تكون الصورة بصيغة png او jpg او jpeg");
                    return res.status(400).json({ message: error });
                }
                // validate size
                if (req.file?.size > 1024 * 1024 * 5) {
                    error.push("حجم الصورة كبير جدا .. يجب ان لا يتعدي 5 ميجا");
                    return res.status(400).json({ message: error });
                }

                if (req.file?.filename) {
                    if (result[0].img != null && result[0].img != "") {
                        if (fs.existsSync(join(__dirname, `../public/imgs/${result[0].national_id}/${result[0].img}`))) {
                            fs.unlinkSync(join(__dirname, `../public/imgs/${result[0].national_id}/${result[0].img}`), (err) => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                        }

                    }
                }
                const userDate = {
                    name: req.body.name,
                    email: req.body.email,
                    img: image,
                    phone: req.body.phone,
                    national_id: req.body.national_id,
                    university: req.body.university,
                    faculity: req.body.faculity,
                    department: req.body.department,
                    nationality: req.body.nationality,
                }
                const sqlUpdate = "UPDATE users SET ? WHERE id = ?";
                const resultUpdate = await query(sqlUpdate, [userDate, req.id]);
                if (resultUpdate.affectedRows > 0) {
                    return res.status(200).json({ message: "User updated successfully" });
                } else {
                    error.push("User not updated");
                    return res.status(400).json({ message: error });
                }
            } else {
                error.push("No user found");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

user.put('/updateuserManager',
    checkmanager,
    body('user_id').notEmpty().withMessage('user_id is required'),
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM users WHERE id = ?";
            const result = await query(sqlSelect, [req.body.user_id]);
            if (result.length > 0) {
                if (req.body.university == 1 && req.body.faculity_id != null) {
                    req.body.faculity = null
                } else if (req.body.university == 0 && req.body.faculity != null) {
                    req.body.faculity_id = null
                }

                const userDate = {
                    name: req.body.name,
                    email: req.body.email,
                    img: result[0].img,
                    phone: req.body.phone,
                    national_id: req.body.national_id,
                    university: req.body.university,
                    faculity: req.body.faculity,
                    faculity_id: req.body.faculity_id,
                    department: req.body.department,
                    nationality: req.body.nationality,
                }
                const sqlUpdate = "UPDATE users SET ? WHERE id = ?";
                const resultUpdate = await query(sqlUpdate, [userDate, req.body.user_id]);
                if (resultUpdate.affectedRows > 0 && req.body.files_numbers) {
                    let columns = "";
                    if (req.body.ser_reg != null) {
                        columns = "ser_reg"
                    } else if (req.body.ser_formation != null) {
                        columns = "ser_formation"
                    } else if (req.body.ser_grant != null) {
                        columns = "ser_grant"
                    } else if (req.body.ser_personal != null) {
                        columns = "ser_personal"
                    } else if (req.body.ser_upgrade != null) {
                        columns = "ser_upgrade"
                    } else if (req.body.ser_knowledge != null) {
                        columns = "ser_knowledge"
                    } else if (req.body.ser_magazine != null) {
                        columns = "ser_magazine"
                    } else if (req.body.ser_best != null) {
                        columns = "ser_best"
                    }
                    const sqlSelect2 = `SELECT * FROM submit WHERE ${columns} = ? AND user_id = ?`;
                    const result2 = await query(sqlSelect2, [req.body[columns], req.body.user_id]);
                    if (result2.length > 0) {
                        const sqlUpdate2 = `UPDATE submit SET files_numbers = ? WHERE ${columns} = ? AND user_id = ?`;
                        const resultUpdate2 = await query(sqlUpdate2, [req.body.files_numbers, req.body[columns], req.body.user_id]);
                        if (resultUpdate2.affectedRows > 0) {
                            return res.status(200).json({ message: " تم تعديل بيانات المستخدم بنجاح" });
                        }
                    } else {
                        error.push("لم يتم تعديل بيانات المستخدم");
                        return res.status(400).json({ message: error });
                    }

                } else if (resultUpdate.affectedRows > 0) {
                    return res.status(200).json({ message: " تم تعديل بيانات المستخدم بنجاح" });
                } else {
                    error.push("لم يتم تعديل بيانات المستخدم");
                    return res.status(400).json({ message: error });
                }
            } else {
                error.push("لم يتم العثور على المستخدم");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

user.get('/getuserbyid/:serId/:serNam/:stId/:appId',
    checkmanager,
    async (req, res) => {
        try {
            const serId = req.params.serId
            const serNam = req.params.serNam
            const stId = req.params.stId
            const appId = req.params.appId

            let ser_table = ""
            if (serNam === 'ser_reg') {
                ser_table = "registration_services"
            } else if (serNam == 'ser_formation') {
                ser_table = 'formation_service'
            } else if (serNam == 'ser_grant') {
                ser_table = 'grant_service'
            } else if (serNam == 'ser_personal') {
                ser_table = 'personal_examination_service'
            } else if (serNam == 'ser_upgrade') {
                ser_table = 'upgrade_service'
            } else if (serNam == 'ser_knowledge') {
                ser_table = 'knowledge_bank_service'
            } else if (serNam == 'ser_magazine') {
                ser_table = 'magazine_checking_service'
            } else if (serNam == 'ser_best') {
                ser_table = 'best_message_service'
            }
            let facultyFlag = false
            let facultyTable = ``
            let facultyJoin = ``
            if (facultyFlag) {
                facultyTable = `,faculty.*`
                facultyJoin = `JOIN faculty ON users.faculity_id = faculty.faculty_id`
            }
            const sqlSelect0 = `SELECT * FROM users WHERE id = ? `;
            const result0 = await query(sqlSelect0, [stId]);
            if (result0.length > 0) {
                if (result0[0].faculity_id != null) {
                    facultyFlag = true
                }
            }

            // const sqlSelect = `SELECT 
            //  submit.* , users.* , services.* , ${ser_table}.*  ${facultyTable} FROM submit JOIN users ON submit.user_id = users.id JOIN services ON submit.service_id = services.id 
            //  JOIN ${ser_table} ON submit.${serNam} = ${ser_table}.id  
            //  ${facultyJoin}
            //  WHERE submit.${serNam} = ?  AND users.id = ? AND submit.service_id = ? `;
            const sqlSelect = `SELECT 
    submit.*, users.*, services.*, ${ser_table}.*, faculty.*
FROM 
    submit
JOIN 
    users ON submit.user_id = users.id
JOIN 
    services ON submit.service_id = services.id
JOIN 
    ${ser_table} ON submit.${serNam} = ${ser_table}.id
    LEFT JOIN 
    faculty ON users.faculity_id = faculty.faculty_id
WHERE 
    submit.${serNam} = ?  
    AND users.id = ? 
    AND submit.service_id = ? 
    AND (users.faculity_id IS NULL OR users.faculity_id IS NOT NULL)`;

            const result = await query(sqlSelect, [appId, stId, serId]);
            if (result.length > 0) {
                delete result[0].password;
                // check if user has response_text.json file
                let response_text = ""                
                const path = join(__dirname, `../public/imgs/${result[0].national_id}/response_text${appId}.json`);
                try {
                    if (fs.existsSync(path)) {
                        response_text = JSON.parse(fs.readFileSync(path, 'utf8'));
                    }
                } catch (error) {
                    console.log(error)
                }
                // add response_text to result
                result[0].hestory_edit = response_text
                return res.status(200).json(result[0]);
            } else {
                return res.status(400).json({ message: "No user found" });
            }
        } catch (errors) {
            return res.status(500).json({ message: errors });
        }
    }
)

user.post('/contactUs',
    checkUser,
    body('service_id').notEmpty().withMessage('service_id is required'),
    body('selectedReson').notEmpty().withMessage('selectedReson is required'),
    body('message').notEmpty().withMessage('message is required'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.errors.forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }
            const contactUsData = {
                user_id: req.id,
                service_id: req.body.service_id,
                reson: req.body.selectedReson,
                message: req.body.message,
            }

            // check if user has already sent 2 messages to the same service and resive response
            const sqlSelect0 = "SELECT * FROM messages WHERE user_id = ? AND service_id = ? AND response IS NULL";
            const result0 = await query(sqlSelect0, [req.id, req.body.service_id]);
            if (result0.length > 1) {
                error.push("لقد تجاوزت الحد المسموح به من الرسائل , يجب انتظار الرد على الرسائل السابقة اولا");
                return res.status(400).json({ message: error });
            }


            const sqlInsert = "INSERT INTO messages SET ?";
            const result = await query(sqlInsert, [contactUsData]);
            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "Contact us added successfully" });
            } else {
                error.push("Contact us not added");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

user.get('/getusermessages',
    checkUser,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT messages.id AS message_id, messages.* , services.* FROM messages JOIN services ON messages.service_id = services.id WHERE messages.user_id = ? ORDER BY messages.id DESC";
            const result = await query(sqlSelect, [req.id]);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                error.push("No messages found");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

user.post('/sendResponse',
    checkUser,
    body('message_id').notEmpty().withMessage('يجب اختيار الرسالة'),
    body('response').notEmpty().withMessage('يجب ادخال الرد'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.errors.forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }
            const SqlSelect = "SELECT * FROM messages WHERE id = ? AND user_id = ?";
            const resultSelect = await query(SqlSelect, [req.body.message_id, req.id]);
            if (resultSelect.length > 0) {
                const messageData = {
                    response: req.body.response,
                    response_date: new Date(),
                }
                const sqlUpdate = "UPDATE messages SET ? WHERE id = ?";
                const result = await query(sqlUpdate, [messageData, req.body.message_id]);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم ارسال الرد بنجاح" });
                } else {
                    error.push("لم يتم ارسال الرد");
                    return res.status(400).json({ message: error });
                }
            }
            else {
                error.push("لم يتم ارسال الرد");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

user.get('/getAllFaculties',
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM faculty";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                error.push("No faculties found");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);


export default user;



