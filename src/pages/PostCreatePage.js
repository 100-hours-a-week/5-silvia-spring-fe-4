import React, { useState } from 'react';
import PostForm from '../components/PostForm';
import { useNavigate } from 'react-router-dom';

const PostCreatePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postTitle: title, postContents: content, postImage: imageUrl }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            alert('게시글이 작성되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('게시글 작성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="PostCreatePage">
            <div className="Text24">게시글 작성</div>
            <PostForm
                TitleValue={title}
                ContentValue={content}
                ImageUrlValue={imageUrl}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                onImageUrlChange={handleImageUrlChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default PostCreatePage;
