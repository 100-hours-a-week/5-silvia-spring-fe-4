import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as PostComponents from './PostComponents';

const PostCard = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch posts data
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/posts');
                const postsData = await response.json();
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        // Fetch users data
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/accounts');
                const usersData = await response.json();
                setUsers(usersData.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchPosts();
        fetchUsers();
    }, []);

    const navigateToPost = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className="PostCardsContainer" style={{ cursor: 'pointer' }}>
            {Object.keys(posts).map((postId) => {
                const post = posts[postId];
                const { authorId, postTitle, views, likes, comments, date } = post;
                const commentCount = comments.length;
                const likeCommentViewsStr = `좋아요 ${likes} 댓글 ${commentCount} 조회수 ${views}`;

                const author = users.find(user => user.userId === authorId);
                const authorName = author ? author.nickname : 'Unknown';
                const authorImage = author ? author.profileimg : 'default-image-url'; // default image URL

                return (
                    <div key={postId} className="PostCard" onClick={() => navigateToPost(postId)}>
                        <div className="PostCardTopArea">
                            <PostComponents.PostTitle postTitle={postTitle} />
                            <div className="PostCardMeta">
                                <p className="PostCardDetail">{likeCommentViewsStr}</p>
                                <PostComponents.Date date={date} />
                            </div>
                        </div>
                        <div className="PostCardLine"></div>
                        <div className="PostCardBottomArea">
                            <PostComponents.AuthorIcon AuthorImg={authorImage} />
                            <PostComponents.AuthorName AuthorName={authorName} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PostCard;
