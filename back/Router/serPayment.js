import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import e from "express";
import checkUser from "../MiddleWare/checkUser.js";
import upload from "../MiddleWare/Uplodeimgs.js";
import fs from "fs";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));




const serPayment = express();
serPayment.use(express.Router());
const handleDeleteFile = (req) => {

    if (!req.file) {
        return;
    }
    const img = req.file.filename;
    const path = join(__dirname, `../public/imgs/${req.national_id}/${img}`);

    fs.unlinkSync(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    }
    )
}



serPayment.get('/getAllServices',
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

serPayment.post('/payment',
    checkUser,
    upload.single('photo_college_letter'),
    body('service_id').notEmpty().withMessage('Service ID is required'),
    async (req, res) => {

        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                handleDeleteFile(req);
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            /****     check if user has already submitted      ****/
            const sqlSelect2 = "SELECT * FROM submit WHERE user_id = ? AND service_id = ? AND (status != 5 AND status != 6)";
            const result2 = await query(sqlSelect2, [req.id, req.body.service_id]);
            if (result2.length > 0) {
                error.push(" لا يمكنك التقديم لهذه الخدمة الان لان لديك طلب  لها بانتظار الرد");
                handleDeleteFile(req);
                return res.status(400).json({ message: error });
            }

            /****     check file type pdf or img      ****/

            if (!req.file && req.body.service_id != 3) {
                error.push("Photo college letter is required");
                return res.status(400).json({ message: error });
            }

            if (req.file) {
                const file = req.file;
                const ext = file.filename.split(".").pop();
                (ext);
                if (ext != 'pdf' && ext != 'jpeg' && ext != 'jpg' && ext != 'png' && ext != 'webp' && ext != 'svg' && ext != 'docx' && ext != 'doc') {
                    error.push("File type not allowed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            }


            if (req.body.service_id == 1) {

                if (req.body.level == '') {
                    error.push("Level is required");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }

                const reg = {
                    level: req.body.level,
                    photo_college_letter: req.file.filename,
                }

                const sqlInsert = "INSERT INTO registration_services SET ?";
                const result = await query(sqlInsert, reg);

                if (result.affectedRows > 0) {
                    const sqlSelect = "SELECT * FROM registration_services WHERE id = ?";
                    const result2 = await query(sqlSelect, result.insertId);
                    const reg_id = result2[0].id;
                    const submitData = {
                        ser_reg: reg_id,
                        status: 0,
                        user_id: req.id,
                        service_id: req.body.service_id,
                        req_code_date: new Date(),
                    }

                    const sqlInsert2 = "INSERT INTO submit SET ?";
                    const result3 = await query(sqlInsert2, submitData);
                    if (result3.affectedRows > 0) {
                        return res.status(201).json({ message: "Payment successful" });
                    } else {
                        error.push("Payment failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }

                } else {
                    error.push("Payment failed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });

                }
            } else if (req.body.service_id == 2) {

                if (req.body.level == '') {
                    error.push("Level is required");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }

                const form = {
                    level: req.body.level,
                    photo_college_letter: req.file.filename,
                }

                const sqlInsert = "INSERT INTO formation_service SET ?";
                const result = await query(sqlInsert, form);

                if (result.affectedRows > 0) {
                    const sqlSelect = "SELECT * FROM formation_service WHERE id = ?";
                    const result2 = await query(sqlSelect, result.insertId);
                    const ser_formation = result2[0].id;
                    const submitData = {
                        ser_formation: ser_formation,
                        status: 0,
                        user_id: req.id,
                        service_id: req.body.service_id,
                        req_code_date: new Date(),
                    }

                    const sqlInsert2 = "INSERT INTO submit SET ?";
                    const result3 = await query(sqlInsert2, submitData);
                    if (result3.affectedRows > 0) {
                        return res.status(201).json({ message: "Payment successful" });
                    } else {
                        error.push("Payment failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("Payment failed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }

            } else if (req.body.service_id == 3) {
                if (!req.body.files_numbers) {
                    error.push("Files numbers is required");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }

                const personal = {
                    photo_college_letter: null,
                }

                const sqlInsert = "INSERT INTO personal_examination_service SET ?";
                const result = await query(sqlInsert, personal);

                if (result.affectedRows > 0) {
                    const submitData = {
                        files_numbers: req.body.files_numbers,
                        ser_personal: result.insertId,
                        status: 0,
                        user_id: req.id,
                        service_id: req.body.service_id,
                        req_code_date: new Date(),
                    }

                    const sqlInsert2 = "INSERT INTO submit SET ?";
                    const result3 = await query(sqlInsert2, submitData);
                    if (result3.affectedRows > 0) {
                        return res.status(200).json({ message: "Payment successful" });
                    } else {
                        error.push("Payment failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("Payment failed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (req.body.service_id == 4) {
                if (!req.body.files_numbers) {
                    error.push("Files numbers is required");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
                const magazine = {
                    photo_college_letter: req.file.filename,
                }

                const sqlInsert = "INSERT INTO magazine_checking_service SET ?";
                const result = await query(sqlInsert, magazine);

                if (result.affectedRows > 0) {
                    const submitData = {
                        files_numbers: req.body.files_numbers,
                        ser_magazine: result.insertId,
                        status: 0,
                        user_id: req.id,
                        service_id: req.body.service_id,
                        req_code_date: new Date(),

                    }

                    const sqlInsert2 = "INSERT INTO submit SET ?";
                    const result3 = await query(sqlInsert2, submitData);
                    if (result3.affectedRows > 0) {
                        return res.status(200).json({ message: "Payment successful" });
                    } else {
                        error.push("Payment failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("Payment failed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (req.body.service_id == 5) {
                if (!req.body.files_numbers) {
                    error.push("Files numbers is required");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
                const upgrade_service = {
                    photo_college_letter: req.file.filename,
                }

                const sqlInsert = "INSERT INTO upgrade_service SET ?";
                const result = await query(sqlInsert, upgrade_service);

                if (result.affectedRows > 0) {
                    const submitData = {
                        files_numbers: req.body.files_numbers,
                        ser_upgrade: result.insertId,
                        status: 0,
                        user_id: req.id,
                        service_id: req.body.service_id,
                        req_code_date: new Date(),
                    }

                    const sqlInsert2 = "INSERT INTO submit SET ?";
                    const result3 = await query(sqlInsert2, submitData);
                    if (result3.affectedRows > 0) {
                        return res.status(200).json({ message: "Payment successful" });
                    } else {
                        error.push("Payment failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("Payment failed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (req.body.service_id == 6) {
                if (!req.body.files_numbers) {
                    error.push("Files numbers is required");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }

                const best = {
                    photo_college_letter: req.file.filename,
                }

                const sqlInsert = "INSERT INTO best_message_service SET ?";
                const result = await query(sqlInsert, best);

                if (result.affectedRows > 0) {
                    const submitData = {
                        files_numbers: req.body.files_numbers,
                        ser_best: result.insertId,
                        status: 0,
                        user_id: req.id,
                        service_id: req.body.service_id,
                        req_code_date: new Date(),
                    }

                    const sqlInsert2 = "INSERT INTO submit SET ?";
                    const result3 = await query(sqlInsert2, submitData);
                    if (result3.affectedRows > 0) {
                        return res.status(200).json({ message: "Payment successful" });
                    } else {
                        error.push("Payment failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("Payment failed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            }


        } catch (errors) {
            error.push(errors);
            handleDeleteFile(req);
            return res.status(500).json(errors);
        }
    }
);


serPayment.get('/getallwaiting',
    checkUser,
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

            const sqlSelect = `SELECT submit.*, services.*, users.*
            FROM submit
            INNER JOIN users ON submit.user_id = users.id
            INNER JOIN services ON submit.service_id = services.id
            WHERE submit.user_id = ?`
            const result = await query(sqlSelect, req.id);

            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    delete result[i].password;
                    delete result[i].national_id;
                    let response_text = ""    
                    let serId = "";
                    if (result[i].ser_reg) {
                        serId = result[i].ser_reg;
                    } else if (result[i].ser_formation) {
                        serId = result[i].ser_formation;
                    } else if (result[i].ser_personal) {
                        serId = result[i].ser_personal;
                    } else if (result[i].ser_magazine) {
                        serId = result[i].ser_magazine;
                    } else if (result[i].ser_upgrade) {
                        serId = result[i].ser_upgrade;
                    } else if (result[i].ser_best) {
                        serId = result[i].ser_best;
                    } else if (result[i].ser_grant) {
                        serId = result[i].ser_grant;
                    } else if (result[i].ser_knowledge) {
                        serId = result[i].ser_knowledge;
                    }
                    const path = join(__dirname, `../public/imgs/${req.national_id}/response_text${serId}.json`);         
                    try {
                        if (fs.existsSync(path)) {
                            response_text = JSON.parse(fs.readFileSync(path, 'utf8'));
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    result[i].hestory_edit = response_text;
                }
                
                return res.status(200).json(result);
            } else {
                error.push("No data found");
                return res.status(400).json({ message: error });
            }

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

serPayment.get('/paymentEdit/:id/:id2',
    checkUser,
    async (req, res) => {
        let error = [];
        const id = req.params.id;
        const id2 = req.params.id2;
        try {
            if (id == 1) {
                const sqlSelect = "SELECT * FROM registration_services WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 2) {
                const sqlSelect = "SELECT * FROM formation_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 3) {
                const sqlSelect = "SELECT * FROM personal_examination_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 4) {
                const sqlSelect = "SELECT * FROM magazine_checking_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 5) {
                const sqlSelect = "SELECT * FROM upgrade_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 6) {
                const sqlSelect = "SELECT * FROM best_message_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 7) {
                const sqlSelect = "SELECT * FROM grant_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 8) {
                const sqlSelect = "SELECT * FROM knowledge_bank_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                } else {
                    error.push("No data found");
                    return res.status(400).json({ message: error });
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

serPayment.put('/paymentEdit/:id/:id2',
    checkUser,
    upload.single('photo_college_letter'),
    async (req, res) => {
        let error = [];
        const id = req.params.id;
        const id2 = req.params.id2;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            /****     check file type pdf or img      ****/

            if (req.file) {
                const file = req.file;
                const ext = file.filename.split(".").pop();
                (ext);
                if (ext != 'pdf' && ext != 'jpeg' && ext != 'jpg' && ext != 'png' && ext != 'webp' && ext != 'svg' && ext != 'docx' && ext != 'doc') {
                    error.push("File type not allowed");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            }


            if (id == 1) {
                const sqlSelect = "SELECT * FROM registration_services WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    const reg = {
                        level: req.body.level ? req.body.level : result[0].level,
                        photo_college_letter: req.file ? req.file.filename : result[0].photo_college_letter,
                    }
                    if (req.file) {
                        fs.unlinkSync(join(__dirname, `../public/imgs/${req.national_id}/${result[0].photo_college_letter}`), (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                    const sqlUpdate = "UPDATE registration_services SET ? WHERE id = ?";
                    const result2 = await query(sqlUpdate, [reg, id2]);
                    if (result2.affectedRows > 0) {
                        const sqlSelect2 = "SELECT * FROM submit WHERE ser_reg = ? AND user_id = ?";
                        const result3 = await query(sqlSelect2, [id2, req.id]);
                        if (result3.length > 0) {
                            const submitData = {
                                status: result3[0].payment_code != null ? 2 : 0,
                                response_text: null,
                                response_pdf: null,
                                edit_date: new Date(),
                                manager_status: null,
                            }
                            const sqlUpdate2 = "UPDATE submit SET ? WHERE ser_reg = ? AND user_id = ?";
                            const result4 = await query(sqlUpdate2, [submitData, id2, req.id]);
                            if (result4.affectedRows > 0) {
                                return res.status(200).json({ message: "Update successful" });
                            } else {
                                error.push("Update failed");
                                handleDeleteFile(req);
                                return res.status(400).json({ message: error });
                            }
                        } else {
                            error.push("No data found");
                            handleDeleteFile(req);
                            return res.status(400).json({ message: error });
                        }
                    } else {
                        error.push("Update failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("No data found");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (id == 2) {

                const sqlSelect = "SELECT * FROM formation_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {

                    const form = {
                        level: req.body.level ? req.body.level : result[0].level,
                        photo_college_letter: req.file ? req.file.filename : result[0].photo_college_letter,
                    }

                    if (req.file) {
                        fs.unlinkSync(join(__dirname, `../public/imgs/${req.national_id}/${result[0].photo_college_letter}`), (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        }
                        )
                    }

                    const sqlUpdate = "UPDATE formation_service SET ? WHERE id = ?";
                    const result2 = await query(sqlUpdate, [form, id2]);
                    if (result2.affectedRows > 0) {
                        const sqlSelect2 = "SELECT * FROM submit WHERE ser_formation = ? AND user_id = ?";
                        const result3 = await query(sqlSelect2, [id2, req.id]);
                        if (result3.length > 0) {
                            const submitData = {
                                status: result3[0].payment_code != null ? 2 : 0,
                                response_text: null,
                                response_pdf: null,
                                edit_date: new Date(),
                                manager_status: null,

                            }

                            const sqlUpdate2 = "UPDATE submit SET ? WHERE ser_formation = ? AND user_id = ?";
                            const result4 = await query(sqlUpdate2, [submitData, id2, req.id]);
                            if (result4.affectedRows > 0) {
                                return res.status(200).json({ message: "Update successful" });
                            } else {
                                error.push("Update failed");
                                handleDeleteFile(req);
                                return res.status(400).json({ message: error });
                            }
                        } else {
                            error.push("No data found");
                            handleDeleteFile(req);
                            return res.status(400).json({ message: error });
                        }
                    } else {
                        error.push("Update failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("No data found");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (id == 3) {
                const sqlSelect = "SELECT * FROM personal_examination_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    const personal = {
                        photo_college_letter: req.file ? req.file.filename : result[0].photo_college_letter,
                    }
                    if (req.file) {
                        fs.unlinkSync(join(__dirname, `../public/imgs/${req.national_id}/${result[0].photo_college_letter}`), (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                    const sqlUpdate = "UPDATE personal_examination_service SET ? WHERE id = ?";
                    const result2 = await query(sqlUpdate, [personal, id2]);
                    if (result2.affectedRows > 0) {
                        const sqlSelect2 = "SELECT * FROM submit WHERE ser_personal = ? AND user_id = ?";
                        const result3 = await query(sqlSelect2, [id2, req.id]);
                        if (result3.length > 0) {
                            const submitData = {
                                files_numbers: req.body.files_numbers ? req.body.files_numbers : result3[0].files_numbers,
                                status: result3[0].payment_code != null ? 2 : 0,
                                response_text: null,
                                response_pdf: null,
                                edit_date: new Date(),
                                manager_status: null,
                            }

                            const sqlUpdate2 = "UPDATE submit SET ? WHERE ser_personal = ? AND user_id = ?";
                            const result4 = await query(sqlUpdate2, [submitData, id2, req.id]);
                            if (result4.affectedRows > 0) {
                                return res.status(200).json({ message: "Update successful" });
                            } else {
                                error.push("Update failed");
                                handleDeleteFile(req);
                                return res.status(400).json({ message: error });
                            }
                        } else {
                            error.push("No data found");
                            handleDeleteFile(req);
                            return res.status(400).json({ message: error });
                        }
                    } else {
                        error.push("Update failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("No data found");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (id == 4) {
                const sqlSelect = "SELECT * FROM magazine_checking_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    const magazine = {
                        photo_college_letter: req.file ? req.file.filename : result[0].photo_college_letter,
                    }
                    if (req.file) {
                        fs.unlinkSync(join(__dirname, `../public/imgs/${req.national_id}/${result[0].photo_college_letter}`), (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                    const sqlUpdate = "UPDATE magazine_checking_service SET ? WHERE id = ?";
                    const result2 = await query(sqlUpdate, [magazine, id2]);
                    if (result2.affectedRows > 0) {
                        const sqlSelect2 = "SELECT * FROM submit WHERE ser_magazine = ? AND user_id = ?";
                        const result3 = await query(sqlSelect2, [id2, req.id]);
                        if (result3.length > 0) {
                            const submitData = {
                                files_numbers: req.body.files_numbers ? req.body.files_numbers : result3[0].files_numbers,
                                status: result3[0].payment_code != null ? 2 : 0,
                                response_text: null,
                                response_pdf: null,
                                edit_date: new Date(),
                                manager_status: null,
                            }

                            const sqlUpdate2 = "UPDATE submit SET ? WHERE ser_magazine = ? AND user_id = ?";
                            const result4 = await query(sqlUpdate2, [submitData, id2, req.id]);
                            if (result4.affectedRows > 0) {
                                return res.status(200).json({ message: "Update successful" });
                            } else {
                                error.push("Update failed");
                                handleDeleteFile(req);
                                return res.status(400).json({ message: error });
                            }
                        } else {
                            error.push("No data found");
                            handleDeleteFile(req);
                            return res.status(400).json({ message: error });
                        }
                    } else {
                        error.push("Update failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("No data found");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (id == 5) {
                const sqlSelect = "SELECT * FROM upgrade_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    const upgrade_service = {
                        photo_college_letter: req.file ? req.file.filename : result[0].photo_college_letter,
                    }
                    if (req.file) {
                        fs.unlinkSync(join(__dirname, `../public/imgs/${req.national_id}/${result[0].photo_college_letter}`), (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                    const sqlUpdate = "UPDATE upgrade_service SET ? WHERE id = ?";
                    const result2 = await query(sqlUpdate, [upgrade_service, id2]);
                    if (result2.affectedRows > 0) {
                        const sqlSelect2 = "SELECT * FROM submit WHERE ser_upgrade = ? AND user_id = ?";
                        const result3 = await query(sqlSelect2, [id2, req.id]);
                        if (result3.length > 0) {
                            const submitData = {
                                files_numbers: req.body.files_numbers ? req.body.files_numbers : result3[0].files_numbers,
                                status: result3[0].payment_code != null ? 2 : 0,
                                response_text: null,
                                response_pdf: null,
                                edit_date: new Date(),
                                manager_status: null,
                            }

                            const sqlUpdate2 = "UPDATE submit SET ? WHERE ser_upgrade = ? AND user_id = ?";
                            const result4 = await query(sqlUpdate2, [submitData, id2, req.id]);
                            if (result4.affectedRows > 0) {
                                return res.status(200).json({ message: "Update successful" });
                            } else {
                                error.push("Update failed");
                                handleDeleteFile(req);
                                return res.status(400).json({ message: error });
                            }
                        } else {
                            error.push("No data found");
                            handleDeleteFile(req);
                            return res.status(400).json({ message: error });
                        }
                    } else {
                        error.push("Update failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("No data found");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }
            } else if (id == 6) {
                const sqlSelect = "SELECT * FROM best_message_service WHERE id = ?";
                const result = await query(sqlSelect, id2);
                if (result.length > 0) {
                    const best = {
                        photo_college_letter: req.file ? req.file.filename : result[0].photo_college_letter,
                    }
                    if (req.file) {
                        fs.unlinkSync(join(__dirname, `../public/imgs/${req.national_id}/${result[0].photo_college_letter}`), (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                    const sqlUpdate = "UPDATE best_message_service SET ? WHERE id = ?";
                    const result2 = await query(sqlUpdate, [best, id2]);
                    if (result2.affectedRows > 0) {
                        const sqlSelect2 = "SELECT * FROM submit WHERE ser_best = ? AND user_id = ?";
                        const result3 = await query(sqlSelect2, [id2, req.id]);
                        if (result3.length > 0) {
                            const submitData = {
                                files_numbers: req.body.files_numbers ? req.body.files_numbers : result3[0].files_numbers,
                                status: result3[0].payment_code != null ? 2 : 0,
                                response_text: null,
                                response_pdf: null,
                                edit_date: new Date(),
                                manager_status: null,
                            }

                            const sqlUpdate2 = "UPDATE submit SET ? WHERE ser_best = ? AND user_id = ?";
                            const result4 = await query(sqlUpdate2, [submitData, id2, req.id]);
                            if (result4.affectedRows > 0) {
                                return res.status(200).json({ message: "Update successful" });
                            } else {
                                error.push("Update failed");
                                handleDeleteFile(req);
                                return res.status(400).json({ message: error });
                            }
                        } else {
                            error.push("No data found");
                            handleDeleteFile(req);
                            return res.status(400).json({ message: error });
                        }
                    } else {
                        error.push("Update failed");
                        handleDeleteFile(req);
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("No data found");
                    handleDeleteFile(req);
                    return res.status(400).json({ message: error });
                }

            }

        } catch (errors) {
            error.push(errors);
            handleDeleteFile(req);
            return res.status(500).json({ message: error });
        }
    }
);



export default serPayment;


