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

// Helper function to determine field style
const getFieldStyle = (error, helperText) => {
    return { marginBottom: error || helperText ? '0px' : '22px' };
};

// EmailInputField 컴포넌트
const EmailInputField = ({ value, onChange, placeholder, label = "이메일", error, labelStyle }) => {
    const [helperText, setHelperText] = useState('*이메일을 입력해주세요.');

    useEffect(() => {
        if (!value) {
            setHelperText('*이메일을 입력해주세요.');
        } else {
            setHelperText('');
        }
    }, [value]);

    const fieldStyle = getFieldStyle(error, helperText);

    return (
        <div className="FormInputGroup" style={fieldStyle}>
            <div className="Text18" style={labelStyle}>{label}</div>
            <InputField
                type="email"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "이메일을 입력하세요"}
            />
            {(error || helperText) && <HelperMessage text={error || helperText} />}
        </div>
    );
};

// PasswordInputField 컴포넌트
const PasswordInputField = ({ value, onChange, placeholder, label = "비밀번호", error, labelStyle }) => {
    const [helperText, setHelperText] = useState('*비밀번호를 입력해주세요.');

    useEffect(() => {
        if (!value) {
            setHelperText('*비밀번호를 입력해주세요.');
        } else {
            setHelperText('');
        }
    }, [value]);

    const fieldStyle = getFieldStyle(error, helperText);

    return (
        <div className="FormInputGroup" style={fieldStyle}>
            <div className="Text18" style={labelStyle}>{label}</div>
            <InputField
                type="password"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "비밀번호를 입력하세요"}
            />
            {(error || helperText) && <HelperMessage text={error || helperText} />}
        </div>
    );
};

// 비밀번호 확인 InputField 컴포넌트
const PasswordConfirmInputField = ({ value, onChange, placeholder, label = "비밀번호 확인", error, labelStyle }) => {
    const [helperText, setHelperText] = useState('*비밀번호 확인을 입력해주세요.');

    useEffect(() => {
        if (!value) {
            setHelperText('*비밀번호 확인을 입력해주세요.');
        } else {
            setHelperText('');
        }
    }, [value]);

    const fieldStyle = getFieldStyle(error, helperText);

    return (
        <div className="FormInputGroup" style={fieldStyle}>
            <div className="Text18" style={labelStyle}>{label}</div>
            <InputField
                type="password"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "비밀번호를 한번 더 입력하세요"}
            />
            {(error || helperText) && <HelperMessage text={error || helperText} />}
        </div>
    );
};

// 닉네임 InputField 컴포넌트
const NicknameInputField = ({ value, onChange, placeholder, label = "", error, labelStyle }) => {
    const [helperText, setHelperText] = useState('*닉네임을 입력해주세요.');

    useEffect(() => {
        if (!value) {
            setHelperText('*닉네임을 입력해주세요.');
        } else if (value.length > 10) {
            setHelperText('*닉네임은 최대 10자 까지 작성 가능합니다.');
        } else {
            setHelperText('');
        }
    }, [value]);

    const fieldStyle = getFieldStyle(error, helperText);

    return (
        <div className="FormInputGroup" style={fieldStyle}>
            <div className="Text18" style={labelStyle}>{label}</div>
            <InputField
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "닉네임을 입력하세요"}
            />
            {(error || helperText) && <HelperMessage text={error || helperText} />}
        </div>
    );
};

// ProfileInputField 컴포넌트
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
