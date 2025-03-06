import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import checkAdmin from "../MiddleWare/checkAdmin.js";
import upload from "../MiddleWare/Uplodeimgs.js";
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import e from "express";
const __dirname = dirname(fileURLToPath(import.meta.url));




const Admin = express();
Admin.use(express.Router());


Admin.get('/getallApplicantsStatus',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            // get count of all requests and count of all status(0,1,2,3,4,5,6)

            const selectedServices = parseInt(req.query.service_id) || null;

            let condition = '';

            if (selectedServices) {
                condition = `WHERE service_id = ${selectedServices}`;
            }

            const sqlSelect = `SELECT 
                                    COUNT(*) as total_requests,
                                    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as status_0_count,
                                    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as status_1_count,
                                    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as status_2_count,
                                    SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) as status_3_count,
                                    SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) as status_4_count,
                                    SUM(CASE WHEN status = 5 THEN 1 ELSE 0 END) as status_5_count,
                                    SUM(CASE WHEN status = 6 THEN 1 ELSE 0 END) as status_6_count,
                                    SUM(CASE WHEN service_id = 1 THEN 1 ELSE 0 END) as service_1_count,
                                    SUM(CASE WHEN service_id = 2 THEN 1 ELSE 0 END) as service_2_count,
                                    SUM(CASE WHEN service_id = 3 THEN 1 ELSE 0 END) as service_3_count,
                                    SUM(CASE WHEN service_id = 4 THEN 1 ELSE 0 END) as service_4_count,
                                    SUM(CASE WHEN service_id = 5 THEN 1 ELSE 0 END) as service_5_count,
                                    SUM(CASE WHEN service_id = 6 THEN 1 ELSE 0 END) as service_6_count,
                                    SUM(CASE WHEN service_id = 7 THEN 1 ELSE 0 END) as service_7_count,
                                    SUM(CASE WHEN service_id = 8 THEN 1 ELSE 0 END) as service_8_count
                                FROM submit 
                                ${condition}`;


            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result[0]);
            } else {
                return res.status(200).json({ message: "لا يوجد طلبات" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)



Admin.get('/getallApplicantsShow',
    checkAdmin,
    async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const selectedServices = parseInt(req.query.service) || null;
            const selectedStatus = req.query.status !== undefined ? parseInt(req.query.status) : null;
            const search = req.query.search || null;

            let conditions = [];
            let values = [];

            if (selectedServices) {
                conditions.push(`submit.service_id = ?`);
                values.push(selectedServices);
            }

            if (selectedStatus !== null && !isNaN(selectedStatus)) {
                if (selectedStatus === 10) {
                    conditions.push(`submit.status = 0`);
                } else {
                    conditions.push(`submit.status = ?`);
                    values.push(selectedStatus);
                }
            }

            if (search) {
                conditions.push(`users.name LIKE ?`);
                values.push(`%${search}%`);
            }

            const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
            values.push(limit, offset);

            const sqlSelect = `
            SELECT submit.*, users.name, users.national_id, services.service_name_ar  
            FROM submit 
            INNER JOIN users ON submit.user_id = users.id 
            INNER JOIN services ON submit.service_id = services.id 
            ${whereClause}
            ORDER BY submit.status ASC, submit.submit_date ASC, submit.id ASC, submit.distribution_date ASC
            LIMIT ? OFFSET ?`;

            const result = await query(sqlSelect, values);

            if (result.length > 0) {
                const countQuery = `
                SELECT COUNT(*) as total 
                FROM submit 
                INNER JOIN users ON submit.user_id = users.id 
                INNER JOIN services ON submit.service_id = services.id 
                ${whereClause} `;
                const totalCountResult = await query(countQuery, values.slice(0, -2)); // Use same values except for limit and offset
                const total = totalCountResult[0].total;
                const pages = Math.ceil(total / limit);

                return res.status(200).json({ result, total, pages });
            } else {
                return res.status(200).json({ message: "لا يوجد طلبات" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);




// Admin.get('/getuserbyid/:serId/:serNam/:stId/:appId',
//     checkAdmin,
//     async (req, res) => {
//         try {
//             const serId = req.params.serId
//             const serNam = req.params.serNam
//             const stId = req.params.stId
//             const appId = req.params.appId

//             let ser_table = ""
//             if (serNam === 'ser_reg') {
//                 ser_table = "registration_services"
//             } else if (serNam == 'ser_formation') {
//                 ser_table = 'formation_service'
//             } else if (serNam == 'ser_grant') {
//                 ser_table = 'grant_service'
//             } else if (serNam == 'ser_personal') {
//                 ser_table = 'personal_examination_service'
//             } else if (serNam == 'ser_upgrade') {
//                 ser_table = 'upgrade_service'
//             } else if (serNam == 'ser_knowledge') {
//                 ser_table = 'knowledge_bank_service'
//             } else if (serNam == 'ser_magazine') {
//                 ser_table = 'magazine_checking_service'
//             } else if (serNam == 'ser_best') {
//                 ser_table = 'best_message_service'
//             }


//             const sqlSelect = `SELECT submit.* , users.* , services.* , ${ser_table}.* FROM submit JOIN users ON submit.user_id = users.id JOIN services ON submit.service_id = services.id JOIN ${ser_table} ON submit.${serNam} = ${ser_table}.id WHERE submit.${serNam} = ?  AND users.id = ? AND submit.service_id = ? `;
//             const result = await query(sqlSelect, [appId, stId, serId]);
//             if (result.length > 0) {
//                 return res.status(200).json(result[0]);
//             } else {
//                 return res.status(400).json({ message: "لا يوجد طلبات" });
//             }
//         } catch (errors) {
//             return res.status(500).json({ message: errors });
//         }
//     }
// )

Admin.get('/getuserbyid/:serId/:serNam/:stId/:appId',
    checkAdmin,
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
                return res.status(200).json(result[0]);
            } else {
                return res.status(400).json({ message: "No user found" });
            }
        } catch (errors) {
            return res.status(500).json({ message: errors });
        }
    }
)

Admin.put('/acceptApplicantforadmin',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            if (req.body.reason === "" && req.body.status !== 2) {
                return res.status(400).json({ message: "يجب ادخال السبب" });
            }

            if (req.body.reason !== "") {
                const sqlUpdate = `UPDATE submit SET status = ? , response_text = ? , response_pdf = null WHERE ${req.body.ser_name} = ?`;
                const value = [req.body.status, req.body.reason, req.body.app_id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم طلب التعديل بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.put('/acceptApplicant/:id',
    upload.single('response_pdf'),
    checkAdmin,
    body('ser_name').notEmpty().withMessage('يجب ادخال اسم الخدمه'),
    body('app_id').notEmpty().withMessage('يجب ادخال رقم الطلب'),
    body('ser_id').notEmpty().withMessage('يجب ادخال رقم الخدمه'),
    body('student_id').notEmpty().withMessage('يجب ادخال رقم الطالب'),
    body('response_text').notEmpty().withMessage('يجب ادخال السبب'),
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = `SELECT * FROM submit WHERE ${req.body.ser_name} = ?`;
            const value = [req.body.app_id];
            const result = await query(sqlSelect, value);
            if (result[0]) {
                if (result.length > 0) {
                    const Data = {
                        response_text: req.body.response_text,
                        response_pdf: req.file ? req.file.filename : null,
                        response_date: new Date(),
                        status: 5,
                    }
                    const sqlUpdate = `UPDATE submit SET ? WHERE ${req.body.ser_name} = ? AND service_id = ? AND user_id = ?`;
                    const value = [Data, req.body.app_id, req.body.ser_id, req.body.student_id];
                    const result = await query(sqlUpdate, value);
                    if (result.affectedRows > 0) {
                        return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
                    }
                }
                else {
                    return res.status(200).json({ message: "لا يوجد طلبات" });
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.put('/watingApplicant/:id',
    checkAdmin,
    async (req, res) => {
        try {
            const id = req.params.id;
            if (+req.body.status === 2) {
                const sqlSelect = `SELECT * FROM submit WHERE ${req.body.ser_name} = ?`;
                const value = [req.body.app_id];
                const result1 = await query(sqlSelect, value);
                if (result1 && result1.length > 0 && result1[0].response_pdf) {

                    const filePath = join(__dirname, `../public/imgs/${id}/${result1[0].response_pdf}`);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                const sqlUpdate = `UPDATE submit SET status = ? , response_text = ? , response_pdf = null ,response_date = null , manager_status = null  WHERE ${req.body.ser_name} = ?`;
                const value2 = [req.body.status, req.body.reason, req.body.app_id];
                const result = await query(sqlUpdate, value2);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            }

        } catch (errors) {
            return res.status(500).json({ message: errors });
        }
    }
)

Admin.get('/getallManagers',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT manager.* , services.service_name_ar FROM manager INNER JOIN services ON manager.service_id = services.id order by manager.id DESC";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    delete result[i].password;
                }
                return res.status(200).json(result);
            } else {
                return res.status(200).json({ message: "لا يوجد مديرين" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)
Admin.get('/getallSubManagers',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM manager WHERE role = 1 order by manager.id DESC";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    delete result[i].password;
                }
                return res.status(200).json(result);
            } else {
                return res.status(200).json({ message: "لا يوجد مديرين" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)




Admin.post('/addManager',
    body('mname').notEmpty().withMessage('يجب ادخال اسم المدير'),
    body('email').notEmpty().withMessage('يجب ادخال البريد الالكتروني').isEmail().withMessage('يجب ادخال البريد الالكتروني بشكل صحيح'),
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }
            const sqlSelect = `SELECT * FROM manager WHERE email = ? OR mname = ?`;
            const value = [req.body.email, req.body.mname];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                return res.status(400).json({ message: "يوجد مدير بهذا الايميل او الاسم" });
            } else {
                let Data = {}
                if (req.body.service_id) {
                    Data = {
                        mname: req.body.mname,
                        email: req.body.email,
                        password: "12345678",
                        service_id: req.body.service_id,
                    }
                } else {
                    Data = {
                        mname: req.body.mname,
                        email: req.body.email,
                        password: "12345678",
                        role: 1,
                        service_id: null,
                    }
                }
                const sqlInsert = `INSERT INTO manager SET ?`;
                const result = await query(sqlInsert, Data);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم اضافه المدير بنجاح" });
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.put('/updateManager',
    body('mname').notEmpty().withMessage('يجب ادخال اسم المدير'),
    body('email').notEmpty().withMessage('يجب ادخال البريد الالكتروني').isEmail().withMessage('يجب ادخال البريد الالكتروني بشكل صحيح'),
    body('id').notEmpty().withMessage('يجب ادخال رقم المدير'),
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }
            const sqlSelect = `SELECT * FROM manager WHERE id = ?`;
            const value = [req.body.id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                let Data = {}
                if (req.body.service_id) {
                    Data = {
                        mname: req.body.mname,
                        email: req.body.email,
                        service_id: req.body.service_id,
                        password: 12345678,
                    }
                } else {
                    Data = {
                        mname: req.body.mname,
                        email: req.body.email,
                        role: 1,
                        service_id: null,
                        password: 12345678,
                    }
                }
                const sqlSelect2 = `SELECT * FROM manager WHERE (email = ? OR mname = ?) AND id != ?`;
                const value2 = [req.body.email, req.body.mname, req.body.id];
                const result2 = await query(sqlSelect2, value2);
                if (result2.length > 0) {
                    return res.status(400).json({ message: "يوجد مدير بهذا الايميل او الاسم" });
                }

                const sqlUpdate = `UPDATE manager SET ? WHERE id = ?`;
                const value = [Data, req.body.id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم تعديل المدير بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            } else {
                return res.status(400).json({ message: "لا يوجد مدير بهذا الايميل" });
            }


        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)
Admin.delete('/deleteManager/:id',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const id = req.params.id;
            const sqlSelect1 = `SELECT * FROM submit WHERE manager_id = ?`;
            const value1 = [id];
            const result1 = await query(sqlSelect1, value1);
            if (result1.length > 0) {
                error.push("لا يمكن حذف الموظف لانه مسؤول عن طلبات");
                return res.status(400).json({ message: error });

            } else {
                const sqlSelect = `SELECT * FROM manager WHERE id = ?`;
                const value = [id];
                const result = await query(sqlSelect, value);
                if (result.length > 0) {
                    const sqlDelete = `DELETE FROM manager WHERE id = ?`;
                    const value = [id];
                    const result = await query(sqlDelete, value);
                    if (result.affectedRows > 0) {
                        return res.status(200).json({ message: "تم حذف المدير بنجاح" });
                    } else {
                        return res.status(400).json({ message: " حدث خطأ ما" });
                    }
                } else {
                    return res.status(400).json({ message: "لا يوجد مدير بهذا الايميل" });
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)


Admin.put('/updateService',
    body('service_name_ar').notEmpty().withMessage('يجب ادخال اسم الخدمه'),
    body('service_name').notEmpty().withMessage('يجب ادخال اسم الخدمه'),
    body('pref_ar').notEmpty().withMessage('يجب ادخال وصف الخدمه'),
    body('pref').notEmpty().withMessage('يجب ادخال وصف الخدمه'),
    body('payment_note').notEmpty().withMessage('يجب ادخال تعليمات الدفع بالانجليزيه'),
    body('payment_note_ar').notEmpty().withMessage('يجب ادخال تعليمات الدفع بالعربيه'),
    body('id').notEmpty().withMessage('يجب ادخال رقم الخدمه'),
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }
            const sqlSelect = `SELECT * FROM services WHERE id = ?`;
            const value = [req.body.id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const Data = {
                    service_name_ar: req.body.service_name_ar,
                    service_name: req.body.service_name,
                    pref_ar: req.body.pref_ar,
                    pref: req.body.pref,
                    payment_note: req.body.payment_note,
                    payment_note_ar: req.body.payment_note_ar,
                }
                const sqlUpdate = `UPDATE services SET ? WHERE id = ?`;
                const value = [Data, req.body.id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم تعديل الخدمه بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.put('/enableService',
    body('id').notEmpty().withMessage('يجب ادخال رقم الخدمه'),
    body('enabled').notEmpty().withMessage('يجب ادخال حاله الخدمه'),
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }
            const sqlSelect = `SELECT * FROM services WHERE id = ?`;
            const value = [req.body.id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                let enabled = +req.body.enabled === 1 ? 0 : 1;
                const Data = {
                    enabled: enabled,
                }
                const sqlUpdate = `UPDATE services SET ? WHERE id = ?`;
                const value = [Data, req.body.id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم تعديل الخدمه بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)
Admin.get('/getallEvents',
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM events ORDER BY from_date ASC";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(200).json({ message: "لا يوجد احداث" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.post('/addEvent',
    checkAdmin,
    upload.single('image'),
    body('title').notEmpty().withMessage('يجب ادخال عنوان الحدث'),
    body('content').notEmpty().withMessage('يجب ادخال محتوي الحدث'),
    body('from_date').notEmpty().withMessage('يجب ادخال تاريخ البدايه'),
    body('to_date').notEmpty().withMessage('يجب ادخال تاريخ النهايه'),
    body('place').notEmpty().withMessage('يجب ادخال مكان الحدث'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }
            const Data = {
                title: req.body.title,
                content: req.body.content,
                from_date: req.body.from_date,
                to_date: req.body.to_date,
                place: req.body.place,
                img: req.file ? req.file.filename : null,
            }
            const sqlInsert = `INSERT INTO events SET ?`;
            const result = await query(sqlInsert, Data);
            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "تم اضافه الحدث بنجاح" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.put('/updateEvent/:id',
    checkAdmin,
    body('title').notEmpty().withMessage('يجب ادخال عنوان الحدث'),
    body('content').notEmpty().withMessage('يجب ادخال محتوي الحدث'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            const sqlSelect = `SELECT * FROM events WHERE id = ?`;
            const value = [req.params.id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const Data = {
                    title: req.body.title,
                    content: req.body.content,
                }
                const sqlUpdate = `UPDATE events SET ? WHERE id = ?`;
                const value = [Data, req.params.id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم تعديل الحدث بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            } else {
                return res.status(400).json({ message: "لا يوجد حدث بهذا الرقم" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.delete('/deleteEvent/:id',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const id = req.params.id;
            const sqlSelect = `SELECT * FROM events WHERE id = ?`;
            const value = [id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlDelete = `DELETE FROM events WHERE id = ?`;
                const value = [id];
                const result = await query(sqlDelete, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم حذف الحدث بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            } else {
                return res.status(400).json({ message: "لا يوجد حدث بهذا الرقم" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.get('/getallUsers',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search || null;

            let conditions = "";
            let values = [];

            if (search) {
                conditions = `WHERE users.name LIKE ? OR users.national_id LIKE ?`;
                values = [`%${search}%`, `%${search}%`];
            }

            values.push(limit, offset);

            const sqlSelect = `
            SELECT 
                users.*, 
                COALESCE(submit_counts.submit_count, 0) AS submit_count
            FROM 
                users
            LEFT JOIN (
                SELECT 
                    user_id, 
                    COUNT(*) AS submit_count
                FROM 
                    submit
                GROUP BY 
                    user_id
            ) AS submit_counts 
            ON 
                users.id = submit_counts.user_id
            ${conditions}
            ORDER BY 
                users.id DESC
            LIMIT ? OFFSET ?`;

            const result = await query(sqlSelect, values);
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    delete result[i].password;
                }
                const sqlCount = `SELECT COUNT(*) AS total FROM users ${conditions}`;
                const countResult = await query(sqlCount, values.slice(0, -2));
                const total = countResult[0].total;
                const pages = Math.ceil(total / limit);
                return res.status(200).json({ result, total, pages });

            } else {
                return res.status(200).json({ message: "لا يوجد مستخدمين" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.delete('/deleteUser/:id/:national_id',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const id = parseInt(req.params.id);
            const national_id = req.params.national_id;

            if (!id || !national_id) {
                return res.status(400).json({ message: "يجب ادخال رقم المستخدم" });
            }

            const sqlSelect = `SELECT * FROM users WHERE id = ?`
            const value = [id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlSelect1 = `SELECT * FROM submit WHERE user_id = ?`;
                const value1 = [id];
                const result1 = await query(sqlSelect1, value1);
                if (result1.length > 0) {
                    for (let i = 0; i < result1.length; i++) {
                        let serviceTable = '';
                        let serviceTableId = '';
                        if (result1[i].ser_reg) {
                            serviceTable = 'registration_services';
                            serviceTableId = result1[i].ser_reg;
                        } else if (result1[i].ser_formation) {
                            serviceTable = 'formation_service';
                            serviceTableId = result1[i].ser_formation;
                        } else if (result1[i].ser_grant) {
                            serviceTable = 'grant_service';
                            serviceTableId = result1[i].ser_grant;
                        } else if (result1[i].ser_personal) {
                            serviceTable = 'personal_examination_service';
                            serviceTableId = result1[i].ser_personal;
                        } else if (result1[i].ser_upgrade) {
                            serviceTable = 'upgrade_service';
                            serviceTableId = result1[i].ser_upgrade;
                        } else if (result1[i].ser_knowledge) {
                            serviceTable = 'knowledge_bank_service';
                            serviceTableId = result1[i].ser_knowledge;
                        } else if (result1[i].ser_magazine) {
                            serviceTable = 'magazine_checking_service';
                            serviceTableId = result1[i].ser_magazine;
                        } else if (result1[i].ser_best) {
                            serviceTable = 'best_message_service';
                            serviceTableId = result1[i].ser_best;
                        }

                        const sqlSelect2 = `DELETE FROM ${serviceTable} WHERE id = ?`;
                        const value2 = [serviceTableId];
                        const result2 = await query(sqlSelect2, value2);
                        if (result2.affectedRows === 0) {
                            return res.status(400).json({ message: "حدث خطأ ما في حذف الملف" });
                        }
                        
                    }
                }
                const sqlDelete = `DELETE FROM users WHERE id = ?`;
                const value = [id];
                const result = await query(sqlDelete, value);
                if (result.affectedRows > 0) {
                    // delete user folder
                    const userFolder = join(__dirname, `../public/imgs/${national_id}`);
                    if (fs.existsSync(userFolder)) {
                        fs.rmdirSync(userFolder, { recursive: true });
                    }
                    return res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما في حذف الملف" });
                }
            } else {
                return res.status(400).json({ message: "لا يوجد مستخدم بهذا الرقم" });
            }

        } catch (errors) {
            console.log(errors);
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)





Admin.get('/getFacultyManager',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT manager.id ,manager.email ,manager.password , manager.faculty_id , faculty.faculty_name_ar FROM manager INNER JOIN faculty ON manager.faculty_id = faculty.faculty_id WHERE manager.faculty_id IS NOT NULL";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(200).json({ message: "لا يوجد مديرين" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.post('/addFacultyManager',
    checkAdmin,
    body('faculty_id').notEmpty().withMessage('يجب ادخال رقم الكليه'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }
            const sqlSelect = `SELECT * FROM faculty WHERE faculty_id = ?`;
            const value = [req.body.faculty_id];
            const result = await query(sqlSelect, value);
            const faculty_name = result[0].faculty_name.replace(/\s/g, "_")
            const FEmail = `Faculty_Of_${faculty_name}@info.com`

            if (result.length > 0) {
                const sqlSelect2 = `SELECT * FROM manager WHERE email = ?`;
                const value2 = [FEmail];
                const result2 = await query(sqlSelect2, value2);
                if (result2.length > 0) {
                    return res.status(400).json({ message: "يوجد مدير لهذه الكليه" });
                } else {
                    const Data = {
                        email: FEmail,
                        mname: "موظف كليه",
                        password: "12345678Abc",
                        faculty_id: req.body.faculty_id
                    }
                    const sqlInsert = `INSERT INTO manager SET ?`;
                    const result = await query(sqlInsert, Data);
                    if (result.affectedRows > 0) {
                        return res.status(200).json({ message: "تم اضافه المدير بنجاح" });
                    }
                }
            } else {
                return res.status(400).json({ message: "لا يوجد كليه بهذا الرقم" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)


Admin.put('/updateFacultyManager',
    checkAdmin,
    body('email').notEmpty().withMessage('يجب ادخال البريد الالكتروني'),
    body('id').notEmpty().withMessage('يجب ادخال رقم المدير'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            if (!req.body.email.startsWith('Faculty_Of_') && !req.body.email.endsWith('@info.com')) {
                return res.status(400).json({ message: "البريد الالكتروني غير صحيح" });
            }
            const sqlSelect = `SELECT * FROM manager WHERE id = ?`;
            const value = [req.body.id];

            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const Data = {
                    email: req.body.email,
                    password: "12345678Abc",
                    mname: "موظف كليه",
                    faculty_id: req.body.faculty_id
                }
                const sqlUpdate = `UPDATE manager SET ? WHERE id = ?`;
                const value = [Data, req.body.id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم تعديل المدير بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            } else {
                return res.status(400).json({ message: "لا يوجد مدير بهذا الايميل" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

Admin.delete('/deleteFacultyManager/:id',
    checkAdmin,
    async (req, res) => {
        let error = [];
        try {
            const id = req.params.id;
            const sqlSelect = `SELECT * FROM manager WHERE id = ?`;
            const value = [id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlDelete = `DELETE FROM manager WHERE id = ?`;
                const value = [id];
                const result = await query(sqlDelete, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم حذف المدير بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            } else {
                return res.status(400).json({ message: "لا يوجد مدير بهذا الايميل" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)




export default Admin;