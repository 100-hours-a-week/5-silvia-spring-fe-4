import React from 'react';
import PasswordChangeForm from "../components/PasswordChangeForm";

const PasswordChangePage = () => {
    return (
        <div className="PasswordChangePage">
            <div className="Text32">비밀번호 수정</div>
            <div className="PasswordChangeContainer">
                <PasswordChangeForm/>
            </div>

        </div>
    );
};

export default PasswordChangePage;