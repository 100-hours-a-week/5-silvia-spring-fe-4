import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Buttons from './Buttons';
import HelperMessage from './HelperMessage';

const PostForm = ({ TitleValue, ContentValue, onTitleChange, onContentChange, onImageUrlChange, onSubmit }) => {
    const [helperMessage, setHelperMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!TitleValue || !ContentValue) {
            setHelperMessage('*제목과 내용을 모두 작성해주세요');
        } else {
            setHelperMessage('');
        }
    }, [TitleValue, ContentValue]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('postImage', file);

        try {
            setUploading(true);
            const response = await axios.post('http://localhost:3001/api/posts/image', formData);
            onImageUrlChange(response.data.postImage);
            setUploading(false);
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert(`Failed to upload image: ${error.response ? (error.response.data || error.response.statusText) : 'Server error'}`);
            setUploading(false);
        }
    };





    return (
        <form className="PostForm" onSubmit={onSubmit}>
            <div className="PostFormTitleGroup">
                <div className="PostTitleLabel">제목*</div>
                <div className="PostTitleInputContainer">
                    <input
                        type="text"
                        className="PostTitleInput"
                        placeholder="제목을 입력해주세요. (최대 26글자)"
                        value={TitleValue}
                        onChange={onTitleChange}
                    />
                </div>
            </div>
            <div className="PostFormContentGroup">
                <div className="PostContentLabel">내용*</div>
                <div className="PostContentInputContainer">
                    <textarea
                        className="PostContentInput"
                        placeholder="내용을 입력해주세요."
                        value={ContentValue}
                        onChange={onContentChange}
                    ></textarea>
                </div>
                {helperMessage && <HelperMessage text={helperMessage}/>}
            </div>
            <div className="FormImgInputGroup">
                <div className="PostFormImgLabel">이미지 업로드</div>
                <input
                    type="file"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ width: '100%' }}
                />
                {uploading && <p>이미지 업로드 중...</p>}
            </div>
            <div className="PostFormBtnContainer">
                <Buttons.SubmitBtn
                    label="완료"
                />
            </div>
        </form>
    );
};

export default PostForm;
