import React, { useState, useEffect } from 'react';

const ProfileImgPicker = ({ userId, onImageUrlChange }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (userId) {
            // Fetch user data from the backend if userId is provided
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/accounts/${userId}`, {
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const data = await response.json();
                    const user = data.user;
                    if (user) {
                        setProfileImage(user.profileimg); // Assuming user.profileimg is the URL of the profile image
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        }
    }, [userId]);

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        onImageUrlChange(e.target.value);
    };

    const handleImageUrlSubmit = async () => {
        if (imageUrl) {
            try {
                if (userId) {
                    const response = await fetch(`http://localhost:3001/api/accounts/${userId}/profileimg`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ profileimg: imageUrl }),
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update profile image');
                    }
                }
                setProfileImage(imageUrl); // Update local state with the new image URL
                setImageUrl(''); // Clear the input field
            } catch (error) {
                console.error('Error updating profile image:', error);
            }
        }
    };

    return (
        <>
            <div className="profile-img-picker">
                <div
                    className="img-picker-button"
                    style={{
                        backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                </div>
            </div>
            <div className="profileImgUrlContainer">
                <input
                    type="text"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="이미지 URL 입력"
                />
                <button type="button" onClick={handleImageUrlSubmit}>
                    업로드
                </button>
            </div>
        </>
    );
};

export default ProfileImgPicker;
