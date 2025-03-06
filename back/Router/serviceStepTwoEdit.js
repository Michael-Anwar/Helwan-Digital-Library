// import express from "express";
// import query from '../Database/DBConnection.js';
// import { body, validationResult } from "express-validator";
// import e from "express";
// import checkUser from "../MiddleWare/checkUser.js";
// import upload from "../MiddleWare/Uplodeimgs.js";
// import fs from "fs";

// const serviceStepTwoEdit = express();
// serviceStepTwoEdit.use(express.Router());


// const handleDeleteFile = (req) => {
//     const payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : null;
//     const photo_college_letter = req.files.photo_college_letter ? req.files.photo_college_letter[0].filename : null;
//     const research = req.files.research ? req.files.research[0].filename : null;
//     const research_en = req.files.research_en ? req.files.research_en[0].filename : null;
//     const research_word = req.files.research_word ? req.files.research_word[0].filename : null;
//     const research_word_en = req.files.research_word_en ? req.files.research_word_en[0].filename : null;
//     const translation = req.files.translation ? req.files.translation[0].filename : null;

//     const path = `../public/imgs/${req.national_id}/${payment_photo}`;
//     const path2 = `../public/imgs/${req.national_id}/${photo_college_letter}`;
//     const path3 = `../public/imgs/${req.national_id}/${research}`;
//     const path4 = `../public/imgs/${req.national_id}/${research_en}`;
//     const path5 = `../public/imgs/${req.national_id}/${research_word}`;
//     const path6 = `../public/imgs/${req.national_id}/${research_word_en}`;
//     const path7 = `../public/imgs/${req.national_id}/${translation}`;

//     for (let i = 0; i < 7; i++) {
//         if (payment_photo != null && i == 0) {
//             fs.unlinkSync(path, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (photo_college_letter != null && i == 1) {
//             fs.unlinkSync(path2, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (research != null && i == 2) {
//             fs.unlinkSync(path3, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (research_en != null && i == 3) {
//             fs.unlinkSync(path4, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (research_word != null && i == 4) {
//             fs.unlinkSync(path5, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (research_word_en != null && i == 5) {
//             fs.unlinkSync(path6, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (translation != null && i == 6) {
//             fs.unlinkSync(path7, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         }
//     }
// }
// const handleDeleteFile2 = (req) => {
//     const payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : null;
//     const research = req.files.research ? req.files.research[0].filename : null;
//     const research_word = req.files.research_word ? req.files.research_word[0].filename : null;
//     const form = req.files.form ? req.files.form[0].filename : null;

//     const path = `../public/imgs/${req.national_id}/${payment_photo}`;
//     const path3 = `../public/imgs/${req.national_id}/${research}`;
//     const path5 = `../public/imgs/${req.national_id}/${research_word}`;
//     const path7 = `../public/imgs/${req.national_id}/${form}`;

//     for (let i = 0; i < 7; i++) {
//         if (payment_photo != null && i == 0) {
//             fs.unlinkSync(path, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (research != null && i == 2) {
//             fs.unlinkSync(path3, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (research_word != null && i == 4) {
//             fs.unlinkSync(path5, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (form != null && i == 6) {
//             fs.unlinkSync(path7, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         }
//     }
// }
// const handleDeleteFile7 = (req) => {
//     const decision = req.files.decision ? req.files.decision[0].filename : null;
//     const pdf = req.files.pdf ? req.files.pdf[0].filename : null;
//     const word = req.files.word ? req.files.word[0].filename : null;

//     const path = `../public/imgs/${req.national_id}/${decision}`;
//     const path2 = `../public/imgs/${req.national_id}/${pdf}`;
//     const path3 = `../public/imgs/${req.national_id}/${word}`;

//     for (let i = 0; i < 4; i++) {
//         if (decision != null && i == 0) {
//             fs.unlinkSync(path, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (pdf != null && i == 1) {
//             fs.unlinkSync(path2, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         } else if (word != null && i == 2) {
//             fs.unlinkSync(path3, (err) => {
//                 if (err) {
//                     console.error(err)
//                     return
//                 }
//             })
//         }

//     }
// }



// // serviceStepTwoEdit.put("/StepTwoRegEdit/:id/:id2",
// //     checkUser,
// //     upload.fields(
// //         [{ name: "payment_photo", maxCount: 1 },
// //         { name: "photo_college_letter", maxCount: 1 },





// serviceStepTwoEdit.put("/StepTwoSer2/:id/:id2",
//     checkUser,
//     upload.fields(
//         [{ name: "payment_photo", maxCount: 1 },
//         { name: "research", maxCount: 1 },
//         { name: "research_word", maxCount: 1 },
//         { name: "form", maxCount: 1 },
//         ]),

//     async (req, res) => {
//         let error = [];
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 handleDeleteFile2(req);
//                 errors.array().forEach(element => {
//                     error.push(element.msg);
//                 });
//                 return res.status(400).json({ message: error });
//             }

//             const id = req.params.id;
//             const id2 = req.params.id2;

//             (req.files);
//             if (!req.files.payment_photo) {
//                 handleDeleteFile2(req);
//                 error.push("Please upload payment_photo");
//                 return res.status(400).json({ message: error });
//             } else {
//                 (1);
//                 const ext = req.files.payment_photo[0].filename.split(".").pop();
//                 (2);
//                 if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
//                     handleDeleteFile2(req);
//                     error.push("Please upload image or pdf or word");
//                     return res.status(400).json({ message: error });
//                 }
//             }

//             if (!req.files.research) {
//                 handleDeleteFile2(req);
//                 error.push("Please upload research");
//                 return res.status(400).json({ message: error });
//             } else {
//                 const ext = req.files.research[0].filename.split(".").pop();
//                 if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
//                     handleDeleteFile2(req);
//                     error.push("Please upload image or pdf or word");
//                     return res.status(400).json({ message: error });
//                 }
//             }

//             if (!req.files.research_word) {
//                 handleDeleteFile2(req);
//                 error.push("Please upload research_word");
//                 return res.status(400).json({ message: error });
//             } else {
//                 const ext = req.files.research_word[0].filename.split(".").pop();
//                 if (ext !== "docx" && ext !== "doc") {
//                     handleDeleteFile2(req);
//                     error.push("Please upload word file");
//                     return res.status(400).json({ message: error });
//                 }
//             }

//             if (!req.files.form) {
//                 handleDeleteFile2(req);
//                 error.push("Please upload form");
//                 return res.status(400).json({ message: error });
//             } else {
//                 const ext = req.files.form[0].filename.split(".").pop();
//                 if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
//                     handleDeleteFile2(req);
//                     error.push("Please upload image or pdf or word");
//                     return res.status(400).json({ message: error });
//                 }
//             }




//             const data = {
//                 photo_payment_receipt: req.files.payment_photo[0].filename,
//                 message_word_ar: req.files.research_word[0].filename,
//                 message_pdf_ar: req.files.research[0].filename,
//                 quote_check_form: req.files.form[0].filename,
//             }


//             const sql = `UPDATE formation_service SET ? WHERE id = ? `;
//             const value = [data, id2];
//             const result = await query(sql, value);
//             if (result.affectedRows > 0) {
//                 const submit = {
//                     status: 2,
//                     submit_date: new Date(),
//                 }
//                 const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_formation = ? AND user_id = ?';
//                 const value2 = [submit, id, id2, req.id];
//                 const result2 = await query(sql2, value2);
//                 if (result2.affectedRows > 0) {
//                     return res.status(200).json({ message: "Data saved successfully" });
//                 } else {
//                     handleDeleteFile2(req);
//                     error.push("Data not saved");
//                     return res.status(400).json({ message: error });
//                 }
//             } else {
//                 handleDeleteFile2(req);
//                 error.push("Data not saved");
//                 return res.status(400).json({ message: error });
//             }

//         } catch (error) {
//             handleDeleteFile2(req);
//             return res.status(500).json({ message: error.message });
//         }
//     }
// );






// serviceStepTwoEdit.post("/StepTwoSer7",
//     checkUser,
//     upload.fields(
//         [{ name: "word", maxCount: 1 },
//         { name: "pdf", maxCount: 1 },
//         { name: "decision", maxCount: 1 },
//         ]),
//     body("level").notEmpty().withMessage("Please enter level"),

//     async (req, res) => {
//         let error = [];
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 handleDeleteFile7(req);
//                 errors.array().forEach(element => {
//                     error.push(element.msg);
//                 });
//                 return res.status(400).json({ message: error });
//             }



//             if (!req.files.decision) {
//                 handleDeleteFile7(req);
//                 error.push("Please upload decision");
//                 return res.status(400).json({ message: error });
//             } else {
//                 (1);
//                 const ext = req.files.decision[0].filename.split(".").pop();
//                 (2);
//                 if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
//                     handleDeleteFile7(req);
//                     error.push("Please upload image or pdf or word");
//                     return res.status(400).json({ message: error });
//                 }
//             }

//             if (!req.files.word) {
//                 handleDeleteFile7(req);
//                 error.push("Please upload word");
//                 return res.status(400).json({ message: error });
//             } else {
//                 const ext = req.files.word[0].filename.split(".").pop();
//                 if (ext !== "docx" && ext !== "doc") {
//                     handleDeleteFile7(req);
//                     error.push("Please upload word");
//                     return res.status(400).json({ message: error });
//                 }
//             }

//             if (!req.files.pdf) {
//                 handleDeleteFile7(req);
//                 error.push("Please upload pdf");
//                 return res.status(400).json({ message: error });
//             } else {
//                 const ext = req.files.pdf[0].filename.split(".").pop();
//                 if (ext !== "pdf") {
//                     handleDeleteFile7(req);
//                     error.push("Please upload pdf file");
//                     return res.status(400).json({ message: error });
//                 }
//             }





//             const data = {
//                 message_word_ar: req.files.word[0].filename,
//                 message_pdf_ar: req.files.pdf[0].filename,
//                 decision: req.files.decision[0].filename,
//                 level: req.body.level,
//             }


//             const sql = `INSERT INTO grant_service SET ?`;
//             const value = [data];
//             const result = await query(sql, value);
//             if (result.affectedRows > 0) {
//                 const submit = {
//                     ser_grant: result.insertId,
//                     status: 2,
//                     submit_date: new Date(),
//                     service_id: 7,
//                     user_id: req.id,
//                 }
//                 const sql2 = 'INSERT INTO submit SET ?';
//                 const value2 = [submit];
//                 const result2 = await query(sql2, value2);
//                 if (result2.affectedRows > 0) {
//                     return res.status(200).json({ message: "Data saved successfully" });
//                 } else {
//                     handleDeleteFile7(req);
//                     error.push("Data not saved");
//                     return res.status(400).json({ message: error });
//                 }
//             } else {
//                 handleDeleteFile7(req);
//                 error.push("Data not saved");
//                 return res.status(400).json({ message: error });
//             }

//         } catch (error) {
//             handleDeleteFile7(req);
//             return res.status(500).json({ message: error.message });
//         }
//     }
// );

// serviceStepTwoEdit.post("/StepTwoSer8",
//     checkUser,
//     body("level").notEmpty().withMessage("Please enter level"),
//     body("academic_div").notEmpty().withMessage("Please enter academic"),

//     async (req, res) => {
//         let error = [];
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 handleDeleteFile7(req);
//                 errors.array().forEach(element => {
//                     error.push(element.msg);
//                 });
//                 return res.status(400).json({ message: error });
//             }







//             const data = {
//                 level: req.body.level,
//                 academic: req.body.academic_div,
//             }


//             const sql = `INSERT INTO knowledge_bank_service SET ?`;
//             const value = [data];
//             const result = await query(sql, value);
//             if (result.affectedRows > 0) {
//                 const submit = {
//                     ser_grant: result.insertId,
//                     status: 2,
//                     submit_date: new Date(),
//                     service_id: 8,
//                     user_id: req.id,
//                 }
//                 const sql2 = 'INSERT INTO submit SET ?';
//                 const value2 = [submit];
//                 const result2 = await query(sql2, value2);
//                 if (result2.affectedRows > 0) {
//                     return res.status(200).json({ message: "Data saved successfully" });
//                 } else {
//                     handleDeleteFile7(req);
//                     error.push("Data not saved");
//                     return res.status(400).json({ message: error });
//                 }
//             } else {
//                 handleDeleteFile7(req);
//                 error.push("Data not saved");
//                 return res.status(400).json({ message: error });
//             }

//         } catch (error) {
//             handleDeleteFile7(req);
//             return res.status(500).json({ message: error.message });
//         }
//     }
// );



// export default serviceStepTwoEdit;