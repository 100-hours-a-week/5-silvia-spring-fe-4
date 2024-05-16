import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { NicknameInputField } from './InputField';
import ProfileImgPicker from "./ProfileImgPicker";
import * as Buttons from "./Buttons";
import ToastMessage from "./ToastMessage";
import Modal from '../components/Modal';
import useUserData from '../hooks/useUserData'; // Import the custom hook

const ProfileEditForm = () => {
    const { userId } = useParams();
    const {
        nickname,
        email,
        showToast,
        setNickname,
        updateNickname
    } = useUserData(userId); // Use the custom hook

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const handleImageUrlChange = (newImageUrl) => {
        if (newImageUrl) {
            // If you had a state to set here, you would do it like this:
            // setState({ postImage: newImageUrl });
            console.log('New Image URL:', newImageUrl);
        } else {
            console.error("Received undefined image URL");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname) {
            alert('Nickname is required');
            return;
        }

        try {
            await updateNickname(nickname);
            // Set a timeout to refresh the page 2 seconds after a successful update
            setTimeout(() => {
                window.location.reload();
            }, 2000);  // 2000 milliseconds = 2 seconds
        } catch (error) {
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
                alert('계정이 삭제되었습니다 (҂ ꒦ິヮ꒦ິ)')
                console.log('User and associated posts deleted successfully');
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
                    <div className="ProfileEditFormLabel" style={{marginTop: '12px'}}>프로필 사진*</div>
                    <ProfileImgPicker userId={userId} onImageUrlChange={handleImageUrlChange}/>
                </div>
                <div className="ProfileEditGroup">
                    <div className="ProfileEditFormLabel" style={{marginTop: '36px'}}>이메일</div>
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
                     style={{marginTop: '12px', display: 'block', textAlign: 'center', cursor: 'pointer'}}>회원 탈퇴
                </div>
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
