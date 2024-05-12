import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as PostComponents from '../components/PostComponents';
import * as Buttons from '../components/Buttons';
import Modal from '../components/Modal';
import axios from 'axios';

// Utility function to get cookie value by name
const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const userId = getCookieValue('userId'); // Get userId from cookies

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await fetch(`http://localhost:3001/api/posts/${postId}`);
                if (!postResponse.ok) {
                    throw new Error('Failed to fetch post data');
                }
                const postData = await postResponse.json();
                setPost(postData);

                // Fetch users data
                const usersResponse = await fetch('http://localhost:3001/api/accounts');
                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch users data');
                }
                const usersData = await usersResponse.json();
                setUsers(usersData.users);

                // Increment the view count
                await axios.put(`http://localhost:3001/api/posts/${postId}/views`);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    const handleEdit = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/posts/${postId}/checkEditPermission`, {
                withCredentials: true
            });

            if (response.status === 200) {
                navigate(`/post/edit/${postId}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert('수정 권한이 없습니다');
            } else {
                console.error('Error checking edit permission:', error);
                alert('권한 확인 중 오류가 발생했습니다.');
            }
        }
    };

    const showModal = (commentId = null) => {
        setIsModalVisible(true);
        document.body.style.overflow = 'hidden';
        setCommentToDelete(commentId);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        document.body.style.overflow = 'auto';
        setCommentToDelete(null);
    };

    const confirmDelete = async () => {
        try {
            if (commentToDelete) {
                // Deleting a comment
                const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments/${commentToDelete}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        alert('댓글 삭제 권한이 없습니다.');
                    } else {
                        throw new Error('Failed to delete comment');
                    }
                } else {
                    setPost(prevPost => ({
                        ...prevPost,
                        comments: prevPost.comments.filter(comment => comment.commentId !== commentToDelete)
                    }));
                    alert('댓글이 삭제되었습니다.');
                }
            } else {
                // Deleting a post
                const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        alert('게시글 삭제 권한이 없습니다.');
                    } else {
                        throw new Error('Failed to delete post');
                    }
                } else {
                    alert('게시글이 삭제되었습니다.');
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            closeModal();
        }
    };

    function formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + "M";
        } else if (views >= 100000) {
            return (views / 1000).toFixed(0) + "k";
        } else if (views >= 10000) {
            return (views / 1000).toFixed(1) + "k";
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + "k";
        } else {
            return views.toString();
        }
    }

    // Ensure post.authorId is defined before converting to string
    const author = users.find(u => u.userId === (post.authorId ? post.authorId.toString() : ''));

    // Merge comment data with user data
    const commentsWithUserData = post.comments.map(comment => {
        const user = users.find(u => u.userId === (comment.commenterId ? comment.commenterId.toString() : ''));
        return {
            ...comment,
            commenter: user ? user.nickname : comment.commenter,
            commenterImage: user ? user.profileimg : comment.commenterImage,
        };
    });

    return (
        <div className="PostPage">
            <div className="Post">
                <div className="PostMetaData">
                    <div className="PostMetaDataInner">
                        <PostComponents.PostTitle postTitle={post.postTitle} />
                        <div className="PostSubContainer">
                            <div className="PostSubContainerLeft">
                                <PostComponents.AuthorIcon AuthorImg={author ? author.profileimg : ''} />
                                <PostComponents.AuthorName AuthorName={author ? author.nickname : ''} />
                                <div className="PostDateContainer">
                                    <PostComponents.Date date={post.date} />
                                </div>
                            </div>
                            <div className="PostBtnContainer">
                                <Buttons.PostBtn label="수정" onClick={handleEdit} />
                                <Buttons.PostBtn label="삭제" onClick={() => showModal()} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="PostBody">
                    <PostComponents.PostImage PostImg={post.postImage} />
                    <PostComponents.PostContent label={post.postContents} />
                </div>
                <div className="PostCountContainer">
                    <PostComponents.PostCount num={formatViews(post.views)} label="조회수" />
                    <PostComponents.PostCount num={formatViews(post.comments.length)} label="댓글" />
                </div>
            </div>
            <div className="CommentForm">
                <div className="CommentInputContainer">
                    <textarea
                        type="text"
                        className="CommentInput"
                        placeholder="댓글을 남겨주세요!"
                    ></textarea>
                </div>
                <hr />
                <div className="CommentBtnContainer">
                    <Buttons.CreateBtn label="댓글 등록" style={{ marginRight: '18px' }} />
                </div>
            </div>
            <div className="CommentsArea">
                {commentsWithUserData.map((comment) => (
                    <div key={comment.commentId} className="Comment">
                        <div className="CommentTopArea">
                            <div className="CommentAuthor">
                                <img src={comment.commenterImage} alt="Author" className="AuthorIcon" />
                                <div className="CommenterName">{comment.commenter}</div>
                                <div className="CommentDateContainer">{comment.commentDate}</div>
                            </div>
                            {comment.commenterId && comment.commenterId.toString() === userId && (
                                <div className="CommentBtn">
                                    <Buttons.PostBtn label="수정" />
                                    <Buttons.PostBtn label="삭제" onClick={() => showModal(comment.commentId)} />
                                </div>
                            )}
                        </div>
                        <div className="CommentContent">{comment.commentText}</div>
                    </div>
                ))}
            </div>
            <Modal
                isVisible={isModalVisible}
                ModalLabel={commentToDelete ? "댓글을 삭제하시겠습니까?" : "게시글을 삭제하시겠습니까?"}
                ModalContent={commentToDelete ? "삭제한 댓글은 복구할 수 없습니다." : "삭제한 게시글은 복구할 수 없습니다."}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default PostPage;
