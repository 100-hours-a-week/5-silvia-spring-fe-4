import React, { useState } from 'react';
import { EmailInputField, PasswordInputField, PasswordConfirmInputField, NicknameInputField } from './InputField';
// import ProfileImgPicker from './ProfileImgPicker';
import SignUpProfileImgPicker from "./SignUpProfileImgPicker";

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validateConfirmPassword(password, e.target.value);
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        validateNickname(e.target.value);
    };

    const handleProfileImageUrlChange = (url) => {
        setProfileImageUrl(url);
    };

    const validateEmail = async (email) => {
        if (!email) {
            setEmailError('*이메일을 입력해주세요.');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('*올바른 이메일 주소 형식을 입력해주세요. (예: 123@example.com)');
        } else {
            // Check for duplicate email
            try {
                const response = await fetch('http://localhost:3001/api/accounts');
                const data = await response.json();
                const isDuplicate = data.users.some(user => user.email === email);
                if (isDuplicate) {
                    setEmailError('*중복된 이메일입니다.');
                } else {
                    setEmailError('');
                }
            } catch (error) {
                console.error('Error checking email duplication:', error);
                setEmailError('이메일 중복 확인 중 오류가 발생했습니다.');
            }
        }
    };


    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
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

    const validateNickname = (nickname) => {
        if (!nickname) {
            setNicknameError('*닉네임을 입력해주세요.');
        } else if (/\s/.test(nickname)) {
            setNicknameError('*닉네임에는 띄어쓰기를 포함할 수 없습니다.');
        } else if (nickname.length > 10) {
            setNicknameError('*닉네임은 최대 10자 까지 작성 가능합니다.');
        } else {
            setNicknameError('');
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        await validateEmail(email);
        validatePassword(password);
        validateConfirmPassword(password, confirmPassword);
        validateNickname(nickname);

        if (!emailError && !passwordError && !confirmPasswordError && !nicknameError) {
            // Proceed with form submission (e.g., send data to the server)
            try {
                const response = await fetch('http://localhost:3001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, nickname, profileimg: profileImageUrl }),
                });

                if (response.ok) {
                    alert('회원가입 성공!');
                } else {
                    const errorText = await response.text();
                    alert(`회원가입 실패: ${errorText}`);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('회원가입 중 오류가 발생했습니다.');
            }
        } else {
            alert('입력 정보를 확인해주세요.');
        }
    };

    return (
        <form className="SignupForm" onSubmit={handleSubmit}>
            <div className="Text32" style={{marginBottom: '51px'}}>회원가입</div>

            <div className="SignUpProfilePickerContainer">
                <div className="SignUpProfileLabel"><span>프로필 사진</span></div>
                <SignUpProfileImgPicker
                    onImageUrlChange={handleProfileImageUrlChange}
                />
            </div>


            <EmailInputField
                label="이메일*"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                labelStyle={{ fontSize: '15px' }}
            />
            <PasswordInputField
                label="비밀번호*"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                labelStyle={{ fontSize: '15px' }}
            />
            <PasswordConfirmInputField
                label="비밀번호 확인*"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
                labelStyle={{ fontSize: '15px' }}
            />
            <NicknameInputField
                label="닉네임*"
                value={nickname}
                onChange={handleNicknameChange}
                error={nicknameError}
                labelStyle={{ fontSize: '15px' }}
            />
            <button className="SubmitBtn" style={{marginTop: '5px'}}>회원가입</button>
            <a href="/login" className="Text14"
               style={{marginTop: '12px', display: 'block', textAlign: 'center'}}>로그인하러 가기</a>
        </form>
    );
};

export default SignUpForm;
