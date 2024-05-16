import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import axios from "axios";

const PostEditPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    // const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/posts/${postId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post data');
                }
                const data = await response.json();
                setPost(data);
                setTitle(data.postTitle);
                setContent(data.postContents);
                setImageUrl(data.postImage);
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


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && postId) {
            const formData = new FormData();
            formData.append('postImage', file);

            try {
                const response = await axios({
                    method: 'put',
                    url: `http://localhost:3001/api/posts/${postId}`,
                    data: formData,
                    withCredentials: true,
                });

                if (response.status !== 200) {
                    throw new Error('Failed to upload image');
                }
                const result = response.data;
                setImageUrl(result.profileimg);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            }
        }
    };



    // 이미지수정
    // const handleImageUpload = async (event) => {
    //     const file = event.target.files[0];
    //     if (!file) {
    //         alert('Please select a file.');
    //         return;
    //     }
    //
    //     const formData = new FormData();
    //     formData.append('postImage', file);
    //
    //     try {
    //         setUploading(true);
    //         const response = await axios.post(`http://localhost:3001/api/posts/${postId}/postimage`, formData);
    //         handleImageUrlChange(response.data.postImage);
    //         setUploading(false);
    //     } catch (error) {
    //         console.error('Failed to upload image:', error);
    //         alert(`Failed to upload image: ${error.response ? (error.response.data || error.response.statusText) : 'Server error'}`);
    //         setUploading(false);
    //     }
    // };





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
                postId={postId} // Pass postId here
                TitleValue={title}
                ContentValue={content}
                ImageUrlValue={imageUrl}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                onImageUrlChange={handleImageUrlChange}
                onSubmit={handleSubmit}
                onImageUpload={handleImageUpload}
                // isUploading={uploading}
            />
        </div>
    );
};

export default PostEditPage;
