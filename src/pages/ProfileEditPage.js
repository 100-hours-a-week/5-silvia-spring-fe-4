import React from 'react';
import ProfileEditForm from "../components/ProfileEditForm";


const ProfileEditPage = () => {
    return (
        <div className="PasswordChangePage">
            <div className="Text32">회원정보수정</div>
            <div className="ProfileEditFormContainer">
                <ProfileEditForm />
            </div>



        </div>
    );
};

export default ProfileEditPage;