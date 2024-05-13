import React, { useState, useEffect } from 'react';
import HelperMessage from './HelperMessage';

// 공통 InputField 컴포넌트
const InputField = ({ type, value, onChange, placeholder }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="InputField"
        />
    );
};


const getFieldStyle = (error, helperText) => {
    return { marginBottom: error || helperText ? '0px' : '22px' };
};


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


const createInputField = (type, defaultLabel, defaultHelperText, additionalValidation) => {
    return ({ value, onChange, placeholder, label = defaultLabel, error, labelStyle }) => {
        const [helperText, setHelperText] = useState(defaultHelperText);

        useEffect(() => {
            if (!value) {
                setHelperText(defaultHelperText);
            } else if (additionalValidation) {
                const validationMessage = additionalValidation(value);
                if (validationMessage) {
                    setHelperText(validationMessage);
                } else {
                    setHelperText('');
                }
            } else {
                setHelperText('');
            }
        }, [value]);

        const fieldStyle = getFieldStyle(error, helperText);

        return (
            <div className="FormInputGroup" style={fieldStyle}>
                <div className="Text18" style={labelStyle}>{label}</div>
                <InputField
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder || `${label}을(를) 입력하세요`}
                />
                {(error || helperText) && <HelperMessage text={error || helperText} />}
            </div>
        );
    };
};


// 각 입력 필드 컴포넌트 생성
const EmailInputField = createInputField("email", "이메일", "*이메일을 입력하세요.", (value) => !isValidEmail(value) && "*올바른 이메일 주소 형식을 입력해주세요");
const PasswordInputField = createInputField("password", "비밀번호", "*비밀번호를 입력해주세요.");
const PasswordConfirmInputField = createInputField("password", "비밀번호 확인", "*비밀번호 확인을 입력해주세요.");
const NicknameInputField = createInputField("text", "", "*닉네임을 입력해주세요.", (value) => value.length > 10 ? "*닉네임은 최대 10자까지 작성 가능합니다." : "");

// ProfileInputField 컴포넌트는 파일 업로드 특성 때문에 별도로 생성
const ProfileInputField = ({ profileImageError, profileImagePreview, handleProfileImageChange, label = "프로필 사진", labelStyle }) => {
    const [helperText, setHelperText] = useState('*프로필 사진을 추가해주세요.');

    useEffect(() => {
        if (profileImageError) {
            setHelperText(profileImageError);
        } else if (profileImagePreview) {
            setHelperText('');
        } else {
            setHelperText('*프로필 사진을 추가해주세요.');
        }
    }, [profileImageError, profileImagePreview]);

    const fieldStyle = getFieldStyle(profileImageError, helperText);

    return (
        <div className="FormInputGroup" style={fieldStyle}>
            <div className="Text18" style={labelStyle}>{label}</div>
            {(profileImageError || helperText) && <HelperMessage text={profileImageError || helperText} />}
            <label htmlFor="file-upload" id="upload-btn" style={{ backgroundImage: `url(${profileImagePreview})` }}>
                {!profileImagePreview && <div id="cross-shape"></div>}
                <input type="file" id="file-upload" onChange={handleProfileImageChange} />
            </label>
        </div>
    );
};

export { EmailInputField, PasswordInputField, PasswordConfirmInputField, NicknameInputField, ProfileInputField };
