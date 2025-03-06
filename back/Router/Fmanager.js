import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import checkFmanager from "../MiddleWare/checkFManager.js";
import e from "express";

const Fmanager = express();
Fmanager.use(express.Router());


Fmanager.get('/getMyInfo',
    checkFmanager,
    async (req, res) => {
        try {
            const sqlSelect = "SELECT manager.mname, faculty.faculty_name_ar FROM manager INNER JOIN faculty ON manager.faculty_id = faculty.faculty_id WHERE manager.id = ?";
            const result = await query(sqlSelect, [req.id]);
            if (result.length > 0) {
                delete result[0].password;
                return res.status(200).json(result[0]);
            } else {
                return res.status(404).json({ message: "Not Found" });
            }
        } catch (err) {
            return res.status(500).json("Server Error");
        }
    }
);


Fmanager.get('/getReports',
 checkFmanager, 
 async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';
        const search_Sevice_id = req.query.service_id || '';
        const search_response_date = req.query.response_date || '';

        let condition = '';
        
        if (search) {
            condition += ` AND (users.name LIKE '%${search}%' OR users.national_id LIKE '%${search}%') `;
        }
        if (search_Sevice_id) {
            if (search_Sevice_id == 1 || search_Sevice_id == 2) {
                condition += ` AND submit.service_id = ${search_Sevice_id} `;
            }else{
                return res.status(200).json({ message: "خطأ في ادخال نوع الخدمة" });
            }
        }
        if (search_response_date) {
            const date = search_response_date.split('T')[0];
            condition += ` AND DATE(submit.response_date) = '${date}' `;
        }


        // const sqlSelect = `
        // SELECT submit.* , users.name ,users.national_id , services.service_name_ar 
        // FROM submit 
        // INNER JOIN users ON submit.user_id = users.id 
        // INNER JOIN services ON submit.service_id = services.id 
        // WHERE 
        // submit.status = 5 AND 
        // (submit.response_pdf IS NOT NULL AND submit.response_pdf != '') 
        // AND users.faculity_id = ? 
        // AND (submit.service_id = 1 OR submit.service_id = 2 )
        // ORDER BY submit.response_date DESC
        // LIMIT ? OFFSET ?`;

        const sqlSelect = `
        SELECT submit.* , users.name ,users.national_id , services.service_name_ar
        FROM submit
        INNER JOIN users ON submit.user_id = users.id
        INNER JOIN services ON submit.service_id = services.id
        WHERE
        submit.status = 5 AND
        (submit.response_pdf IS NOT NULL AND submit.response_pdf != '')
        AND users.faculity_id = ?
        AND (submit.service_id = 1 OR submit.service_id = 2 )
        ${condition}
        ORDER BY submit.response_date DESC
        LIMIT ? OFFSET ?`;


        const values = [req.faculty_id, limit, offset];
        const result = await query(sqlSelect, values);
        console.log("result", result);
        console.log("sqlSelect", sqlSelect);
        if (result.length > 0) {
            const sqlCount = `
            SELECT COUNT(*) AS count
            FROM submit
            INNER JOIN users ON submit.user_id = users.id
            INNER JOIN services ON submit.service_id = services.id
            WHERE
            submit.status = 5 AND
            (submit.response_pdf IS NOT NULL AND submit.response_pdf != '')
            AND users.faculity_id = ?
            AND (submit.service_id = 1 OR submit.service_id = 2 )
            ${condition}`;

            const count = await query(sqlCount, [req.faculty_id]);
            
            const total = count[0].count;
            const pages = Math.ceil(total / limit);
            return res.status(200).json({ result, total, pages });
        } else {
            return res.status(200).json({ message: "لا يوجد تقارير" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

export default Fmanager;