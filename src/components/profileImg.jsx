import React, { useState } from 'react';

const ProfileImageUpload = ({ onImageUpload }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        onImageUpload(file);
    };
    return (
        <div >
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {selectedImage && (
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '200px' }} />
            )}
        </div>
    );
};

export default ProfileImageUpload;
