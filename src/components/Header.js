import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header({ showBackButton, showUserProfile }) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const defaultProfileImage = "https://lh3.google.com/u/0/d/1ra2p2F4dl1ITC1r3M2ORKyqjt-O00EgE=w3024-h1714-iv2";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/accounts', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                if (!data.users || !Array.isArray(data.users)) {
                    console.error('Invalid or missing user data');
                    return;
                }
                if (!userId) {
                    console.error('userId cookie is not set');
                    return;
                }
                const user = data.users.find(u => u.userId.toString() === userId);
                if (user) {
                    setProfileImage(user.profileimg || defaultProfileImage);
                } else {
                    setProfileImage(defaultProfileImage);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setProfileImage(defaultProfileImage); // 기본 이미지 설정
            }
        };

        fetchUserData();
    }, [userId]);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.UserProfile')) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleBackButtonClick = () => {
        navigate(-1);
    };

    const goToMainPage = () => {
        navigate('/');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                console.log('Logout successful');
                window.location.href = '/';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="Header">
            <div className="HeaderContent">
                <div className="HeaderEmptyBox">
                    {showBackButton && <button className="BackBtn" onClick={handleBackButtonClick}>〈</button>}
                </div>
                <div className="HeaderText" onClick={goToMainPage}>
                    <span role="img" aria-label="avocado">🥑</span> AvoWorld
                </div>
                <div className="HeaderEmptyBox">
                    {showUserProfile && (
                        <div className="UserProfile" onClick={toggleDropdown}>
                            <img src={profileImage || defaultProfileImage} alt="User Profile" className="UserProfile"/>
                            <div id="myDropdown" className={`dropdown-content ${isDropdownVisible ? 'show' : ''}`}>
                                <a href={userId ? `/profile/edit/${userId}` : '#'}>회원정보 수정</a>
                                <a href={userId ? `/users/${userId}/password` : '#'}>비밀번호 수정</a>
                                <a href="/" onClick={handleLogout}>로그아웃</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
