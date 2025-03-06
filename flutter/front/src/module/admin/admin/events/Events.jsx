import React from "react";
import { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img from "../../../../images/librarylog.jpg";
import { API_URL } from "../../../../config";
import PopupErrorMsg from "../../../../components/error/PopupErrorMsg";
import PopupConfirmMsg from "../../../../components/error/PopupConfirmMsg";
import PopupAddEvent from "../../../../components/error/PopupAddEvent";

const Events = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        try {
            axios
                .get(`${API_URL}/admin/getallEvents`, { withCredentials: true })
                .then((res) => {
                    setAllEvents(res.data);
                })
                .catch((err) => {
                    // console.log(err);
                });
        } catch (err) {
            // console.log(err);
        }
    }, []);

    const [event, setEvent] = useState({
        title: "",
        content: "",
        image: "",
        from: "",
        to: "",
        place: "",
    });

    const handleCloseError = () => {
        setError("");
        setConfirm(false);
        setEvent({
            title: "",
            content: "",
            image: "",
            from: "",
            to: "",
            place: "",
        });

    };


    const handleClose = () => {
        setError("");
    };

    const handleEditEvent = (index) => {
        if (allEvents[index].title.length == 0) {
            setError("من فضلك ادخل عنوان الخبر");
        } else if (allEvents[index].content.length == 0) {
            setError("من فضلك ادخل محتوى الخبر");
        } else {
            axios.defaults.withCredentials = true;
            try {
                axios
                    .put(`${API_URL}/admin/updateEvent/${allEvents[index].id}`, allEvents[index], {
                        withCredentials: true,
                    })
                    .then((res) => {
                        window.location.reload();
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            } catch (err) {
                // console.log(err);
            }
        }
    }

    const handleDeleteEvent = (id) => {
        axios.defaults.withCredentials = true;
        try {
            axios
                .delete(`${API_URL}/admin/deleteEvent/${id}`, {
                    withCredentials: true,
                })
                .then((res) => {
                    window.location.reload();
                })
                .catch((err) => {
                    // console.log(err);
                });
        } catch (err) {
            // console.log(err);
        }
    }

    return (
        <div className="super-container">
            {confirm && (<PopupAddEvent event={event} setEvent={setEvent} onClose={handleCloseError} />)}
            <img src={img} alt="img" />
            <section className="cotainer-stu">
                <div className="student-container">
                    <button
                        onClick={() => {
                            setConfirm(true);
                        }}
                        className="add"
                    >
                        {" "}
                        <MdAdd /> اضافة خبر او فعالية
                    </button>
                    <h2 className="table-title-h2">ادارة الاخبار والفعاليات</h2>
                    {allEvents?.length > 0 ? (
                        <table className="table-student">
                            <thead>
                                <tr>
                                    <th>العنوان</th>
                                    <th>المحتوى</th>
                                    <th>الصورة</th>
                                    <th>من</th>
                                    <th>الي</th>
                                    <th>المكان</th>
                                    <th>تعديل</th>
                                    <th>حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allEvents.map((event, index) => (
                                    <tr key={event.id}>
                                        <td>
                                            <textarea
                                                value={event.title}
                                                onChange={(e) => {
                                                    const updatedEvent = [...allEvents];
                                                    updatedEvent[index] = {
                                                        ...event,
                                                        title: e.target.value,
                                                    };
                                                    setAllEvents(updatedEvent);
                                                }
                                                }
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                value={event.content}
                                                onChange={(e) => {
                                                    const updatedEvent = [...allEvents];
                                                    updatedEvent[index] = {
                                                        ...event,
                                                        content: e.target.value,
                                                    };
                                                    setAllEvents(updatedEvent);
                                                }
                                                }
                                            />
                                        </td>
                                        <td>
                                            <img
                                                src={`${API_URL}/adminsEvents/${event.img}`}
                                                alt="img"
                                                style={{ width: "100px" }}
                                            />
                                        </td>
                                        <td>{event.from_date?.slice(0, 10)}</td>
                                        <td>{event.to_date?.slice(0, 10)}</td>
                                        <td>{event.place}</td>
                                        <td>
                                            <button
                                                onClick={() => { handleEditEvent(index) }}

                                                className="edit"
                                            >
                                                تعديل
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => { handleDeleteEvent(event.id) }}
                                                className="delete"
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <h2>لا يوجد اخبار او فعاليات</h2>
                    )}
                </div>
            </section>
            {error && <PopupErrorMsg message={error} onClose={handleCloseError} />}
        </div>
    );
};

export default Events;
