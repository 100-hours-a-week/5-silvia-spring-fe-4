import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NicknameInputField } from './InputField';
import ProfileImgPicker from "./ProfileImgPicker";
import * as Buttons from "./Buttons";
import ToastMessage from "./ToastMessage";
import Modal from '../components/Modal';

const ProfileEditForm = () => {
    const { userId } = useParams();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        // Fetch user data from the backend based on userId
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/accounts/${userId}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                const user = data.user;
                if (user) {
                    setNickname(user.nickname);
                    setEmail(user.email);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname) {
            alert('Nickname is required');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/accounts/${userId}/nickname`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                if (response.status === 409) {
                    alert('중복된 닉네임입니다.');
                } else {
                    throw new Error(errorMessage);
                }
                return;
            }

            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
            console.error('Error updating user data:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalVisible(false);
        document.body.style.overflow = 'auto';
    };

    const handleAccountDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/accounts/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                console.log('User and associated posts deleted successfully');
                // Redirect to home or login page
                window.location.href = '/login';
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <form className="ProfileEditGroup-Img" onSubmit={handleSubmit}>
            <div className="ProfileEditGroup">
                <div className="ProfileEditFormLabel" style={{ marginTop: '12px' }}>프로필 사진*</div>
                <ProfileImgPicker userId={userId} />
            </div>
            <div className="ProfileEditGroup">
                <div className="ProfileEditFormLabel" style={{ marginTop: '36px' }}>이메일</div>
                <p>{email}</p>
            </div>
            <div className="ProfileEditFormLabel">닉네임</div>
            <NicknameInputField
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="닉네임을 입력해주세요"
            />
            <div className="ProfileSubmitBtn">
                <Buttons.SubmitBtn
                    label={"수정하기"}
                    type="submit"
                />
            </div>
            <div className="Text14" onClick={showModal}
                 style={{ marginTop: '12px', display: 'block', textAlign: 'center', cursor: 'pointer' }}>회원 탈퇴</div>
            {showToast && (
                <div className="ToastMessageContainer">
                    <ToastMessage
                        label="수정완료"
                    />
                </div>
            )}
            <Modal
                isVisible={isModalVisible}
                ModalLabel="회원탈퇴 하시겠습니까?"
                ModalContent="작성된 게시글과 댓글은 삭제됩니다."
                onClose={closeModal}
                onConfirm={handleAccountDelete}
            />
        </form>
    );
};

export default ProfileEditForm;
