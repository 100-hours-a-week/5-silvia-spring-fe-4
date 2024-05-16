import React, { useState } from 'react';
import axios from 'axios';
import PostForm from '../components/PostForm';
import { useNavigate } from 'react-router-dom';

const PostCreatePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleImageUrlChange = (url) => setImageUrl(url);

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
            handleImageUrlChange(response.data.postImage);
            setUploading(false);
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert(`Failed to upload image: ${error.response ? (error.response.data || error.response.statusText) : 'Server error'}`);
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/posts', {
                postTitle: title,
                postContents: content,
                postImage: imageUrl
            }, {
                withCredentials: true
            });

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
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                onImageUrlChange={handleImageUrlChange}
                onSubmit={handleSubmit}
                onImageUpload={handleImageUpload}
                isUploading={uploading}
            />
        </div>
    );
};

export default PostCreatePage;
