import React, { useState } from 'react';
import PostForm from '../components/PostForm';

const PostCreatePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className="PostCreatePage">
            <div className="Text24">게시글 작성</div>
            <PostForm
                TitleValue={title}
                ContentValue={content}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
            />
        </div>
    );
};

export default PostCreatePage;
