import React from 'react';
// import LoginForm from "../components/LoginForm";
// import SubmitBtn from "../components/Buttons";
import PostCard from "../components/PostCard";
import { useNavigate } from 'react-router-dom';
import * as Buttons  from '../components/Buttons';


const MainPage = () => {
    const navigate = useNavigate();
    const creteClick = () => {
        navigate('/post/create');
    };
    return (
        <div className="MainPage">
            <div className="WelcomeMessage">
                <p>안녕하세요,</p>
                <p>아무 말 대잔치 <span style={{ fontWeight: 700 }}>게시판</span> 입니다.</p>
            </div>
            <div className="SubmitBtnContainer">
                <Buttons.CreateBtn
                    label="게시글 작성"
                    onClick={creteClick}
                />
            </div>
            <PostCard />
        </div>
    );
};

export default MainPage;