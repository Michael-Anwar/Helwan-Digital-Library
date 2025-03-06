import express, { response } from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import checkmanager from "../MiddleWare/checkManager.js";
import upload from "../MiddleWare/Uplodeimgs.js";
import fs from "fs";
import excelJs from "exceljs";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));



const manager = express();
manager.use(express.Router());


manager.get('/getMyInfo',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM manager WHERE id = ? ";
            const value = [req.id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                delete result[0].password;
                return res.status(200).json(result[0]);
            } else {
                return res.status(200).json({ message: "لا يوجد مدير" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

manager.get('/getallApplicantsWaiting',
    checkmanager,
    async (req, res) => {
        let error = [];
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        try {
            if (req.service_id !== 9) {
                const sqlSelect = `
                SELECT submit.* , users.name , services.service_name_ar  
                FROM submit 
                INNER JOIN users ON submit.user_id = users.id 
                INNER JOIN services ON submit.service_id = services.id 
                WHERE submit.status = 2 AND submit.service_id = ? 
                ORDER BY submit.manager_id IS NULL DESC, submit.submit_date ASC
                LIMIT ? OFFSET ? `;

                // const sqlSelect = "SELECT submit.* , users.name , services.service_name_ar , manager.mname FROM submit INNER JOIN users ON submit.user_id = users.id INNER JOIN services ON submit.service_id = services.id INNER JOIN manager ON submit.manager_id = manager.id WHERE submit.status = 2 AND submit.service_id = ? ";
                const value = [req.service_id, limit, offset];
                const result = await query(sqlSelect, value);
                if (result.length > 0) {
                    const sqlCount = `
                    SELECT COUNT(*) as count
                    FROM submit
                    WHERE status = 2 AND service_id = ?`;
                    const resultCount = await query(sqlCount, [req.service_id]);
                    const total = resultCount[0].count;
                    const totalPages = Math.ceil(total / limit);
                    return res.status(200).json({ result, pages: totalPages, total });
                } else {
                    return res.status(200).json({ message: "لا يوجد طلبات" });
                }
            } else if (req.service_id === 9) {
                const sqlSelect = `
                SELECT submit.* , users.name , services.service_name_ar 
                FROM submit INNER JOIN users ON submit.user_id = users.id 
                INNER JOIN services ON submit.service_id = services.id 
                WHERE submit.status = 0
                LIMIT ? OFFSET ?`;
                ;
                const value = [limit, offset];
                const result = await query(sqlSelect, value);
                if (result.length > 0) {
                    const sqlCount = `
                    SELECT COUNT(*) as count
                    FROM submit
                    WHERE status = 0`;
                    const resultCount = await query(sqlCount);
                    const total = resultCount[0].count;
                    const totalPages = Math.ceil(total / limit);
                    return res.status(200).json({ result, pages: totalPages, total });

                } else {
                    return res.status(200).json({ message: "لا يوجد طلبات" });
                }
            }

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

manager.get('/getAllManagers',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM manager ";
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
manager.get('/getAllManagersToAssign',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM manager WHERE faculty_id IS NULL";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result.filter(manager => manager.faculty_id === null && manager.service_id !== 9));
            } else {
                return res.status(200).json({ message: "لا يوجد مديرين" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

manager.put('/AssignManager',
    checkmanager,
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


            for (const obj of req.body) {
                const { student_id, managerid, service_id, aplecationId, role, ser_name } = obj;
                const sqlUpdate = `UPDATE submit SET role = ? , manager_id = ? , manager_responsible = ? ,distribution_date = ?  WHERE user_id = ? AND service_id = ? AND ${obj.ser_name} = ? `;
                const value = [role, managerid, req.id, new Date(), student_id, service_id, aplecationId];
                await query(sqlUpdate, value);
            }
            return res.status(200).json({ message: "تم تعين المدير بنجاح" });

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

manager.get('/getallApplicantsAssigned',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const status = req.query.status !== undefined || req.query.status !== '' ? parseInt(req.query.status) : null;

            let sqlSelectCondition = status ? `AND submit.status = ${status}` : '';


            if (req.service_id !== 9) {
                const sqlSelect = `
                SELECT submit.* , users.name , services.service_name_ar  
                FROM submit INNER JOIN users ON submit.user_id = users.id 
                INNER JOIN services ON submit.service_id = services.id 
                WHERE submit.manager_id = ?  AND submit.manager_status IS NULL AND submit.status != 5 ${sqlSelectCondition}
                ORDER BY submit.status ASC ,submit.submit_date ASC , submit.distribution_date ASC
                LIMIT ? OFFSET ?`;
                const value = [req.id, limit, offset];
                const result = await query(sqlSelect, value);
                if (result.length > 0) {
                    const sqlCount = `
                    SELECT COUNT(*) as count
                    FROM submit
                    WHERE manager_id = ? AND manager_status IS NULL AND status != 5 ${sqlSelectCondition}`;
                    const resultCount = await query(sqlCount, [req.id]);
                    const total = resultCount[0].count;
                    const totalPages = Math.ceil(total / limit);
                    return res.status(200).json({ result, pages: totalPages, total });

                } else {
                    return res.status(200).json({ message: "لا يوجد طلبات" });
                }
            } else if (req.service_id === 9) {
                const sqlSelectCondition2 = status || status == 0 ? `WHERE submit.status = ${status}` : 'WHERE submit.status = 0 OR submit.status = 4';
                const sqlSelect = `
                SELECT submit.* , users.name , services.service_name_ar 
                FROM submit INNER JOIN users ON submit.user_id = users.id 
                INNER JOIN services ON submit.service_id = services.id 
                ${sqlSelectCondition2}
                ORDER BY submit.status ASC ,submit.req_code_date ASC
                LIMIT ? OFFSET ?`;
                const value = [limit, offset];
                const result = await query(sqlSelect, value);
                if (result.length > 0) {
                    const sqlCount = `
                    SELECT COUNT(*) as count
                    FROM submit
                    ${sqlSelectCondition2}`;
                    const resultCount = await query(sqlCount);
                    const total = resultCount[0].count;
                    const totalPages = Math.ceil(total / limit);
                    return res.status(200).json({ result, pages: totalPages, total });
                } else {
                    return res.status(200).json({ message: "لا يوجد طلبات" });
                }
            }
        }
        catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)
manager.get('/getallApplicantsAssignedDone',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;


            const sqlSelect = `
            SELECT submit.* , users.name , services.service_name_ar  
            FROM submit INNER JOIN users ON submit.user_id = users.id 
            INNER JOIN services ON submit.service_id = services.id 
            WHERE submit.manager_id = ?  AND (submit.status = 5 OR submit.status = 6)
            ORDER BY submit.status ASC ,submit.submit_date ASC , submit.distribution_date ASC
            LIMIT ? OFFSET ?`;
            const value = [req.id, limit, offset];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlCount = `
                SELECT COUNT(*) as count
                FROM submit
                WHERE manager_id = ? AND (status = 5 OR status = 6)`;
                const resultCount = await query(sqlCount, [req.id]);
                const total = resultCount[0].count;
                const totalPages = Math.ceil(total / limit);
                return res.status(200).json({ result, pages: totalPages, total });

            } else {
                return res.status(200).json({ message: "لا يوجد طلبات" });
            }

        }
        catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)
manager.get('/getallApplicantsReviewed',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;


            if (req.service_id !== 9) {
                const sqlSelect = `
                SELECT submit.* , users.name , services.service_name_ar  
                FROM submit INNER JOIN users ON submit.user_id = users.id 
                INNER JOIN services ON submit.service_id = services.id 
                WHERE  submit.service_id  = ? AND submit.manager_status IS NOT NULL AND (submit.status != 5 AND submit.status != 6)
                ORDER BY submit.status ASC ,submit.submit_date ASC , submit.distribution_date ASC
                LIMIT ? OFFSET ?`;
                const value = [req.service_id, limit, offset];
                // const sqlSelect = "SELECT submit.* , users.name , services.service_name_ar  FROM submit INNER JOIN users ON submit.user_id = users.id INNER JOIN services ON submit.service_id = services.id WHERE  submit.service_id  = ? AND submit.manager_status IS NOT NULL "
                const result = await query(sqlSelect, value);
                if (result.length > 0) {
                    const sqlCount = `
                    SELECT COUNT(*) as count
                    FROM submit
                    WHERE service_id = ? AND manager_status IS NOT NULL`;
                    const resultCount = await query(sqlCount, [req.service_id]);
                    const total = resultCount[0].count;
                    const totalPages = Math.ceil(total / limit);
                    return res.status(200).json({ result, pages: totalPages, total });
                } else {
                    return res.status(200).json({ message: "لا يوجد طلبات" });
                }
            }
            // else if (req.service_id === 9) {
            //     const sqlSelect = "SELECT submit.* , users.name , services.service_name_ar FROM submit INNER JOIN users ON submit.user_id = users.id INNER JOIN services ON submit.service_id = services.id WHERE submit.status = 0";
            //     const result = await query(sqlSelect);
            //     if (result.length > 0) {
            //         return res.status(200).json(result);
            //     } else {
            //         return res.status(200).json({ message: "لا يوجد طلبات" });
            //     }
            // }
        }
        catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)


manager.put('/deleteManager',
    checkmanager,
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


            const sqlUpdate = `UPDATE submit SET manager_id = Null , role = Null , manager_responsible = Null , distribution_date = Null WHERE service_id = ? AND user_id = ? AND ${req.body.ser_name} = ?`;
            const value = [req.body.service_id, req.body.student_id, req.body.aplecationId];
            await query(sqlUpdate, value);
            return res.status(200).json({ message: "تم حذف المدير بنجاح" });

        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

manager.put('/acceptApplicant/:id',
    upload.single('response_pdf'),
    checkmanager,
    body('national_id').notEmpty().withMessage('يجب ادخال الرقم القومي'),
    async (req, res) => {
        let error = [];
        try {

            const sqlSelect = `SELECT * FROM submit WHERE ${req.body.ser_name} = ?`;
            const value = [req.body.app_id];
            const result = await query(sqlSelect, value);
            if (result[0].role === 1) {
                if (result.length > 0) {
                    const Data = {
                        response_text: req.body.response_text,
                        response_pdf: req.file ? req.file.filename : null,
                        manager_status: 1,
                        response_date: new Date()
                    }
                    const sqlUpdate = `UPDATE submit SET ? WHERE ${req.body.ser_name} = ? AND manager_id = ? AND service_id = ? AND user_id = ?`;
                    const value = [Data, req.body.app_id, req.id, req.body.ser_id, req.body.student_id];
                    const result = await query(sqlUpdate, value);
                    if (result.affectedRows > 0) {
                        return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
                    }
                }
                else {
                    return res.status(200).json({ message: "لا يوجد طلبات" });
                }
            } else if (result[0].role === 2) {
                if (result.length > 0) {
                    const Data = {
                        response_text: req.body.response_text,
                        response_pdf: req.file ? req.file.filename : null,
                        status: 5,
                        response_date: new Date()
                    }
                    const sqlUpdate = `UPDATE submit SET ? WHERE ${req.body.ser_name} = ? AND manager_id = ? AND service_id = ? AND user_id = ?`;
                    const value = [Data, req.body.app_id, req.id, req.body.ser_id, req.body.student_id];
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

manager.put('/acceptApplicantforManagerWithpdf/:id',
    upload.single('response_pdf'),
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            if (req.service_id !== 9) {
                if ((req.body.column === "status") && (+req.body.ser_id !== +req.service_id) && +req.body.role !== 2) {
                    return res.status(400).json({ message: "لا تملك صلاحية القيام بهذا الامر" });
                }
            }
            if (req.body.column === "status" && req.body.status == 5) {
                if (!req.file) {
                    return res.status(400).json({ message: "يجب ادخال الملف" });
                } else {
                    const sqlSelect = `SELECT * FROM submit WHERE ${req.body.ser_name} = ? AND service_id = ? AND user_id = ?`;
                    const value = [req.body.app_id, req.body.ser_id, req.body.student_id];
                    const result = await query(sqlSelect, value);
                    if (result.length > 0) {

                        const filePath = join(__dirname, `../public/imgs/${req.params.id}/${result[0].response_pdf}`);
                        try {
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                            }
                        } catch (errors) {
                            error.push(errors);
                            return res.status(500).json({ message: error });
                        }

                        const sqlUpdate = `UPDATE submit SET ${req.body.column} = ? , response_pdf = ? WHERE ${req.body.ser_name} = ? AND service_id = ? AND user_id = ?`;
                        const value2 = [req.body.status, req.file.filename, req.body.app_id, req.body.ser_id, req.body.student_id];
                        const result2 = await query(sqlUpdate, value2);
                        if (result2.affectedRows > 0) {
                            return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
                        }
                    }
                    else {
                        return res.status(200).json({ message: "لا يوجد طلبات" });
                    }
                }
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)


manager.put('/acceptApplicantforManager',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {

            if (req.service_id !== 9) {
                if ((req.body.column === "status") && (+req.body.ser_id !== +req.service_id) && +req.body.role !== 2) {
                    return res.status(400).json({ message: "لا تملك صلاحية القيام بهذا الامر" });
                }
            }
            let status = ''
            if (req.body.status === null || req.body.status == 3) { status = ', response_pdf = null'; }
            if ((req.body.status == null && req.body.column === "manager_status") && +req.body.ser_id !== +req.service_id) {
                return res.status(400).json({ message: "لا تملك صلاحية القيام بهذا الامر" });
            }

            if (req.body.status === 3 && req.body.column === "status") {
                let sqlSelectUser = `SELECT submit.* , users.national_id FROM submit INNER JOIN users ON submit.user_id = users.id WHERE submit.${req.body.ser_name} = ? AND submit.service_id = ? AND submit.user_id = ?`;
                let valueUser = [req.body.app_id, req.body.ser_id, req.body.student_id];
                let resultUser = await query(sqlSelectUser, valueUser);
                if (resultUser.length === 0) {
                    return res.status(400).json({ message: "لا يوجد طلبات" });
                }
                const filePath = join(__dirname, `../public/imgs/${resultUser[0].national_id}/response_text${req.body.app_id}.json`);
                let response_text_text = '';
                if (req.body.reason !== "") {
                    response_text_text = req.body.reason;
                }else{
                    response_text_text = resultUser[0].response_text;
                }
                try {
                    let data = fs.readFileSync(filePath, 'utf8');
                    let response_text = data ? JSON.parse(data) : {};
                    const newReasonKey = `reason${Object.keys(response_text).length + 1}`;
                    response_text[newReasonKey] = { detail: response_text_text, date: new Date().toISOString() };
                    response_text = JSON.stringify(response_text);
                    fs.writeFileSync(filePath, response_text);
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        try {
                            const response_text = {};
                            const newReasonKey = `reason${Object.keys(response_text).length + 1}`;
                            response_text[newReasonKey] = { detail: response_text_text, date: new Date().toISOString() };
                            const jsonData = JSON.stringify(response_text);
                            fs.writeFileSync(filePath, jsonData);
                        } catch (err) {
                            console.error('Error creating file:', err);
                        }
                    }
                }
            }

            if (req.body.reason === "") {
                const sqlUpdate = `UPDATE submit SET ${req.body.column} = ?  WHERE ${req.body.ser_name} = ? AND service_id = ? AND user_id = ?`;
                const value = [req.body.status, req.body.app_id, req.body.ser_id, req.body.student_id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
                }
            } else if (req.body.reason !== "") {



                let sqlUpdate = '';
                let value = [];

                if (req.body.response_date === '') {
                    sqlUpdate = `UPDATE submit SET ${req.body.column} = ? , response_text = ? ${status} WHERE ${req.body.ser_name} = ?`;
                    value = [req.body.status, req.body.reason, req.body.app_id];

                } else {
                    sqlUpdate = `UPDATE submit SET ${req.body.column} = ? , response_text = ? ${status} , response_date = ?  WHERE ${req.body.ser_name} = ?`;
                    value = [req.body.status, req.body.reason, new Date(), req.body.app_id];

                }
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
                } else {
                    return res.status(400).json({ message: " حدث خطأ ما" });
                }
            }
        } catch (errors) {
            console.log(errors);
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)

manager.put('/Sendpayment',
    checkmanager,
    upload.single('payment_pdf'),
    async (req, res) => {
        let error = [];
        try {
            const sqlUpdate = `UPDATE submit SET payment_code = ? , status = 1 WHERE ${req.body.ser_name} = ? `;
            const value = [req.body.payment_code, req.body.app_id];
            const result = await query(sqlUpdate, value);
            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "تم ارسال الكود بنجاح" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
)
// manager.get('/getallApplicants',
//     checkmanager,
//     async (req, res) => {
//         let error = [];
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = (page - 1) * limit;

//         // add search by name or national id and status and submit date from and to
//         const search = req.query?.search || '';
//         const status = req.query?.status || '';
//         const from = req.query?.from || '';
//         const to = req.query?.to || '';

//         const searchQuery = search ? `AND (users.name LIKE '%${search}%' OR users.national_id LIKE '%${search}%')` : '';
//         const statusQuery = status ? `AND submit.status = ${status}` : '';
//         const fromQuery = from ? `AND DATE(submit.submit_date) >= '${from}'` : '';
//         const toQuery = to ? `AND DATE(submit.submit_date) <= '${to}'` : '';


//         try {

//             if (req.service_id !== 9) {

//                 // count all applicants
//                 const sqlSelectCount = `
//                 SELECT COUNT(*) as count
//                 FROM submit INNER JOIN users ON submit.user_id = users.id
//                 WHERE submit.service_id = ? ${searchQuery} ${statusQuery} ${fromQuery} ${toQuery}
//                 `
//                 const valueCount = [req.service_id];
//                 const resultCount = await query(sqlSelectCount, valueCount);

//                 // get number of pages
//                 const pages = Math.ceil(resultCount[0].count / limit);

//                 const sqlSelect = `
//                 SELECT submit.* , users.* , services.service_name_ar  
//                 FROM submit INNER JOIN users ON submit.user_id = users.id 
//                 INNER JOIN services ON submit.service_id = services.id 
//                 WHERE submit.service_id = ?
//                 ${searchQuery} ${statusQuery} ${fromQuery} ${toQuery}
//                 LIMIT ? OFFSET ?`;
//                 const value = [req.service_id, limit, offset];
//                 const result = await query(sqlSelect, value);
//                 if (result.length > 0) {
//                     for (let i = 0; i < result.length; i++) {
//                         delete result[i].password;
//                     }
//                     console.log("total", resultCount[0].count);
//                     console.log("pages", pages);
//                     console.log("result length", result.length);
//                     return res.status(200).json({ result, pages, total: resultCount[0].count });
//                 } else {
//                     return res.status(200).json({ message: "لا يوجد طلبات" });
//                 }
//             } else if (req.service_id === 9) {
//                 const sqlSelect = `
//                 SELECT submit.* , users.name , users.national_id ,services.service_name_ar  
//                 FROM submit INNER JOIN users ON submit.user_id = users.id 
//                 INNER JOIN services ON submit.service_id = services.id
//                 LIMIT ? OFFSET ?`;
//                 // const sqlSelect = "SELECT submit.* , users.name , services.service_name_ar  FROM submit INNER JOIN users ON submit.user_id = users.id INNER JOIN services ON submit.service_id = services.id WHERE submit.status = 0 OR submit.status = 4 ";
//                 const value = [limit, offset];
//                 const result = await query(sqlSelect, value);
//                 if (result.length > 0) {
//                     return res.status(200).json(result);
//                 } else {
//                     return res.status(200).json({ message: "لا يوجد طلبات" });
//                 }
//             }
//         } catch (errors) {
//             error.push(errors);
//             return res.status(500).json({ message: error });
//         }
//     }
// )
manager.get('/getallApplicants', checkmanager, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit) || 10; // Number of applicants per page
        const offset = (page - 1) * limit; // Number of applicants to skip

        const { search = '', status = '', from = '', to = '' } = req.query;

        // Constructing query conditions
        const conditions = [];
        const values = [];

        if (req.service_id !== 9) {
            conditions.push('submit.service_id = ?');
            values.push(req.service_id);
        }
        if (req.service_id === 9) {
            conditions.push('submit.service_id != 8 AND submit.service_id != 7');
        }


        if (search) {
            conditions.push('(users.name LIKE ? OR users.national_id LIKE ?)');
            values.push(`%${search}%`, `%${search}%`);
        }

        if (status) {
            if (status === '1 OR status = 2 OR status = 3 OR status = 5') {
                conditions.push(`(submit.status = 1 OR submit.status = 2 OR submit.status = 3 OR submit.status = 5)`);
            } else {
                conditions.push('submit.status = ?');
                values.push(parseInt(status));
            }

        }

        if (from) {
            if (req.service_id === 9) {
                conditions.push('DATE(submit.req_code_date) >= ?');
            } else {
                conditions.push('DATE(submit.submit_date) >= ?');
            }
            values.push(from);
        }

        if (to) {
            if (req.service_id === 9) {
                conditions.push('DATE(submit.req_code_date) <= ?');
            } else {
                conditions.push('DATE(submit.submit_date) <= ?');
            }
            values.push(to);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Main query to fetch applicants for the current page
        const sql = `
            SELECT submit.*, users.*, services.service_name_ar  
            FROM submit 
            INNER JOIN users ON submit.user_id = users.id 
            INNER JOIN services ON submit.service_id = services.id 
            ${whereClause}
            LIMIT ? OFFSET ?`;

        values.push(limit, offset);

        const result = await query(sql, values);
        const total = result.length;

        if (total > 0) {
            // Query to get the total count of applicants that match the filters
            const sqlCount = `
                SELECT COUNT(*) as count
                FROM submit 
                INNER JOIN users ON submit.user_id = users.id
                INNER JOIN services ON submit.service_id = services.id
                ${whereClause}`;

            const resultCount = await query(sqlCount, values.slice(0, values.length - 2));

            const totalPages = Math.ceil(resultCount[0].count / limit); // Calculating total pages

            return res.status(200).json({ result, pages: totalPages, total: resultCount[0].count });
        } else {
            return res.status(200).json({ message: "لا يوجد طلبات" });
        }
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
});

manager.get('/getallApplicantsToShow',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const status = req.query.status !== undefined && req.query.status !== '' ? parseInt(req.query.status) : null;
            const service_id = req.query.service_id !== undefined && req.query.service_id !== '' ? parseInt(req.query.service_id) : null;
            const search = req.query.search || '';

            const conditions = [];
            const values = [];

            if (status !== null && status !== undefined) {
                conditions.push('submit.status = ?');
                values.push(status);
            }
            if (service_id !== null && service_id !== undefined) {
                conditions.push('submit.service_id = ?');
                values.push(service_id);
            }
            if (search !== '' && search !== null) {
                conditions.push('(users.name LIKE ? OR users.national_id LIKE ?)');
                values.push(`%${search}%`, `%${search}%`);
            }

            let sqlSelect = `
            SELECT submit.* , users.name ,users.national_id , services.service_name_ar  
            FROM submit INNER JOIN users ON submit.user_id = users.id 
            INNER JOIN services ON submit.service_id = services.id`;

            if (conditions.length > 0) {
                sqlSelect += ` WHERE ${conditions.join(' AND ')}`;
            }

            sqlSelect += ` LIMIT ? OFFSET ?`;
            values.push(limit, offset);

            const result = await query(sqlSelect, values);
            if (result.length > 0) {
                let sqlCount = `
                SELECT COUNT(*) as count
                FROM submit INNER JOIN users ON submit.user_id = users.id`;

                if (conditions.length > 0) {
                    sqlCount += ` WHERE ${conditions.join(' AND ')}`;
                }

                const resultCount = await query(sqlCount, values);
                const total = resultCount[0].count;
                const totalPages = Math.ceil(total / limit);
                return res.status(200).json({ result, pages: totalPages, total });
            } else {
                return res.status(200).json({ message: "لا يوجد طلبات" });
            }
        } catch (errors) {
            error.push(errors);
            console.log(errors);
            return res.status(500).json({ message: error });
        }
    }
)


manager.put('/watingApplicant/:id',
    checkmanager,
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
                const sqlUpdate = `UPDATE submit SET status = ? , response_text = null , response_pdf = null , manager_status = null,response_date = null  WHERE ${req.body.ser_name} = ?`;
                const value2 = [req.body.status, req.body.app_id];
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

manager.get('/getusermessages',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const response = req.query.response || '';
            let sqlSelectCondition = '';

            if (response === 'notNull') sqlSelectCondition = 'AND messages.response IS NOT NULL Order By messages.reson_date DESC';

            const sqlSelect = `
            SELECT messages.* , services.service_name_ar , users.name, manager.mname 
            FROM messages 
            INNER JOIN services ON messages.service_id = services.id 
            INNER JOIN users ON messages.user_id = users.id 
            INNER JOIN manager ON messages.manager_id = manager.id
            WHERE messages.service_id = ? AND messages.reson NOT LIKE '0' ${sqlSelectCondition}
            LIMIT ? OFFSET ?`;

            const value = [req.service_id, limit, offset];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlCount = `
                SELECT COUNT(*) as count
                FROM messages
                WHERE service_id = ? AND reson NOT LIKE '0' ${sqlSelectCondition}`;
                const resultCount = await query(sqlCount, [req.service_id]);

                const total = resultCount[0].count;
                const totalPages = Math.ceil(total / limit);

                return res.status(200).json({ result, pages: totalPages, total });
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
manager.get('/getusermessagesToShow',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            let sqlSelectCondition = '';
            const response = req.query.response || '';

            if (response === 'null') sqlSelectCondition = 'AND messages.response IS NULL Order By messages.reson_date ASC';

            const sqlSelect = `
            SELECT messages.* , services.service_name_ar , users.name 
            FROM messages INNER JOIN services ON messages.service_id = services.id 
            INNER JOIN users ON messages.user_id = users.id  
            WHERE messages.service_id = ? AND messages.reson NOT LIKE '0' ${sqlSelectCondition}
            LIMIT ? OFFSET ?`;

            const value = [req.service_id, limit, offset];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlCount = `
                SELECT COUNT(*) as count
                FROM messages
                WHERE service_id = ? AND reson NOT LIKE '0' ${sqlSelectCondition}`;
                const resultCount = await query(sqlCount, [req.service_id]);
                const total = resultCount[0].count;
                const totalPages = Math.ceil(total / limit);

                return res.status(200).json({ result, pages: totalPages, total });
            } else {
                error.push("لا يوجد رسائل");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            console.log(errors);
            return res.status(500).json({ message: error });
        }
    }
);

manager.put('/sendresponse',
    checkmanager,
    body('message_id').notEmpty().withMessage('يجب ادخال رقم الرسالة'),
    body('response').notEmpty().withMessage('يجب ادخال الرد'),
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM messages WHERE id = ? ";
            const value = [req.body.message_id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlUpdate = `UPDATE messages SET response = ? , manager_id = ? , response_date = ? WHERE id = ?`;
                const value = [req.body.response, req.id, new Date(), req.body.message_id];
                const result = await query(sqlUpdate, value);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم ارسال الرد بنجاح" });
                } else {
                    return res.status(400).json({ message: "حدث خطأ ما" });
                }
            }
            else {
                error.push("No messages found");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

manager.post('/deleteApplicant',
    checkmanager,
    body('student_info').notEmpty().withMessage('يجب ادخال بيانات الطالب'),
    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                handleDeleteFile2(req);
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }
            const service_id = req.body.student_info.service_id;

            let serviceTable = '';
            let serviceTableId = '';
            if (service_id == 1) {
                serviceTable = 'registration_services';
                serviceTableId = 'ser_reg';
            } else if (service_id == 2) {
                serviceTable = 'formation_service';
                serviceTableId = 'ser_formation';
            } else if (service_id == 3) {
                serviceTable = 'personal_examination_service';
                serviceTableId = 'ser_personal';
            } else if (service_id == 4) {
                serviceTable = 'magazine_checking_service';
                serviceTableId = 'ser_magazine';
            } else if (service_id == 5) {
                serviceTable = 'upgrade_service';
                serviceTableId = 'ser_upgrade';
            } else if (service_id == 6) {
                serviceTable = 'best_message_service';
                serviceTableId = 'ser_best';
            } else if (service_id == 7) {
                serviceTable = 'grant_service';
                serviceTableId = 'ser_grant';
            } else if (service_id == 8) {
                serviceTable = 'knowledge_bank_service';
                serviceTableId = 'ser_knowledge';
            }
            const sqlSelect = `SELECT * FROM submit WHERE ${serviceTableId} = ? AND service_id = ? AND user_id = ? `;
            const value = [req.body.student_info[serviceTableId], req.body.student_info.service_id, req.body.student_info.user_id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlSelect1 = `SELECT * FROM ${serviceTable} WHERE id = ? `;
                const value1 = [req.body.student_info[serviceTableId]];
                const result1 = await query(sqlSelect1, value1);
                if (result1.length > 0) {
                    if (service_id !== 3 && service_id !== 7 && service_id !== 8) {
                        try {
                            const filePath = join(__dirname, `../public/imgs/${req.body.student_info.national_id}/${result1[0].photo_college_letter}`);
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                            }
                        } catch (errors) {
                            error.push(errors);
                            return res.status(500).json({ message: error });
                        }
                    } else if (service_id == 7) {
                        const filePath1 = join(__dirname, `../public/imgs/${req.body.student_info.national_id}/${result1[0].decision}`);
                        const filePath2 = join(__dirname, `../public/imgs/${req.body.student_info.national_id}/${result1[0].message_word_ar}`);
                        const filePath3 = join(__dirname, `../public/imgs/${req.body.student_info.national_id}/${result1[0].message_pdf_ar}`);
                        try {
                            if (fs.existsSync(filePath1)) {
                                fs.unlinkSync(filePath1);
                            }
                            if (fs.existsSync(filePath2)) {
                                fs.unlinkSync(filePath2);
                            }
                            if (fs.existsSync(filePath3)) {
                                fs.unlinkSync(filePath3);
                            }
                        } catch (errors) {
                            error.push(errors);
                            return res.status(500).json({ message: error });
                        }
                    }

                    // if (service_id == 1) {
                    //     try {
                    //         const filePath = join(__dirname, `../public/imgs/${req.body.student_info.national_id}/${result1[0].photo}`);
                    //         if (fs.existsSync(filePath)) {
                    //             fs.unlinkSync(filePath);
                    //         }


                    const sqlDelete = `DELETE FROM ${serviceTable} WHERE id = ?`;
                    const value = [req.body.student_info[serviceTableId]];
                    const result = await query(sqlDelete, value);
                    if (result.affectedRows > 0) {
                        return res.status(200).json({ message: "تم حذف الطالب بنجاح" });
                    } else {
                        return res.status(400).json({ message: "حدث خطأ ما" });
                    }
                } else {
                    return res.status(400).json({ message: "لا يوجد طالب بهذه البيانات" });
                }
            } else {
                return res.status(400).json({ message: "لا يوجد طلبات" });
            }






        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);

manager.get('/getAllUsers',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT * FROM users ";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(200).json({ message: "لا يوجد مستخدمين" });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);
manager.post('/sendMsg',
    checkmanager,
    body('message').notEmpty().withMessage('يجب ادخال الرسالة'),
    body('user_id').notEmpty().withMessage('يجب ادخال الرقم القومي'),
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
            const sqlSelect = "SELECT * FROM users WHERE id = ? ";
            const value = [req.body.user_id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const Data = {
                    user_id: req.body.user_id,
                    service_id: req.service_id,
                    message: req.body.message,
                    manager_id: req.id,
                    reson_date: new Date()
                }
                const sqlInsert = "INSERT INTO messages SET ?";
                const result = await query(sqlInsert, Data);
                if (result.affectedRows > 0) {
                    return res.status(200).json({ message: "تم ارسال الرسالة بنجاح" });
                } else {
                    return res.status(400).json({ message: "حدث خطأ ما" });
                }
            }
            else {
                error.push("No messages found");
                return res.status(400).json({ message: error });
            }
        } catch (errors) {
            error.push(errors);
            return res.status(500).json({ message: error });
        }
    }
);
manager.get('/getallMessagesForManager',
    checkmanager,
    async (req, res) => {
        let error = [];
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const response = req.query.response || '';

            const sqlSelect = `
            SELECT messages.* , services.service_name_ar , users.name , manager.mname 
            FROM messages INNER JOIN services ON messages.service_id = services.id 
            INNER JOIN users ON messages.user_id = users.id INNER JOIN manager ON messages.manager_id = manager.id 
            WHERE messages.service_id = ? AND messages.reson = 0 
            LIMIT ? OFFSET ?`;

            const value = [req.service_id, limit, offset];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                const sqlCount = `
                SELECT COUNT(*) as count
                FROM messages
                WHERE service_id = ? AND reson = 0`;
                const resultCount = await query(sqlCount, [req.service_id]);
                const total = resultCount[0].count;
                const totalPages = Math.ceil(total / limit);
                return res.status(200).json({ result, pages: totalPages, total });
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
manager.get('/getOneService/:id',
    async (req, res) => {
        let error = [];
        try {
            const sqlSelect = "SELECT payment_note ,payment_note_ar, service_name_ar , service_name FROM services WHERE id = ? ";
            const value = [req.params.id];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                return res.status(200).json(result[0]);
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

manager.get('/getAnalysis',
    checkmanager,
    // body('start_date').notEmpty().withMessage('يجب ادخال تاريخ البداية'),
    // body('end_date').notEmpty().withMessage('يجب ادخال تاريخ النهاية'),
    async (req, res) => {
        let error = [];
        try {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     errors.array().forEach(element => {
            //         error.push(element.msg);
            //     });
            //     return res.status(400).json({ message: error });
            // }
            if (req.query.start_date == '' || req.query.end_date == '') {
                return res.status(400).json({ message: "يجب ادخال تاريخ البداية و النهاية" });
            }
            const start_date = req.query.start_date.split('T')[0];
            const end_date = req.query.end_date.split('T')[0];

            let columnNum = '';
            let tableName = '';
            if (req.service_id == 1) {
                columnNum = 'ser_reg';
                tableName = 'registration_services';
            } else if (req.service_id == 2) {
                columnNum = 'ser_formation';
                tableName = 'formation_service';
            } else if (req.service_id == 7) {
                columnNum = 'ser_grant';
                tableName = 'grant_service';
            } else if (req.service_id == 8) {
                columnNum = 'ser_knowledge';
                tableName = 'knowledge_bank_service';
            }

            let sqlSelect = "SELECT submit.*, users.name, users.faculity_id, users.department, users.nationality, users.university, users.faculity, " +
                "services.service_name_ar "

            if (req.service_id !== 9) {
                sqlSelect += ",manager.mname ";
            }

            if (tableName !== '') {
                sqlSelect += `, ${tableName}.level `;
            }

            sqlSelect += "FROM submit " +
                "INNER JOIN users ON submit.user_id = users.id " +
                "INNER JOIN services ON submit.service_id = services.id "

            if (req.service_id !== 9) {
                sqlSelect += "INNER JOIN manager ON submit.manager_id = manager.id ";
            }

            if (tableName !== '' && columnNum !== '') {
                sqlSelect += `INNER JOIN ${tableName} ON submit.${columnNum} = ${tableName}.id `;
            }

            if (req.service_id != 9) {
                sqlSelect += `WHERE submit.service_id = ${req.service_id} AND submit.status = ${req.query.status} AND  DATE(submit.submit_date) BETWEEN ? AND ?`;
            } else {
                sqlSelect += "WHERE (submit.service_id != 7 AND submit.service_id != 8) AND submit.status < 6 AND DATE(submit.req_code_date) BETWEEN ? AND ?";
            }
            const value = [start_date, end_date];
            const result = await query(sqlSelect, value);
            if (result.length > 0) {
                let workBook = new excelJs.Workbook();
                let workSheet;
                try {
                    workSheet = workBook.addWorksheet(`من ${start_date} الى ${end_date}`);
                } catch (error) {
                    console.error('Error creating worksheet:', error);
                    return res.status(500).send('Internal Server Error');
                }

                const columns = [
                    { header: 'التسلسل', key: 'id', width: 10 },
                    { header: 'اسم الباحث', key: 'name', width: 30 },
                    { header: 'الجنسيه', key: 'nationality', width: 30 },
                    { header: 'تاريخ التقديم', key: 'submit_date', width: 30 },
                    { header: 'الحالة', key: 'status', width: 30 },
                    { header: 'تاريخ الرد', key: 'response_date', width: 30 },
                    { header: 'الملاحظات', key: 'response_text', width: 30 },
                    { header: 'الافادة / التقرير', key: 'response_pdf', width: 30 },
                    { header: 'الجامعة', key: 'university', width: 30 },
                    { header: 'الكلية', key: 'faculity', width: 30 },
                    { header: 'القسم', key: 'department', width: 30 },
                ];

                // add requset code column after submit date
                if (req.service_id != 7 && req.service_id != 8) {
                    columns.splice(3, 0, { header: 'تاريخ طلب الكود', key: 'req_code_date', width: 30 });
                }

                if (tableName !== '') {
                    columns.push({ header: 'المستوى', key: 'level', width: 30 });
                }
                if (req.service_id !== 9) {
                    columns.push({ header: 'المدير المسئول', key: 'mname', width: 30 });
                }
                if (req.service_id == 9) {
                    columns.splice(3, 0, { header: 'الخدمة المقدم لها', key: 'service_name_ar', width: 50 });
                }

                workSheet.columns = columns;

                result.map((item, index) => {
                    let status = '';
                    let response_text = '';
                    let response_pdf = '';
                    let response_date = '';
                    let submit_date = '';
                    let university = '';
                    let faculity = '';
                    let level = '';

                    if (item.level == 1) {
                        level = 'دكتوراه';
                    } else {
                        level = 'ماجستير';
                    }
                    if (item.university == 1) {
                        university = 'جامعة حلوان';
                    } else {
                        university = item.university;
                    }
                    if (item.faculity != null && item.faculity != '' && item.university != 1) {
                        faculity = item.faculity;
                    } else if (item.faculity_id != null && item.university == 1) {
                        if (item.faculity_id == 4) {
                            faculity = 'الاداب';
                        } else if (item.faculity_id == 5) {
                            faculity = 'الاقتصاد المنزلي';
                        } else if (item.faculity_id == 6) {
                            faculity = 'تجارة و ادارة اعمال';
                        } else if (item.faculity_id == 7) {
                            faculity = 'التربية';
                        } else if (item.faculity_id == 8) {
                            faculity = 'تربية رياضية بنات';
                        } else if (item.faculity_id == 9) {
                            faculity = 'تربية رياضية بنين';
                        } else if (item.faculity_id == 10) {
                            faculity = 'تربية فنية';
                        } else if (item.faculity_id == 11) {
                            faculity = 'تربية موسيقية';
                        } else if (item.faculity_id == 12) {
                            faculity = 'تمريض';
                        } else if (item.faculity_id == 13) {
                            faculity = 'معهد تمريض';
                        } else if (item.faculity_id == 14) {
                            faculity = 'طب بشري';
                        } else if (item.faculity_id == 15) {
                            faculity = 'حاسبات و ذكاء اصطناعي';
                        } else if (item.faculity_id == 16) {
                            faculity = 'حقوق';
                        } else if (item.faculity_id == 17) {
                            faculity = 'خدمة اجتماعية';
                        } else if (item.faculity_id == 18) {
                            faculity = 'سياحة و فنادق';
                        } else if (item.faculity_id == 19) {
                            faculity = 'صيدلة';
                        } else if (item.faculity_id == 20) {
                            faculity = 'علوم';
                        } else if (item.faculity_id == 21) {
                            faculity = 'فنون تطبيقية';
                        } else if (item.faculity_id == 22) {
                            faculity = 'الكلية العسكرية لعلوم الادارة';
                        } else if (item.faculity_id == 23) {
                            faculity = 'هندسة حلوان';
                        } else if (item.faculity_id == 24) {
                            faculity = 'فنون جميلة';
                        } else if (item.faculity_id == 25) {
                            faculity = 'تكنولوجيا التعليم';
                        } else if (item.faculity_id == 26) {
                            faculity = 'هندسة المطرية';
                        } else if (item.faculity_id == 27) {
                            faculity = 'الدراسات العليا و البحوث البينية';
                        } else if (item.faculity_id == 28) {
                            faculity = 'المعهد القومي للملكية الفكرية';
                        }
                    }
                    if (item.status == 1) {
                        status = 'حصل على كود الدفع وفي انتظار اسكمال الخدمة';
                    } else if (item.status == 2) {
                        if (req.service_id != 9) {
                            status = 'في انتظار الرد من المكتبه';
                        } else {
                            status = 'حصل على كود الدفع ';
                        }
                    } else if (item.status == 3) {
                        if (req.service_id != 9) {
                            status = 'قيد التعديل ';
                        } else {
                            status = 'حصل على كود الدفع ';
                        }
                    } else if (item.status == 4) {
                        status = 'قيد التعديل علي مرفق كود الدفع';
                    } else if (item.status == 5) {
                        if (req.service_id != 9) {
                            status = 'تم ارسال افادة / تقرير';
                        } else {
                            status = 'حصل على كود الدفع ';
                        }
                    } else if (item.status == 6) {
                        if (item.payment_code == null) {
                            status = 'تم رفض الطلب و لم يحصل على كود الدفع';
                        } else if (req.service_id != 9) {
                            status = 'تم رفض الطلب بعد الحصول على كود الدفع';
                        } else if (req.service_id == 9) {
                            status = 'حصل على كود الدفع ';
                        }
                    } else if (item.status == 0) {
                        status = 'في انتظار كود الدفع';
                    }
                    if ((item.response_text != null || item.response_text != '') && (item.status == 5 || item.status == 6 || item.status == 3 || item.status == 4)) {
                        response_text = item.response_text;
                    } else {
                        response_text = 'لم يتم الرد بعد';
                    }
                    if ((item.response_pdf != null || item.response_pdf != '') && item.status == 5) {
                        response_pdf = 'تم ارسال افادة / تقرير';
                    } else {
                        response_pdf = 'لم يتم ارسال افادة / تقرير';
                    }
                    if (item.response_date == null || item.response_date == '') {
                        response_date = 'لم يتم الرد بعد';
                    } else {
                        response_date = item.response_date;
                    }
                    if (item.submit_date == null) {
                        submit_date = 'لم يحصل على كود الدفع بعد';
                    } else {
                        submit_date = item.submit_date;
                    }
                    const rowObject = {
                        id: index + 1,
                        name: item.name,
                        nationality: item.nationality,
                        submit_date: submit_date,
                        status: status,
                        mname: item.mname,
                        response_date: response_date,
                        response_text: response_text,
                        response_pdf: response_pdf,
                        university: university,
                        faculity: faculity,
                        department: item.department,
                    };

                    if (tableName !== '') {
                        rowObject.level = level;
                    }
                    if (req.service_id == 9) {
                        rowObject.service_name_ar = item.service_name_ar;
                    }
                    if (req.service_id != 7 && req.service_id != 8) {
                        rowObject.req_code_date = item.req_code_date;
                    }


                    workSheet.addRow(rowObject);

                }
                );
                // style text in center
                workBook.eachSheet((worksheet, sheetId) => {
                    worksheet.eachRow((row, rowNumber) => {
                        row.eachCell((cell, colNumber) => {
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };
                            cell.font = { name: 'Times New Roman', size: 12 };
                        });
                    });
                });




                workSheet.getRow(1).font = { bold: true, size: 16 };
                workSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
                workSheet.getRow(1).height = 30;
                workSheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFA0A0A0' }
                };
                workSheet.getRow(1).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                workSheet.getRow(1).eachCell((cell) => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });
                workSheet.getRow(1).eachCell((cell) => {
                    cell.font = { bold: true };
                });
                workSheet.getRow(1).eachCell((cell) => {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
                workSheet.getRow(1).eachCell((cell) => {
                    cell.height = 30;
                });
                workSheet.getRow(1).eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFA0A0A0' }
                    };
                });

                // // make dir in public folder
                // const dir = `../public/احصائية خدمة_${result[0].service_name_ar}`;
                // if (!fs.existsSync(dir)) {
                //     fs.mkdirSync(dir);
                // }
                // // save file 
                // const filePath = `../public/احصائية خدمة_${result[0].service_name_ar}/احصائية خدمة_${result[0].service_name_ar}_من_${start_date}_الى_${end_date}.xlsx`;
                // await workBook.xlsx.writeFile(filePath);

                // // download file
                // res.download(filePath, `احصائية خدمة_${result[0].service_name_ar}_من_${start_date}_الى_${end_date}.xlsx`, (err) => {
                //     if (err) {
                //         error.push(err);
                //         return res.status(500).json({ message: error });
                //     } else {
                //         fs.unlinkSync(filePath);
                //     }
                // });


                // download file
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                // Assuming `service_name`, `start_date`, and `end_date` are defined
                let service_name = result[0].service_name_ar.replace(/\s/g, "_");
                const filename = `احصائية خدمة_${service_name}_من_${start_date}_الى_${end_date}.xlsx`;


                // Set Content-Disposition header with the encoded filename
                res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`);

                // Write the Excel content to the response
                await workBook.xlsx.write(res);

                // End the response
                res.end();










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





export default manager;