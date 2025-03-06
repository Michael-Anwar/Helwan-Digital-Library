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


const serviceStepTwo = express();
serviceStepTwo.use(express.Router());


const handleDeleteFile = (req) => {
    const payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : null;
    const photo_college_letter = req.files.photo_college_letter ? req.files.photo_college_letter[0].filename : null;
    const research = req.files.research ? req.files.research[0].filename : null;
    const research_en = req.files.research_en ? req.files.research_en[0].filename : null;
    const research_word = req.files.research_word ? req.files.research_word[0].filename : null;
    const research_word_en = req.files.research_word_en ? req.files.research_word_en[0].filename : null;
    const translation = req.files.translation ? req.files.translation[0].filename : null;

    const path = join(__dirname, `../public/imgs/${req.national_id}/${payment_photo}`);
    const path2 = join(__dirname, `../public/imgs/${req.national_id}/${photo_college_letter}`);
    const path3 = join(__dirname, `../public/imgs/${req.national_id}/${research}`);
    const path4 = join(__dirname, `../public/imgs/${req.national_id}/${research_en}`);
    const path5 = join(__dirname, `../public/imgs/${req.national_id}/${research_word}`);
    const path6 = join(__dirname, `../public/imgs/${req.national_id}/${research_word_en}`);
    const path7 = join(__dirname, `../public/imgs/${req.national_id}/${translation}`);

    for (let i = 0; i < 7; i++) {
        if (payment_photo != null && i == 0) {
            fs.unlinkSync(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (photo_college_letter != null && i == 1) {
            fs.unlinkSync(path2, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (research != null && i == 2) {
            fs.unlinkSync(path3, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (research_en != null && i == 3) {
            fs.unlinkSync(path4, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (research_word != null && i == 4) {
            fs.unlinkSync(path5, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (research_word_en != null && i == 5) {
            fs.unlinkSync(path6, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (translation != null && i == 6) {
            fs.unlinkSync(path7, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
    }
}
const handleDeleteFile2 = (req) => {
    const payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : null;
    const research = req.files.research ? req.files.research[0].filename : null;
    const research_word = req.files.research_word ? req.files.research_word[0].filename : null;
    const form = req.files.form ? req.files.form[0].filename : null;

    const path = join(__dirname, `../public/imgs/${req.national_id}/${payment_photo}`);
    const path3 = join(__dirname, `../public/imgs/${req.national_id}/${research}`);
    const path5 = join(__dirname, `../public/imgs/${req.national_id}/${research_word}`);
    const path7 = join(__dirname, `../public/imgs/${req.national_id}/${form}`);

    for (let i = 0; i < 7; i++) {
        if (payment_photo != null && i == 0) {
            fs.unlinkSync(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (research != null && i == 2) {
            fs.unlinkSync(path3, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (research_word != null && i == 4) {
            fs.unlinkSync(path5, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (form != null && i == 6) {
            fs.unlinkSync(path7, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
    }
}
const handleDeleteFile3 = (req) => {
    const payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : null;
    for (let i = 1; i <= 10; i++) {
        const word = req.files[`word${i}`] ? req.files[`word${i}`][0].filename : null;
        const pdf = req.files[`pdf${i}`] ? req.files[`pdf${i}`][0].filename : null;
        const path = join(__dirname, `../public/imgs/${req.national_id}/${word}`);
        const path2 = join(__dirname, `../public/imgs/${req.national_id}/${pdf}`);
        for (let i = 0; i < 2; i++) {
            if (word != null && i == 0) {
                fs.unlinkSync(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            } else if (pdf != null && i == 1) {
                fs.unlinkSync(path2, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            }
        }
    }
    const path3 = join(__dirname, `../public/imgs/${req.national_id}/${payment_photo}`);
    if (payment_photo != null) {
        fs.unlinkSync(path3, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
    }
}
const handleDeleteFile5 = (req) => {
    const payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : null;
    const research_list = req.files.research_list ? req.files.research_list[0].filename : null;
    for (let i = 1; i <= 20; i++) {
        const word = req.files[`word${i}`] ? req.files[`word${i}`][0].filename : null;
        const pdf = req.files[`pdf${i}`] ? req.files[`pdf${i}`][0].filename : null;
        const path = join(__dirname, `../public/imgs/${req.national_id}/${word}`);
        const path2 = join(__dirname, `../public/imgs/${req.national_id}/${pdf}`);
        for (let i = 0; i < 2; i++) {
            if (word != null && i == 0) {
                fs.unlinkSync(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            } else if (pdf != null && i == 1) {
                fs.unlinkSync(path2, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            }
        }
    }
    const path3 = join(__dirname, `../public/imgs/${req.national_id}/${payment_photo}`);
    if (payment_photo != null) {
        fs.unlinkSync(path3, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
    }
    const path4 = join(__dirname, `../public/imgs/${req.national_id}/${research_list}`);
    if (research_list != null) {
        fs.unlinkSync(path4, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
    }
}
const handleDeleteFile7 = (req) => {
    const decision = req.files.decision ? req.files.decision[0].filename : null;
    const pdf = req.files.pdf ? req.files.pdf[0].filename : null;
    const word = req.files.word ? req.files.word[0].filename : null;

    const path = join(__dirname, `../public/imgs/${req.national_id}/${decision}`);
    const path2 = join(__dirname, `../public/imgs/${req.national_id}/${pdf}`);
    const path3 = join(__dirname, `../public/imgs/${req.national_id}/${word}`);

    for (let i = 0; i < 4; i++) {
        if (decision != null && i == 0) {
            fs.unlinkSync(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (pdf != null && i == 1) {
            fs.unlinkSync(path2, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } else if (word != null && i == 2) {
            fs.unlinkSync(path3, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }

    }
}

serviceStepTwo.get("/StepTwoRegEdit/:id/:id2",
    checkUser,
    async (req, res) => {
        try {
            const id = req.params.id;
            const id2 = req.params.id2;


            if (id == 1) {
                const sql = `SELECT submit.* , registration_services.* FROM submit INNER JOIN registration_services ON submit.ser_reg = registration_services.id WHERE submit.service_id = ? AND submit.ser_reg = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            } else if (id == 2) {
                const sql = `SELECT submit.* , formation_service.* FROM submit INNER JOIN formation_service ON submit.ser_formation = formation_service.id WHERE submit.service_id = ? AND submit.ser_formation = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            } else if (id == 3) {
                const sql = `SELECT submit.* , personal_examination_service.* FROM submit INNER JOIN personal_examination_service ON submit.ser_personal  = personal_examination_service.id WHERE submit.service_id = ? AND submit.ser_personal  = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            } else if (id == 4) {
                const sql = `SELECT submit.* , magazine_checking_service.* FROM submit INNER JOIN magazine_checking_service ON submit.ser_magazine   = magazine_checking_service.id WHERE submit.service_id = ? AND submit.ser_magazine   = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            } if (id == 5) {
                const sql = `SELECT submit.* , upgrade_service.* FROM submit INNER JOIN upgrade_service ON submit.ser_upgrade    = upgrade_service.id WHERE submit.service_id = ? AND submit.ser_upgrade    = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            } if (id == 6) {
                const sql = `SELECT submit.* , best_message_service.* FROM submit INNER JOIN best_message_service ON submit.ser_best  = best_message_service.id WHERE submit.service_id = ? AND submit.ser_best  = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            } if (id == 7) {
                const sql = `SELECT submit.* , grant_service.* FROM submit INNER JOIN grant_service ON submit.ser_grant    = grant_service.id WHERE submit.service_id = ? AND submit.ser_grant    = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            } if (id == 8) {
                const sql = `SELECT submit.* , knowledge_bank_service.* FROM submit INNER JOIN knowledge_bank_service ON submit.ser_knowledge     = knowledge_bank_service.id WHERE submit.service_id = ? AND submit.ser_knowledge     = ? AND submit.user_id = ?`;
                const value = [id, id2, req.id];
                const result = await query(sql, value);
                if (result.length > 0) {
                    return res.status(200).json(result[0]);
                }
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);


serviceStepTwo.put("/StepTwoReg/:id/:id2",
    checkUser,
    upload.fields(
        [{ name: "payment_photo", maxCount: 1 },
        { name: "research", maxCount: 1 },
        { name: "research_en", maxCount: 1 },
        { name: "research_word", maxCount: 1 },
        { name: "research_word_en", maxCount: 1 },
        { name: "translation", maxCount: 1 },
        ]),

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
            const id = req.params.id;
            const id2 = req.params.id2;
            /*******  check if user has submit this service and his status not 1 or 2 or 3 *******/
            // const sqlSelect0 = `SELECT * FROM submit WHERE service_id = ? AND user_id = ? AND (status != 5 OR status != 6)`;
            // const valueSelect0 = [id, req.id];
            // const resultSelect0 = await query(sqlSelect0, valueSelect0);
            // if (resultSelect0.length > 0) {
            //     handleDeleteFile(req);
            //     error.push(" لا يمكنك التقديم لهذه الخدمة الان لان لديك طلب  لها بانتظار الرد");
            //     return res.status(400).json({ message: error });
            // }





            const sqlSelect = `SELECT submit.* ,registration_services.* FROM submit INNER JOIN registration_services ON submit.ser_reg = registration_services.id WHERE submit.service_id = ? AND submit.ser_reg = ? AND submit.user_id = ?`;
            const valueSelect = [id, id2, req.id];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {
                if (resultSelect[0].status == 1) {

                    if (!req.files.payment_photo) {
                        handleDeleteFile(req);
                        error.push("Please upload payment_photo");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.payment_photo[0].filename.split(".").pop();
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile(req);
                            error.push("يرجى رفع صوره ايصال الدفع بصيغه (jpg او png او jpeg او pdf او docx او doc)");
                            return res.status(400).json({ message: error });
                        }
                    }

                    if (!req.files.research) {
                        handleDeleteFile(req);
                        error.push("Please upload research");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.research[0].filename.split(".").pop();
                        if (ext !== "pdf") {
                            handleDeleteFile(req);
                            error.push("يرجى رفع ملف البحث العربي بصيغه (pdf)");
                            return res.status(400).json({ message: error });
                        }
                    }
                    if (!req.files.research_word) {
                        handleDeleteFile(req);
                        error.push("Please upload research_word");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.research_word[0].filename.split(".").pop();
                        if (ext !== "docx" && ext !== "doc") {
                            handleDeleteFile(req);
                            error.push("يرجى رفع ملف البحث العربي بصيغه (docx او doc)");
                            return res.status(400).json({ message: error });
                        }
                    }
                    if (!req.files.translation) {
                        handleDeleteFile(req);
                        error.push("Please upload translation");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.translation[0].filename.split(".").pop();
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile(req);
                            error.push("يرجى رفع ملف الترجمه بصيغه (jpg او png او jpeg او pdf او docx او doc)");
                            return res.status(400).json({ message: error });
                        }
                    }
                    if (req.files.research_en) {
                        const ext = req.files.research_en[0].filename.split(".").pop();
                        if (ext !== "pdf") {
                            handleDeleteFile(req);
                            error.push("يرجى رفع ملف البحث الانجليزي بصيغه (pdf)");
                            return res.status(400).json({ message: error });
                        }
                    }
                    if (req.files.research_word_en) {
                        const ext = req.files.research_word_en[0].filename.split(".").pop();
                        if (ext !== "docx" && ext !== "doc") {
                            handleDeleteFile(req);
                            error.push("يرجى رفع ملف البحث الانجليزي بصيغه (docx او doc)");
                            return res.status(400).json({ message: error });
                        }
                    }
                }
                let payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : resultSelect[0].photo_payment_receipt;
                let research = req.files.research ? req.files.research[0].filename : resultSelect[0].research_plan_ar_pdf;
                let research_en = req.files.research_en ? req.files.research_en[0].filename : resultSelect[0].research_plan_en_pdf;
                let research_word = req.files.research_word ? req.files.research_word[0].filename : resultSelect[0].research_plan_ar_word;
                let research_word_en = req.files.research_word_en ? req.files.research_word_en[0].filename : resultSelect[0].research_plan_en_word;
                let translation = req.files.translation ? req.files.translation[0].filename : resultSelect[0].translation_paper;


                if (req.files.payment_photo && resultSelect[0].photo_payment_receipt != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].photo_payment_receipt}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile(req);
                            console.error(err)
                            return
                        }
                    })
                }
                if (req.files.research && resultSelect[0].research_plan_ar_pdf != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].research_plan_ar_pdf}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile(req);
                            console.error(err)
                            return
                        }
                    })
                }
                if (req.files.research_en && resultSelect[0].research_plan_en_pdf != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].research_plan_en_pdf}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile(req);
                            console.error(err)
                            return
                        }
                    })
                }
                if (req.files.research_word && resultSelect[0].research_plan_ar_word != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].research_plan_ar_word}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile(req);
                            console.error(err)
                            return
                        }
                    })
                }
                if (req.files.research_word_en && resultSelect[0].research_plan_en_word != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].research_plan_en_word}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile(req);
                            console.error(err)
                            return
                        }
                    })
                }
                if (req.files.translation && resultSelect[0].translation_paper != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].translation_paper}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile(req);
                            console.error(err)
                            return
                        }
                    })
                }



                const data = {
                    photo_payment_receipt: payment_photo,
                    research_plan_ar_pdf: research,
                    research_plan_en_pdf: research_en,
                    research_plan_ar_word: research_word,
                    research_plan_en_word: research_word_en,
                    translation_paper: translation,
                }

                const sql = `UPDATE registration_services SET ? WHERE id = ? `;
                const value = [data, id2];
                const result = await query(sql, value);
                let submit_date = resultSelect[0].status == 1 ? new Date() : resultSelect[0].submit_date;
                let edit_date = resultSelect[0].status != 1 ? new Date() : resultSelect[0].edit_date;
                if (result.affectedRows > 0) {
                    const submit = {
                        status: 2,
                        response_text: null,
                        manager_status: null,
                        submit_date: submit_date,
                        edit_date: edit_date,
                    }
                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_reg = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        handleDeleteFile(req);
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    handleDeleteFile(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }

            }


        } catch (error) {
            handleDeleteFile(req);
            return res.status(500).json({ message: error.message });
        }
    }
);
serviceStepTwo.put("/StepTwoSer2/:id/:id2",
    checkUser,
    upload.fields(
        [{ name: "payment_photo", maxCount: 1 },
        { name: "research", maxCount: 1 },
        { name: "research_word", maxCount: 1 },
        { name: "form", maxCount: 1 },
        ]),

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

            const id = req.params.id;
            const id2 = req.params.id2;

            const sqlSelect = `SELECT submit.* ,formation_service.* FROM submit INNER JOIN formation_service ON submit.ser_formation  = formation_service.id WHERE submit.service_id = ? AND submit.ser_formation  = ? AND submit.user_id = ?`;
            const valueSelect = [id, id2, req.id];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {
                if (resultSelect[0].status == 1) {
                    (req.files);
                    if (!req.files.payment_photo) {
                        handleDeleteFile2(req);
                        error.push("Please upload payment_photo");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.payment_photo[0].filename.split(".").pop();
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile2(req);
                            error.push("Please upload image or pdf or word");
                            return res.status(400).json({ message: error });
                        }
                    }

                    if (!req.files.research) {
                        handleDeleteFile2(req);
                        error.push("Please upload research");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.research[0].filename.split(".").pop();
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile2(req);
                            error.push("Please upload image or pdf or word");
                            return res.status(400).json({ message: error });
                        }
                    }

                    if (!req.files.research_word) {
                        handleDeleteFile2(req);
                        error.push("Please upload research_word");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.research_word[0].filename.split(".").pop();
                        if (ext !== "docx" && ext !== "doc") {
                            handleDeleteFile2(req);
                            error.push("Please upload word file");
                            return res.status(400).json({ message: error });
                        }
                    }

                    // if (!req.files.form) {
                    //     handleDeleteFile2(req);
                    //     error.push("Please upload form");
                    //     return res.status(400).json({ message: error });
                    // } else {
                    // const ext = req?.files?.form[0]?.filename.split(".").pop();
                    // if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                    //     handleDeleteFile2(req);
                    //     error.push("Please upload image or pdf or word");
                    //     return res.status(400).json({ message: error });
                    // }


                }
                let payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : resultSelect[0].photo_payment_receipt;
                let research = req.files.research ? req.files.research[0].filename : resultSelect[0].message_pdf_ar;
                let research_word = req.files.research_word ? req.files.research_word[0].filename : resultSelect[0].message_word_ar;
                let form = req.files?.form ? req?.files?.form[0]?.filename : resultSelect[0].quote_check_form;





                const data = {
                    photo_payment_receipt: payment_photo,
                    message_word_ar: research_word,
                    message_pdf_ar: research,
                    quote_check_form: form,
                }


                const sql = `UPDATE formation_service SET ? WHERE id = ? `;
                const value = [data, id2];
                const result = await query(sql, value);
                let submit_date = resultSelect[0].status == 1 ? new Date() : resultSelect[0].submit_date;
                let edit_date = resultSelect[0].status != 1 ? new Date() : resultSelect[0].edit_date;
                if (result.affectedRows > 0) {
                    const submit = {
                        status: 2,
                        response_text: null,
                        manager_status: null,
                        submit_date: submit_date,
                        edit_date: edit_date,
                    }
                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_formation = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        handleDeleteFile2(req);
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    handleDeleteFile2(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            }

        } catch (error) {
            handleDeleteFile2(req);
            return res.status(500).json({ message: error.message });
        }
    }
);

const uploadFields = [
    { name: "payment_photo", maxCount: 1 },
    { name: "research_list", maxCount: 1 },
];
for (let i = 1; i <= 10; i++) {
    uploadFields.push({ name: `word${i}`, maxCount: 1 });
}
for (let i = 1; i <= 20; i++) {
    uploadFields.push({ name: `pdf${i}`, maxCount: 1 });
}

serviceStepTwo.put("/StepTwoSer3/:id/:id2",
    checkUser,
    upload.fields(uploadFields),

    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                handleDeleteFile3(req);
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const id = req.params.id;
            const id2 = req.params.id2;

            const sqlSelect = `SELECT submit.* ,personal_examination_service.* FROM submit INNER JOIN personal_examination_service ON submit.ser_personal   = personal_examination_service.id WHERE submit.service_id = ? AND submit.ser_personal   = ? AND submit.user_id = ?`;
            const valueSelect = [id, id2, req.id];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {
                if (resultSelect[0].status == 1) {
                    (req.files);
                    if (!req.files.payment_photo) {
                        handleDeleteFile3(req);
                        error.push("Please upload payment_photo");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.payment_photo[0].filename.split(".").pop();
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile3(req);
                            error.push("Please upload image or pdf or word");
                            return res.status(400).json({ message: error });
                        }
                    }
                    for (let i = 1; i <= req.body.files_numbers; i++) {
                        if (!req.files[`word${i}`]) {
                            handleDeleteFile3(req);
                            error.push(`Please upload word${i}`);
                            return res.status(400).json({ message: error });
                        } else {
                            const ext = req.files[`word${i}`][0].filename.split(".").pop();
                            if (ext !== "docx" && ext !== "doc") {
                                handleDeleteFile3(req);
                                error.push(`Please upload word${i}`);
                                return res.status(400).json({ message: error });
                            }
                        }
                    }
                    for (let i = 1; i <= req.body.files_numbers; i++) {
                        if (!req.files[`pdf${i}`]) {
                            handleDeleteFile3(req);
                            error.push(`Please upload pdf${i}`);
                            return res.status(400).json({ message: error });
                        } else {
                            const ext = req.files[`pdf${i}`][0].filename.split(".").pop();
                            if (ext !== "pdf") {
                                handleDeleteFile3(req);
                                error.push(`Please upload pdf${i}`);
                                return res.status(400).json({ message: error });
                            }
                        }
                    }

                }

                let payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : resultSelect[0].photo_payment_receipt;
                let word1 = req.files.word1 ? req.files.word1[0].filename : resultSelect[0].research1_image_word;
                let word2 = req.files.word2 ? req.files.word2[0].filename : resultSelect[0].research2_image_word;
                let word3 = req.files.word3 ? req.files.word3[0].filename : resultSelect[0].research3_image_word;
                let word4 = req.files.word4 ? req.files.word4[0].filename : resultSelect[0].research4_image_word;
                let word5 = req.files.word5 ? req.files.word5[0].filename : resultSelect[0].research5_image_word;
                let word6 = req.files.word6 ? req.files.word6[0].filename : resultSelect[0].research6_image_word;
                let word7 = req.files.word7 ? req.files.word7[0].filename : resultSelect[0].research7_image_word;
                let word8 = req.files.word8 ? req.files.word8[0].filename : resultSelect[0].research8_image_word;
                let word9 = req.files.word9 ? req.files.word9[0].filename : resultSelect[0].research9_image_word;
                let word10 = req.files.word10 ? req.files.word10[0].filename : resultSelect[0].research10_image_word;
                let pdf1 = req.files.pdf1 ? req.files.pdf1[0].filename : resultSelect[0].research1_image_pdf;
                let pdf2 = req.files.pdf2 ? req.files.pdf2[0].filename : resultSelect[0].research2_image_pdf;
                let pdf3 = req.files.pdf3 ? req.files.pdf3[0].filename : resultSelect[0].research3_image_pdf;
                let pdf4 = req.files.pdf4 ? req.files.pdf4[0].filename : resultSelect[0].research4_image_pdf;
                let pdf5 = req.files.pdf5 ? req.files.pdf5[0].filename : resultSelect[0].research5_image_pdf;
                let pdf6 = req.files.pdf6 ? req.files.pdf6[0].filename : resultSelect[0].research6_image_pdf;
                let pdf7 = req.files.pdf7 ? req.files.pdf7[0].filename : resultSelect[0].research7_image_pdf;
                let pdf8 = req.files.pdf8 ? req.files.pdf8[0].filename : resultSelect[0].research8_image_pdf;
                let pdf9 = req.files.pdf9 ? req.files.pdf9[0].filename : resultSelect[0].research9_image_pdf;
                let pdf10 = req.files.pdf10 ? req.files.pdf10[0].filename : resultSelect[0].research10_image_pdf;


                const data = {
                    photo_payment_receipt: payment_photo,
                    research1_image_pdf: pdf1,
                    research2_image_pdf: pdf2,
                    research3_image_pdf: pdf3,
                    research4_image_pdf: pdf4,
                    research5_image_pdf: pdf5,
                    research6_image_pdf: pdf6,
                    research7_image_pdf: pdf7,
                    research8_image_pdf: pdf8,
                    research9_image_pdf: pdf9,
                    research10_image_pdf: pdf10,
                    research1_image_word: word1,
                    research2_image_word: word2,
                    research3_image_word: word3,
                    research4_image_word: word4,
                    research5_image_word: word5,
                    research6_image_word: word6,
                    research7_image_word: word7,
                    research8_image_word: word8,
                    research9_image_word: word9,
                    research10_image_word: word10,
                    publish_date: (!req.body.puplish_date && req.body.accept_date) ? null : req.body.puplish_date ? req.body.puplish_date : null,
                    accept_date: (!req.body.accept_date && req.body.puplish_date) ? null : req.body.accept_date ? req.body.accept_date : null,
                }

                if (req.files.payment_photo && resultSelect[0].photo_payment_receipt != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].photo_payment_receipt}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile3(req);
                            console.error(err)
                            return
                        }
                    })
                }
                for (let i = 1; i <= 10; i++) {
                    if (req.files[`word${i}`] && resultSelect[0][`research${i}_image_word`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_word`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile3(req);
                                console.error(err)
                                return
                            }
                        })
                    }
                }
                for (let i = 1; i <= 10; i++) {
                    if (req.files[`pdf${i}`] && resultSelect[0][`research${i}_image_pdf`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_pdf`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile3(req);
                                console.error(err)
                                return
                            }
                        })
                    }
                }


                
                let submit_date = resultSelect[0].status == 1 ? new Date() : resultSelect[0].submit_date;
                let edit_date = resultSelect[0].status != 1 ? new Date() : resultSelect[0].edit_date;
                const sql = `UPDATE personal_examination_service SET ? WHERE id = ? `;
                const value = [data, id2];
                const result = await query(sql, value);
                if (result.affectedRows > 0) {
                    const submit = {
                        status: 2,
                        response_text: null,
                        manager_status: null,
                        submit_date: submit_date,
                        edit_date: edit_date,
                    }
                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_personal = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        handleDeleteFile3(req);
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    handleDeleteFile3(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            }

        } catch (error) {
            handleDeleteFile3(req);
            return res.status(500).json({ message: error.message });
        }
    }
);
serviceStepTwo.put("/StepTwoSer4/:id/:id2",
    checkUser,
    upload.fields(uploadFields),

    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                handleDeleteFile3(req);
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const id = req.params.id;
            const id2 = req.params.id2;

            const sqlSelect = `SELECT submit.* ,magazine_checking_service.* FROM submit INNER JOIN magazine_checking_service ON submit.ser_magazine    = magazine_checking_service.id WHERE submit.service_id = ? AND submit.ser_magazine    = ? AND submit.user_id = ?`;
            const valueSelect = [id, id2, req.id];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {
                if (resultSelect[0].status == 1) {
                    (req.files);
                    if (!req.files.payment_photo) {
                        handleDeleteFile3(req);
                        error.push("Please upload payment_photo");
                        return res.status(400).json({ message: error });
                    } else {
                        (1);
                        const ext = req.files.payment_photo[0].filename.split(".").pop();
                        (2);
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile3(req);
                            error.push("Please upload image or pdf or word");
                            return res.status(400).json({ message: error });
                        }
                    }
                    for (let i = 1; i <= req.body.files_numbers; i++) {
                        if (!req.files[`word${i}`]) {
                            handleDeleteFile3(req);
                            error.push(`Please upload word${i}`);
                            return res.status(400).json({ message: error });
                        } else {
                            const ext = req.files[`word${i}`][0].filename.split(".").pop();
                            if (ext !== "docx" && ext !== "doc") {
                                handleDeleteFile3(req);
                                error.push(`Please upload word${i}`);
                                return res.status(400).json({ message: error });
                            }
                        }
                    }
                    for (let i = 1; i <= req.body.files_numbers; i++) {
                        if (!req.files[`pdf${i}`]) {
                            handleDeleteFile3(req);
                            error.push(`Please upload pdf${i}`);
                            return res.status(400).json({ message: error });
                        } else {
                            const ext = req.files[`pdf${i}`][0].filename.split(".").pop();
                            if (ext !== "pdf") {
                                handleDeleteFile3(req);
                                error.push(`Please upload pdf${i}`);
                                return res.status(400).json({ message: error });
                            }
                        }
                    }

                }

                let payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : resultSelect[0].photo_payment_receipt;
                let word1 = req.files.word1 ? req.files.word1[0].filename : resultSelect[0].research1_image_word;
                let word2 = req.files.word2 ? req.files.word2[0].filename : resultSelect[0].research2_image_word;
                let word3 = req.files.word3 ? req.files.word3[0].filename : resultSelect[0].research3_image_word;
                let word4 = req.files.word4 ? req.files.word4[0].filename : resultSelect[0].research4_image_word;
                let word5 = req.files.word5 ? req.files.word5[0].filename : resultSelect[0].research5_image_word;
                let word6 = req.files.word6 ? req.files.word6[0].filename : resultSelect[0].research6_image_word;
                let word7 = req.files.word7 ? req.files.word7[0].filename : resultSelect[0].research7_image_word;
                let word8 = req.files.word8 ? req.files.word8[0].filename : resultSelect[0].research8_image_word;
                let word9 = req.files.word9 ? req.files.word9[0].filename : resultSelect[0].research9_image_word;
                let word10 = req.files.word10 ? req.files.word10[0].filename : resultSelect[0].research10_image_word;
                let pdf1 = req.files.pdf1 ? req.files.pdf1[0].filename : resultSelect[0].research1_image_pdf;
                let pdf2 = req.files.pdf2 ? req.files.pdf2[0].filename : resultSelect[0].research2_image_pdf;
                let pdf3 = req.files.pdf3 ? req.files.pdf3[0].filename : resultSelect[0].research3_image_pdf;
                let pdf4 = req.files.pdf4 ? req.files.pdf4[0].filename : resultSelect[0].research4_image_pdf;
                let pdf5 = req.files.pdf5 ? req.files.pdf5[0].filename : resultSelect[0].research5_image_pdf;
                let pdf6 = req.files.pdf6 ? req.files.pdf6[0].filename : resultSelect[0].research6_image_pdf;
                let pdf7 = req.files.pdf7 ? req.files.pdf7[0].filename : resultSelect[0].research7_image_pdf;
                let pdf8 = req.files.pdf8 ? req.files.pdf8[0].filename : resultSelect[0].research8_image_pdf;
                let pdf9 = req.files.pdf9 ? req.files.pdf9[0].filename : resultSelect[0].research9_image_pdf;
                let pdf10 = req.files.pdf10 ? req.files.pdf10[0].filename : resultSelect[0].research10_image_pdf;


                const data = {
                    photo_payment_receipt: payment_photo,
                    research1_image_pdf: pdf1,
                    research2_image_pdf: pdf2,
                    research3_image_pdf: pdf3,
                    research4_image_pdf: pdf4,
                    research5_image_pdf: pdf5,
                    research6_image_pdf: pdf6,
                    research7_image_pdf: pdf7,
                    research8_image_pdf: pdf8,
                    research9_image_pdf: pdf9,
                    research10_image_pdf: pdf10,
                    research1_image_word: word1,
                    research2_image_word: word2,
                    research3_image_word: word3,
                    research4_image_word: word4,
                    research5_image_word: word5,
                    research6_image_word: word6,
                    research7_image_word: word7,
                    research8_image_word: word8,
                    research9_image_word: word9,
                    research10_image_word: word10,

                }

                if (req.files.payment_photo && resultSelect[0].photo_payment_receipt != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].photo_payment_receipt}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile3(req);
                            console.error(err)
                            return
                        }
                    })
                }

                for (let i = 1; i <= 10; i++) {
                    if (req.files[`word${i}`] && resultSelect[0][`research${i}_image_word`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_word`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile3(req);
                                console.error(err)
                                return
                            }
                        })
                    }
                }
                for (let i = 1; i <= 10; i++) {
                    if (req.files[`pdf${i}`] && resultSelect[0][`research${i}_image_pdf`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_pdf`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile3(req);
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                }



                const sql = `UPDATE magazine_checking_service SET ? WHERE id = ? `;
                const value = [data, id2];
                const result = await query(sql, value);
                if (result.affectedRows > 0) {
                    let submit_date = resultSelect[0].status == 1 ? new Date() : resultSelect[0].submit_date;
                    let edit_date = resultSelect[0].status != 1 ? new Date() : resultSelect[0].edit_date;

                    const submit = {
                        status: 2,
                        response_text: null,
                        manager_status: null,
                        submit_date: submit_date,
                        edit_date: edit_date,
                    }
                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_magazine  = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        handleDeleteFile3(req);
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    handleDeleteFile3(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            }

        } catch (error) {
            handleDeleteFile3(req);
            return res.status(500).json({ message: error.message });
        }
    }
);

serviceStepTwo.put("/StepTwoSer5/:id/:id2",
    checkUser,
    upload.fields(uploadFields),

    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                handleDeleteFile5(req);
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const id = req.params.id;
            const id2 = req.params.id2;

            const sqlSelect = `SELECT submit.* ,upgrade_service.* FROM submit INNER JOIN upgrade_service ON submit.ser_upgrade     = upgrade_service.id WHERE submit.service_id = ? AND submit.ser_upgrade     = ? AND submit.user_id = ?`;
            const valueSelect = [id, id2, req.id];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {
                if (resultSelect[0].status == 1) {
                    if (!req.files.payment_photo) {
                        handleDeleteFile5(req);
                        error.push("Please upload payment_photo");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.payment_photo[0].filename.split(".").pop();
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile5(req);
                            error.push("Please upload image or pdf or word");
                            return res.status(400).json({ message: error });
                        }
                    }
                    // if (!req.files.research_list) {
                    //     handleDeleteFile5(req);
                    //     error.push("Please upload research_list");
                    //     return res.status(400).json({ message: error });
                    // } else {
                    // const ext = req.files?.research_list[0]?.filename.split(".").pop();
                    // if (ext !== "pdf" && ext !== "docx" && ext !== "doc" && ext !== "jpg" && ext !== "png" && ext !== "jpeg") {
                    //     handleDeleteFile5(req);
                    //     error.push("Please upload pdf or word or image");
                    //     return res.status(400).json({ message: error });

                    // }
                    // for (let i = 1; i <= req.body.files_numbers; i++) {
                    //     if (!req.files[`word${i}`]) {
                    //         handleDeleteFile5(req);
                    //         error.push(`Please upload word${i}`);
                    //         return res.status(400).json({ message: error });
                    //     } else {
                    //         const ext = req.files[`word${i}`][0].filename.split(".").pop();
                    //         if (ext !== "docx" && ext !== "doc") {
                    //             handleDeleteFile5(req);
                    //             error.push(`Please upload word${i}`);
                    //             return res.status(400).json({ message: error });
                    //         }
                    //     }
                    // }
                    // for (let i = 1; i <= req.body.files_numbers; i++) {
                    //     if (!req.files[`pdf${i}`]) {
                    //         handleDeleteFile5(req);
                    //         error.push(`Please upload pdf${i}`);
                    //         return res.status(400).json({ message: error });
                    //     } else {
                    //         const ext = req.files[`pdf${i}`][0].filename.split(".").pop();
                    //         if (ext !== "pdf") {
                    //             handleDeleteFile5(req);
                    //             error.push(`Please upload pdf${i}`);
                    //             return res.status(400).json({ message: error });
                    //         }
                    //     }
                    // }
                    // for (let i = 11; i <= 20; i++) {

                    //     if (req.files[`pdf${i}`]) {
                    //         const ext = req.files[`pdf${i}`][0].filename.split(".").pop();
                    //         if (ext !== "pdf") {
                    //             handleDeleteFile5(req);
                    //             error.push(`Please upload acceptance_letter pdf`);
                    //             return res.status(400).json({ message: error });

                    //         }
                    //     }
                    // }

                }

                let payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : resultSelect[0].photo_payment_receipt;
                let research_list = req.files.research_list ? req.files.research_list[0].filename : resultSelect[0].research_list;

                let word1 = req.files.word1 ? req.files.word1[0].filename : resultSelect[0].research1_image_word;
                let word2 = req.files.word2 ? req.files.word2[0].filename : resultSelect[0].research2_image_word;
                let word3 = req.files.word3 ? req.files.word3[0].filename : resultSelect[0].research3_image_word;
                let word4 = req.files.word4 ? req.files.word4[0].filename : resultSelect[0].research4_image_word;
                let word5 = req.files.word5 ? req.files.word5[0].filename : resultSelect[0].research5_image_word;
                let word6 = req.files.word6 ? req.files.word6[0].filename : resultSelect[0].research6_image_word;
                let word7 = req.files.word7 ? req.files.word7[0].filename : resultSelect[0].research7_image_word;
                let word8 = req.files.word8 ? req.files.word8[0].filename : resultSelect[0].research8_image_word;
                let word9 = req.files.word9 ? req.files.word9[0].filename : resultSelect[0].research9_image_word;
                let word10 = req.files.word10 ? req.files.word10[0].filename : resultSelect[0].research10_image_word;
                let pdf1 = req.files.pdf1 ? req.files.pdf1[0].filename : resultSelect[0].research1_image_pdf;
                let pdf2 = req.files.pdf2 ? req.files.pdf2[0].filename : resultSelect[0].research2_image_pdf;
                let pdf3 = req.files.pdf3 ? req.files.pdf3[0].filename : resultSelect[0].research3_image_pdf;
                let pdf4 = req.files.pdf4 ? req.files.pdf4[0].filename : resultSelect[0].research4_image_pdf;
                let pdf5 = req.files.pdf5 ? req.files.pdf5[0].filename : resultSelect[0].research5_image_pdf;
                let pdf6 = req.files.pdf6 ? req.files.pdf6[0].filename : resultSelect[0].research6_image_pdf;
                let pdf7 = req.files.pdf7 ? req.files.pdf7[0].filename : resultSelect[0].research7_image_pdf;
                let pdf8 = req.files.pdf8 ? req.files.pdf8[0].filename : resultSelect[0].research8_image_pdf;
                let pdf9 = req.files.pdf9 ? req.files.pdf9[0].filename : resultSelect[0].research9_image_pdf;
                let pdf10 = req.files.pdf10 ? req.files.pdf10[0].filename : resultSelect[0].research10_image_pdf;
                let pdf11 = req.files.pdf11 ? req.files.pdf11[0].filename : resultSelect[0].acceptance_letter1;
                let pdf12 = req.files.pdf12 ? req.files.pdf12[0].filename : resultSelect[0].acceptance_letter2;
                let pdf13 = req.files.pdf13 ? req.files.pdf13[0].filename : resultSelect[0].acceptance_letter3;
                let pdf14 = req.files.pdf14 ? req.files.pdf14[0].filename : resultSelect[0].acceptance_letter4;
                let pdf15 = req.files.pdf15 ? req.files.pdf15[0].filename : resultSelect[0].acceptance_letter5;
                let pdf16 = req.files.pdf16 ? req.files.pdf16[0].filename : resultSelect[0].acceptance_letter6;
                let pdf17 = req.files.pdf17 ? req.files.pdf17[0].filename : resultSelect[0].acceptance_letter7;
                let pdf18 = req.files.pdf18 ? req.files.pdf18[0].filename : resultSelect[0].acceptance_letter8;
                let pdf19 = req.files.pdf19 ? req.files.pdf19[0].filename : resultSelect[0].acceptance_letter9;
                let pdf20 = req.files.pdf20 ? req.files.pdf20[0].filename : resultSelect[0].acceptance_letter10;



                const data = {
                    photo_payment_receipt: payment_photo,
                    research_list: research_list,
                    research1_image_pdf: pdf1,
                    research2_image_pdf: pdf2,
                    research3_image_pdf: pdf3,
                    research4_image_pdf: pdf4,
                    research5_image_pdf: pdf5,
                    research6_image_pdf: pdf6,
                    research7_image_pdf: pdf7,
                    research8_image_pdf: pdf8,
                    research9_image_pdf: pdf9,
                    research10_image_pdf: pdf10,
                    research1_image_word: word1,
                    research2_image_word: word2,
                    research3_image_word: word3,
                    research4_image_word: word4,
                    research5_image_word: word5,
                    research6_image_word: word6,
                    research7_image_word: word7,
                    research8_image_word: word8,
                    research9_image_word: word9,
                    research10_image_word: word10,
                    acceptance_letter1: pdf11,
                    acceptance_letter2: pdf12,
                    acceptance_letter3: pdf13,
                    acceptance_letter4: pdf14,
                    acceptance_letter5: pdf15,
                    acceptance_letter6: pdf16,
                    acceptance_letter7: pdf17,
                    acceptance_letter8: pdf18,
                    acceptance_letter9: pdf19,
                    acceptance_letter10: pdf20,

                }

                if (req.files.payment_photo && resultSelect[0].photo_payment_receipt != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].photo_payment_receipt}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile5(req);
                            console.error(err)
                            return
                        }
                    }
                    )
                }
                if (req.files.research_list && resultSelect[0].research_list != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].research_list}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile5(req);
                            console.error(err)
                            return
                        }
                    }
                    )
                }
                for (let i = 1; i <= 10; i++) {
                    if (req.files[`word${i}`] && resultSelect[0][`research${i}_image_word`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_word`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile5(req);
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                }
                for (let i = 1; i <= 10; i++) {
                    if (req.files[`pdf${i}`] && resultSelect[0][`research${i}_image_pdf`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_pdf`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile5(req);
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                }
                for (let i = 11; i <= 20; i++) {
                    if (req.files[`pdf${i}`] && resultSelect[0][`acceptance_letter${i - 10}`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`acceptance_letter${i - 10}`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile5(req);
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                }



                const sql = `UPDATE upgrade_service SET ? WHERE id = ? `;
                const value = [data, id2];
                const result = await query(sql, value);
                if (result.affectedRows > 0) {
                    let submit_date = resultSelect[0].status == 1 ? new Date() : resultSelect[0].submit_date;
                    let edit_date = resultSelect[0].status != 1 ? new Date() : resultSelect[0].edit_date;
                    const submit = {
                        status: 2,
                        response_text: null,
                        manager_status: null,
                        submit_date: submit_date,
                        edit_date: edit_date,
                    }
                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_upgrade   = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        handleDeleteFile5(req);
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    handleDeleteFile5(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            }

        } catch (error) {
            handleDeleteFile5(req);
            return res.status(500).json(error);
        }
    }
);

serviceStepTwo.put("/StepTwoSer6/:id/:id2",
    checkUser,
    upload.fields(uploadFields),

    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                handleDeleteFile3(req);
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const id = req.params.id;
            const id2 = req.params.id2;

            const sqlSelect = `SELECT submit.* ,best_message_service.* FROM submit INNER JOIN best_message_service ON submit.ser_best     = best_message_service.id WHERE submit.service_id = ? AND submit.ser_best     = ? AND submit.user_id = ?`;
            const valueSelect = [id, id2, req.id];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {
                if (resultSelect[0].status == 1) {
                    if (!req.files.payment_photo) {
                        handleDeleteFile3(req);
                        error.push("Please upload payment_photo");
                        return res.status(400).json({ message: error });
                    } else {
                        const ext = req.files.payment_photo[0].filename.split(".").pop();
                        if (ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "pdf" && ext !== "docx" && ext !== "doc") {
                            handleDeleteFile3(req);
                            error.push("Please upload image or pdf or word");
                            return res.status(400).json({ message: error });
                        }
                    }
                    for (let i = 1; i <= req.body.files_numbers; i++) {
                        if (!req.files[`word${i}`]) {
                            handleDeleteFile3(req);
                            error.push(`Please upload word${i}`);
                            return res.status(400).json({ message: error });
                        } else {
                            const ext = req.files[`word${i}`][0].filename.split(".").pop();
                            if (ext !== "docx" && ext !== "doc") {
                                handleDeleteFile3(req);
                                error.push(`Please upload word${i}`);
                                return res.status(400).json({ message: error });
                            }
                        }
                    }
                    for (let i = 1; i <= req.body.files_numbers; i++) {
                        if (!req.files[`pdf${i}`]) {
                            handleDeleteFile3(req);
                            error.push(`Please upload pdf${i}`);
                            return res.status(400).json({ message: error });
                        } else {
                            const ext = req.files[`pdf${i}`][0].filename.split(".").pop();
                            if (ext !== "pdf") {
                                handleDeleteFile3(req);
                                error.push(`Please upload pdf${i}`);
                                return res.status(400).json({ message: error });
                            }
                        }
                    }

                }

                let payment_photo = req.files.payment_photo ? req.files.payment_photo[0].filename : resultSelect[0].photo_payment_receipt;
                let word1 = req.files.word1 ? req.files.word1[0].filename : resultSelect[0].research1_image_word;
                let word2 = req.files.word2 ? req.files.word2[0].filename : resultSelect[0].research2_image_word;
                let word3 = req.files.word3 ? req.files.word3[0].filename : resultSelect[0].research3_image_word;
                let word4 = req.files.word4 ? req.files.word4[0].filename : resultSelect[0].research4_image_word;
                let word5 = req.files.word5 ? req.files.word5[0].filename : resultSelect[0].research5_image_word;
                let word6 = req.files.word6 ? req.files.word6[0].filename : resultSelect[0].research6_image_word;
                let word7 = req.files.word7 ? req.files.word7[0].filename : resultSelect[0].research7_image_word;
                let word8 = req.files.word8 ? req.files.word8[0].filename : resultSelect[0].research8_image_word;
                let word9 = req.files.word9 ? req.files.word9[0].filename : resultSelect[0].research9_image_word;
                let word10 = req.files.word10 ? req.files.word10[0].filename : resultSelect[0].research10_image_word;
                let pdf1 = req.files.pdf1 ? req.files.pdf1[0].filename : resultSelect[0].research1_image_pdf;
                let pdf2 = req.files.pdf2 ? req.files.pdf2[0].filename : resultSelect[0].research2_image_pdf;
                let pdf3 = req.files.pdf3 ? req.files.pdf3[0].filename : resultSelect[0].research3_image_pdf;
                let pdf4 = req.files.pdf4 ? req.files.pdf4[0].filename : resultSelect[0].research4_image_pdf;
                let pdf5 = req.files.pdf5 ? req.files.pdf5[0].filename : resultSelect[0].research5_image_pdf;
                let pdf6 = req.files.pdf6 ? req.files.pdf6[0].filename : resultSelect[0].research6_image_pdf;
                let pdf7 = req.files.pdf7 ? req.files.pdf7[0].filename : resultSelect[0].research7_image_pdf;
                let pdf8 = req.files.pdf8 ? req.files.pdf8[0].filename : resultSelect[0].research8_image_pdf;
                let pdf9 = req.files.pdf9 ? req.files.pdf9[0].filename : resultSelect[0].research9_image_pdf;
                let pdf10 = req.files.pdf10 ? req.files.pdf10[0].filename : resultSelect[0].research10_image_pdf;


                const data = {
                    photo_payment_receipt: payment_photo,
                    research1_image_pdf: pdf1,
                    research2_image_pdf: pdf2,
                    research3_image_pdf: pdf3,
                    research4_image_pdf: pdf4,
                    research5_image_pdf: pdf5,
                    research6_image_pdf: pdf6,
                    research7_image_pdf: pdf7,
                    research8_image_pdf: pdf8,
                    research9_image_pdf: pdf9,
                    research10_image_pdf: pdf10,
                    research1_image_word: word1,
                    research2_image_word: word2,
                    research3_image_word: word3,
                    research4_image_word: word4,
                    research5_image_word: word5,
                    research6_image_word: word6,
                    research7_image_word: word7,
                    research8_image_word: word8,
                    research9_image_word: word9,
                    research10_image_word: word10,

                }


                if (req.files.payment_photo && resultSelect[0].photo_payment_receipt != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].photo_payment_receipt}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile3(req);
                            console.error(err)
                            return
                        }
                    }
                    )
                }
                for (let i = 1; i <= 10; i++) {
                    if (req.files[`word${i}`] && resultSelect[0][`research${i}_image_word`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_word`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile3(req);
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                }
                for (let i = 1; i <= 10; i++) {
                    if (req.files[`pdf${i}`] && resultSelect[0][`research${i}_image_pdf`] != null) {
                        const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0][`research${i}_image_pdf`]}`);
                        fs.unlinkSync(path, (err) => {
                            if (err) {
                                handleDeleteFile3(req);
                                console.error(err)
                                return
                            }
                        }
                        )
                    }
                }


                const sql = `UPDATE best_message_service SET ? WHERE id = ? `;
                const value = [data, id2];
                const result = await query(sql, value);
                if (result.affectedRows > 0) {
                    let submit_date = resultSelect[0].status == 1 ? new Date() : resultSelect[0].submit_date;
                    let edit_date = resultSelect[0].status != 1 ? new Date() : resultSelect[0].edit_date;

                    const submit = {
                        status: 2,
                        response_text: null,
                        manager_status: null,
                        submit_date: submit_date,
                        edit_date: edit_date,
                    }
                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_best   = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        handleDeleteFile3(req);
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    handleDeleteFile3(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            }

        } catch (error) {
            handleDeleteFile3(req);
            return res.status(500).json({ message: error.message });
        }
    }
);


serviceStepTwo.get("/StepTwoSer78/:id/:id2",
    checkUser,
    async (req, res) => {
        let error = [];
        try {
            const id = req.params.id;
            const id2 = req.params.id2;
            if (id == 7) {
                const sqlSelect = `SELECT submit.* ,grant_service.* users.* FROM submit INNER JOIN grant_service ON submit.ser_personal     = grant_service.id INNER JOIN users ON submit.user_id = users.id WHERE submit.service_id = ? AND submit.ser_personal     = ? AND submit.user_id = ?`;
                const valueSelect = [id, id2, req.id];
                const resultSelect = await query(sqlSelect, valueSelect);
                if (resultSelect.length > 0) {
                    delete resultSelect[0].password;
                    return res.status(200).json(resultSelect);
                } else {
                    error.push("Data not found");
                    return res.status(400).json({ message: error });
                }
            } else if (id == 8) {
                const sqlSelect = `SELECT submit.* ,knowledge_bank_service.* users.* FROM submit INNER JOIN knowledge_bank_service ON submit.ser_personal     = knowledge_bank_service.id INNER JOIN users ON submit.user_id = users.id WHERE submit.service_id = ? AND submit.ser_personal     = ? AND submit.user_id = ?`;
                const valueSelect = [id, id2, req.id];
                const resultSelect = await query(sqlSelect, valueSelect);
                if (resultSelect.length > 0) {
                    delete resultSelect[0].password;
                    return res.status(200).json(resultSelect);
                } else {
                    error.push("Data not found");
                    return res.status(400).json({ message: error });
                }
            } else {
                error.push("Data not found");
                return res.status(400).json({ message: error });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);


serviceStepTwo.post("/StepTwoSer7",
    checkUser,
    upload.fields(
        [{ name: "word", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
        { name: "decision", maxCount: 1 },
        ]),
    body("level").notEmpty().withMessage("Please enter level"),

    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.array().forEach(element => {
                    handleDeleteFile7(req);
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const sqlSelect0 = `SELECT * FROM submit WHERE service_id = ? AND user_id = ? AND (status != 5 AND status != 6)`;
            const valueSelect0 = [7, req.id];
            const resultSelect0 = await query(sqlSelect0, valueSelect0);
            if (resultSelect0.length > 0) {
                handleDeleteFile7(req);
                error.push(" لا يمكنك التقديم لهذه الخدمة الان لان لديك طلب  لها بانتظار الرد");
                return res.status(400).json({ message: error });
            }




            if (!req.files.decision) {
                handleDeleteFile7(req);
                error.push("Please upload decision");
                return res.status(400).json({ message: error });
            } else {
                const ext = req.files.decision[0].filename.split(".").pop();
                if (ext !== "pdf" && ext !== "docx" && ext !== "doc" && ext !== "jpg" && ext !== "png" && ext !== "jpeg" && ext !== "gif") {
                    handleDeleteFile7(req);
                    error.push("Please upload image or pdf or word");
                    return res.status(400).json({ message: error });
                }
            }

            if (!req.files.word) {
                handleDeleteFile7(req);
                error.push("Please upload word");
                return res.status(400).json({ message: error });
            } else {
                const ext = req.files.word[0].filename.split(".").pop();
                if (ext !== "docx" && ext !== "doc") {
                    handleDeleteFile7(req);
                    error.push("Please upload word");
                    return res.status(400).json({ message: error });
                }
            }

            if (!req.files.pdf) {
                handleDeleteFile7(req);
                error.push("Please upload pdf");
                return res.status(400).json({ message: error });
            } else {
                const ext = req.files.pdf[0].filename.split(".").pop();
                if (ext !== "pdf") {
                    handleDeleteFile7(req);
                    error.push("Please upload pdf file");
                    return res.status(400).json({ message: error });
                }
            }





            const data = {
                message_word_ar: req.files.word[0].filename,
                message_pdf_ar: req.files.pdf[0].filename,
                decision: req.files.decision[0].filename,
                level: req.body.level,
            }


            const sql = `INSERT INTO grant_service SET ?`;
            const value = [data];
            const result = await query(sql, value);
            if (result.affectedRows > 0) {
                const submit = {
                    ser_grant: result.insertId,
                    status: 2,
                    submit_date: new Date(),
                    service_id: 7,
                    user_id: req.id,
                }
                const sql2 = 'INSERT INTO submit SET ?';
                const value2 = [submit];
                const result2 = await query(sql2, value2);
                if (result2.affectedRows > 0) {
                    return res.status(200).json({ message: "Data saved successfully" });
                } else {
                    handleDeleteFile7(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            } else {
                handleDeleteFile7(req);
                error.push("Data not saved");
                return res.status(400).json({ message: error });
            }

        } catch (error) {
            handleDeleteFile7(req);
            return res.status(500).json({ message: error.message });
        }
    }
);

serviceStepTwo.put("/StepTwoSer7edit/:id/:id2",
    checkUser,
    upload.fields(
        [{ name: "word", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
        { name: "decision", maxCount: 1 },
        ]),

    async (req, res) => {
        let error = [];
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                handleDeleteFile7(req);
                errors.array().forEach(element => {
                    error.push(element.msg);
                });
                return res.status(400).json({ message: error });
            }

            const id = req.params.id;
            const id2 = req.params.id2;

            const sqlSelect = `SELECT * FROM grant_service WHERE id = ?`;
            const valueSelect = [id2];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {

                let word = req.files.word ? req.files.word[0].filename : resultSelect[0].message_word_ar;
                let pdf = req.files.pdf ? req.files.pdf[0].filename : resultSelect[0].message_pdf_ar;
                let decision = req.files.decision ? req.files.decision[0].filename : resultSelect[0].decision;

                const grant = {
                    message_word_ar: word,
                    message_pdf_ar: pdf,
                    decision: decision,
                    level: req.body.level ? req.body.level : resultSelect[0].level,
                }

                if (req.files.word && resultSelect[0].message_word_ar != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].message_word_ar}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile7(req);
                            console.error(err)
                            return
                        }
                    }
                    )
                }
                if (req.files.pdf && resultSelect[0].message_pdf_ar != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].message_pdf_ar}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile7(req);
                            console.error(err)
                            return
                        }
                    }
                    )
                }
                if (req.files.decision && resultSelect[0].decision != null) {
                    const path = join(__dirname, `../public/imgs/${req.national_id}/${resultSelect[0].decision}`);
                    fs.unlinkSync(path, (err) => {
                        if (err) {
                            handleDeleteFile7(req);
                            console.error(err)
                            return
                        }
                    }
                    )
                }



                const sql = `UPDATE grant_service SET ? WHERE id = ? `;
                const value = [grant, id2];
                const result = await query(sql, value);
                if (result.affectedRows > 0) {
                    const submit = {
                        status: 2,
                        response_text: null,
                        manager_status: null,
                        edit_date: new Date(),
                    }
                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_grant = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        handleDeleteFile7(req);
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    handleDeleteFile7(req);
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            }
        } catch (error) {
            handleDeleteFile7(req);
            return res.status(500).send(error);
        }
    }
);



serviceStepTwo.post("/StepTwoSer8",
    checkUser,
    body("level").notEmpty().withMessage("Please enter level"),
    body("academic_div").notEmpty().withMessage("Please enter academic"),

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
            const sqlSelect0 = `SELECT * FROM submit WHERE service_id = ? AND user_id = ? AND (status != 5 AND status != 6)`;
            const valueSelect0 = [8, req.id];
            const resultSelect0 = await query(sqlSelect0, valueSelect0);
            if (resultSelect0.length > 0) {
                error.push(" لا يمكنك التقديم لهذه الخدمة الان لان لديك طلب  لها بانتظار الرد");
                return res.status(400).json({ message: error });
            }

            const data = {
                level: req.body.level,
                academic: req.body.academic_div,
            }


            const sql = `INSERT INTO knowledge_bank_service SET ?`;
            const value = [data];
            const result = await query(sql, value);
            if (result.affectedRows > 0) {
                const submit = {
                    ser_knowledge: result.insertId,
                    status: 2,
                    submit_date: new Date(),
                    service_id: 8,
                    user_id: req.id,
                }
                const sql2 = 'INSERT INTO submit SET ?';
                const value2 = [submit];
                const result2 = await query(sql2, value2);
                if (result2.affectedRows > 0) {
                    return res.status(200).json({ message: "Data saved successfully" });
                } else {
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }
            } else {
                error.push("Data not saved");
                return res.status(400).json({ message: error });
            }

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);

serviceStepTwo.put("/StepTwoSer8edit/:id/:id2",
    checkUser,
    body("level").notEmpty().withMessage("Please enter level"),
    body("academic_div").notEmpty().withMessage("Please enter academic"),

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

            const id = req.params.id;
            const id2 = req.params.id2;

            const sqlSelect = `SELECT * FROM knowledge_bank_service WHERE id = ?`;
            const valueSelect = [id2];
            const resultSelect = await query(sqlSelect, valueSelect);
            if (resultSelect.length > 0) {
                const data = {
                    level: req.body.level ? req.body.level : resultSelect[0].level,
                    academic: req.body.academic_div ? req.body.academic_div : resultSelect[0].academic,
                }
                const sql = `UPDATE knowledge_bank_service SET ? WHERE id = ? `;
                const value = [data, id2];
                const result = await query(sql, value);
                if (result.affectedRows > 0) {
                    const submit = {
                        status: 2,
                        edit_date: new Date(),
                        response_text: null,
                        manager_status: null,
                    }

                    const sql2 = 'UPDATE submit SET ? WHERE service_id = ? AND ser_knowledge = ? AND user_id = ?';
                    const value2 = [submit, id, id2, req.id];
                    const result2 = await query(sql2, value2);
                    if (result2.affectedRows > 0) {
                        return res.status(200).json({ message: "Data saved successfully" });
                    } else {
                        error.push("Data not saved");
                        return res.status(400).json({ message: error });
                    }
                } else {
                    error.push("Data not saved");
                    return res.status(400).json({ message: error });
                }

            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);


export default serviceStepTwo;