import React, { useState, useEffect } from 'react';
import * as Buttons from './Buttons';
import HelperMessage from './HelperMessage';

const PostForm = ({ TitleValue, ContentValue, ImageUrlValue, onTitleChange, onContentChange, onImageUrlChange, onSubmit }) => {
    const [helperMessage, setHelperMessage] = useState('');

    useEffect(() => {
        if (!TitleValue || !ContentValue) {
            setHelperMessage('*제목,내용을 모두 작성해주세요');
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
                <div className="PostFormImgLabel">이미지 URL</div>
                <input
                    type="text"
                    value={ImageUrlValue}
                    onChange={onImageUrlChange}
                    placeholder="이미지 URL을 입력하세요"
                    className="ImageUrlInput"
                    style={{ width: '100%' }} // Adjust the width here
                />
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
