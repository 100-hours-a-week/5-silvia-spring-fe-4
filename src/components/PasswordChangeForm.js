import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PasswordConfirmInputField, PasswordInputField } from './InputField';
import ToastMessage from './ToastMessage';
import * as Buttons from "./Buttons";

const PasswordChangeForm = () => {
    const { userId } = useParams(); // Get userId from URL parameters

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [showToast, setShowToast] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validateConfirmPassword(password, e.target.value);
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/;
        if (!password) {
            setPasswordError('*비밀번호를 입력해주세요.');
        } else if (!passwordPattern.test(password)) {
            setPasswordError('*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) {
            setConfirmPasswordError('*비밀번호 확인을 입력해주세요.');
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('*비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate before submitting
        validatePassword(password);
        validateConfirmPassword(password, confirmPassword);

        if (passwordError || confirmPasswordError) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/accounts/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password }), // Update the password in the request body
                credentials: 'include'
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
            console.error('Error updating password:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <form className="PasswordChangeForm" onSubmit={handleSubmit}>
            <PasswordInputField
                label="비밀번호*"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
            />
            <PasswordConfirmInputField
                label="비밀번호 확인*"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
            />
            <div className="PasswordBtnContainer">
                <Buttons.SubmitBtn
                    label={"수정하기"}
                    type="submit"
                />
            </div>
            {showToast && (
                <div className="ToastMessageContainer">
                    <ToastMessage
                        label="수정 완료"
                    />
                </div>
            )}
        </form>
    );
};

export default PasswordChangeForm;
