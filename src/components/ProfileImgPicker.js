import React, { useRef } from 'react';

const ProfileImgPicker = ({ userId, onImageUrlChange }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('profileimg', selectedFile);

                const response = await fetch(`http://localhost:3001/api/accounts/${userId}/profileimg`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }
                const result = await response.json();
                onImageUrlChange(result.imageUrl); // Assuming the server sends back the URL of the image
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <div className="profile-img-picker">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <button type="button" onClick={handleButtonClick}  className="ProfileImgInput">
                    Upload Image
                </button>
            </div>
        </>
    );
};

export default ProfileImgPicker;
