import React, { useEffect, useState } from 'react';
import * as Buttons from './Buttons';
import HelperMessage from './HelperMessage';

const PostForm = ({ TitleValue, ContentValue, onTitleChange, onContentChange, onSubmit, onImageUpload, isUploading }) => {
    const [helperMessage, setHelperMessage] = useState('');

    useEffect(() => {
        if (!TitleValue || !ContentValue) {
            setHelperMessage('*제목과 내용을 모두 작성해주세요');
        } else {
            setHelperMessage('');
        }
    }, [TitleValue, ContentValue]);

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
                    onChange={onImageUpload}
                    disabled={isUploading}
                    style={{ width: '100%' }}
                />
                {isUploading && <p>이미지 업로드 중...</p>}
            </div>
            <div className="PostFormBtnContainer">
                <Buttons.SubmitBtn label="완료" />
            </div>
        </form>
    );
};

export default PostForm;
