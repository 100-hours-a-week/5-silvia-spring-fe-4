import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as PostComponents from './PostComponents';
import SearchBar from './SearchBar';
import * as Buttons from '../components/Buttons';
import { SlCalender } from "react-icons/sl";
import { IoPersonOutline } from "react-icons/io5";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PostCard = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 3;

    const navigate = useNavigate();
    const createClick = () => {
        navigate('/post/create');
        notify("새 게시글 작성 페이지로 이동했습니다.");
    };

    const notify = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });

    const iconStyle = {
        color: '#96A98B',
        margin: '0px 10px 0px 25px',
        fontSize: '14px',
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/posts');
                const postsData = await response.json();
                const postsArray = Object.keys(postsData).map(key => ({
                    postId: key,
                    ...postsData[key]
                }));
                setPosts(postsArray);
                setFilteredPosts(postsArray);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

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

    useEffect(() => {
        const filtered = posts.filter(post =>
            post.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [searchTerm, posts]);

    const navigateToPost = (postId) => {
        navigate(`/post/${postId}`);
    };

    const truncateContent = (content, length) => {
        if (content.length <= length) {
            return content;
        }
        return content.substring(0, length) + '...';
    };

    const handleShare = (postId) => {
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postUrl).then(() => {
            notify('🥑 게시글 주소가 복사되었습니다.');
        }).catch(err => {
            console.error('Error copying to clipboard', err);
        });
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => {
            const maxPage = Math.ceil(filteredPosts.length / postsPerPage);
            return Math.min(prevPage + 1, maxPage);
        });
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div>
            <div className="SearchContainer">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <Buttons.CreateBtn
                    label="게시글 작성"
                    onClick={createClick}
                />
            </div>
            <div className="PostCardsContainer">
                {currentPosts.map((post) => {
                    const { postId, authorId, postTitle, postContents, postImage, likes, comments, date } = post;
                    const formattedDate = date.split(' ')[0];
                    const commentCount = comments.length;

                    const author = users.find(user => user.userId === authorId);
                    const authorName = author ? author.nickname : 'Unknown';

                    return (
                        <div key={postId} className="PostCard">
                            <div className="postCardContent">
                                <div className="postCardImgPreviewContainer">
                                    <div className="postCardImgPreview">
                                        <img src={postImage} alt="CardPreview"/>
                                    </div>
                                </div>
                                <div className="postCardDetails">
                                    <div className="PostCardMeta">
                                        <div className="postCardMetaContent">
                                            <SlCalender style={iconStyle}/>
                                            <p>{formattedDate}</p>
                                            <IoPersonOutline style={iconStyle}/>
                                            <p>{authorName}</p>
                                            <BiCommentDetail style={iconStyle}/>
                                            <p>{commentCount}</p>
                                            <FaRegHeart style={iconStyle}/>
                                            <p>{likes}</p>
                                        </div>
                                    </div>
                                    <div className="PostCardTopArea">
                                        <PostComponents.PostTitle postTitle={postTitle}/>
                                        <div className="postCardContentPreview">
                                            <p>{truncateContent(postContents, 80)}</p>
                                        </div>
                                    </div>
                                    <div className="postCardBottomArea">
                                        <div
                                            className="navigateButton"
                                            onClick={() => navigateToPost(postId)}
                                        >
                                            자세히 보기
                                        </div>
                                        <div className="postCardShareBtn" onClick={() => handleShare(postId)}>
                                            <img src='https://lh3.google.com/u/0/d/1GqffKqgSitn0exrg2f_3D1EV55dUq4AP=w2612-h1714-iv1' alt='Share'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="Pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="arrowButton">
                    <FaArrowLeft />
                </button>
                <div className="dots">
                    {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
                        <span
                            key={index}
                            className={`dot ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                        />
                    ))}
                </div>
                <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)} className="arrowButton">
                    <FaArrowRight />
                </button>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default PostCard;
