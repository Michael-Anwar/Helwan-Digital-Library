import React from 'react'
import { useTranslation } from 'react-i18next'

const ProfileInfo = (props) => {

    const [t] = useTranslation();

    return (
        <div className="subnav-content">
            <div className="subnav-content-item">
                <h3>{t('name')} : </h3>
                <h4 className='h4-profile'>{props.user.name}</h4>
            </div>
            <div className='subnav-content-item'>
                <h3>{t('email')} : </h3>
                <h4 className='h4-profile'>{props.user.email}</h4>
            </div>
            <div className='subnav-content-item'>
                <h3>{t('n-id')} : </h3>
                <h4 className='h4-profile'>{props.user.national_id}</h4>
            </div>
            <div className='subnav-content-item'>
                <h3>{t('phone')} : </h3>
                <h4 className='h4-profile'>{props.user.phone}</h4>
            </div>
            <div className='subnav-content-item'>
                <h3>{t('nation')} : </h3>
                <h4 className='h4-profile'>{props.user.nationality}</h4>
            </div>
            <div className='subnav-content-item'>
                <h3>{t('uni')} : </h3>
                <h4 className='h4-profile'>{+props.user.university === 1 ? t('helwan-uni') : props.user.university}</h4>
            </div>

            {props.user.university != 1 && (
                <div className='subnav-content-item'>
                    <h3>{t('fac')} : </h3>
                    <h4 className='h4-profile'>{props.user.faculity}</h4>
                </div>
            )}
            {props.user.university == 1 && (
                <div className='subnav-content-item'>
                    <h3>{t('fac')} : </h3>
                    <h4 className='h4-profile'>{props.user.faculty_name_ar}</h4>
                </div>
            )}
            <div className='subnav-content-item'>
                <h3>{t('dep')} : </h3>
                <h4 className='h4-profile'>{props.user.department}</h4>
            </div>

            <h1>
                {t('edit-h1')}
            </h1>

        </div>
        // <div className="subnav-content">
        //     <div className="subnav-content-item">
        //         <h3>{t('name')}</h3>
        //         <input
        //             type="text"
        //             value={props.user.name}
        //             onChange={(e) => { props.setUser({ ...props.user, name: e.target.value }) }}
        //         />
        //     </div>
        //     <div className='subnav-content-item'>
        //         <h3>{t('email')}</h3>
        //         <input
        //             type="text"
        //             value={props.user.email}
        //             onChange={(e) => { props.setUser({ ...props.user, email: e.target.value }) }}
        //         />
        //     </div>
        //     <div className='subnav-content-item'>
        //         <h3>{t('n-id')}</h3>
        //         <input
        //         disabled
        //             type="text"
        //             value={props.user.national_id}
        //             onChange={(e) => { props.setUser({ ...props.user, national_id: e.target.value }) }}
        //         />
        //     </div>
        //     <div className='subnav-content-item'>
        //         <h3>{t('phone')}</h3>
        //         <input
        //             type="text"
        //             value={props.user.phone}
        //             onChange={(e) => { props.setUser({ ...props.user, phone: e.target.value }) }}
        //         />
        //     </div>
        //     <div className='subnav-content-item'>
        //         <h3>{t('nation')}</h3>
        //         <input
        //             type="text"
        //             value={props.user.nationality}
        //             onChange={(e) => { props.setUser({ ...props.user, nationality: e.target.value }) }}    
        //         />
        //     </div>
        //     <div className='subnav-content-item'>
        //         <h3>{t('uni')}</h3>
        //         <input
        //             type="text"
        //             value={+props.user.university === 1 ?t('helwan-uni') : props.user.university}
        //             onChange={(e) => { props.setUser({ ...props.user, university: e.target.value }) }}
        //         />
        //     </div>
        //     <div className='subnav-content-item'>
        //         <h3>{t('fac')}</h3>
        //         <input
        //             type="text"
        //             value={props.user.faculity}
        //             onChange={(e) => { props.setUser({ ...props.user, faculity: e.target.value }) }}
        //         />
        //     </div>
        //     <div className='subnav-content-item'>
        //         <h3>{t('dep')}</h3>
        //         <input
        //             type="text"
        //             value={props.user.department}
        //             onChange={(e) => { props.setUser({ ...props.user, department: e.target.value }) }}
        //         />
        //     </div>
        //     <button 
        //         className="waitbtn-edit"
        //         onClick={props.edituser}
        //     >
        //         {t('edit-btn')}
        //     </button>
        // </div>
    )
}

export default ProfileInfo