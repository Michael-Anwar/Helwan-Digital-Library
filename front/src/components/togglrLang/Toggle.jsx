import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';
import './toggle.css'
import { TbLanguage } from 'react-icons/tb'

const Toggle = () => {

    const [toggle, setToggle] = useState(true);
    const [ ,i18n] = useTranslation();
    
    const handleClick = () => {
        i18n.changeLanguage(toggle ? 'ar' : 'en')
        setToggle(!toggle);
    };



    return (
        <button className="toggle-lang" onClick={handleClick}>{localStorage.getItem('i18nextLng') == "en" ? (<><p>عربي </p></>) : (<><p>English</p></>)}</button>
    )
}

export default Toggle