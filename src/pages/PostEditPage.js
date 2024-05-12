import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';

const PostEditPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/posts/${postId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post data');
                }
                const data = await response.json();
                setPost(data);
                setTitle(data.postTitle);  // Set title state
                setContent(data.postContents);  // Set content state
                setImageUrl(data.postImage);  // Set image URL state
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

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
            const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postTitle: title, postContents: content, postImage: imageUrl }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            alert('게시글이 업데이트되었습니다.');
            navigate(`/post/${postId}`);
        } catch (error) {
            console.error('Error updating post:', error);
            alert('게시글 업데이트 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    return (
        <div className="PostEditPage">
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

export default PostEditPage;
