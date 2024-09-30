// ImageFileSelector component that displays the image and calls the onClick handler when clicked
import React from 'react';

const ImageFileSelector = ({ logoURL, onClick }) => {
    const defaultLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/271px-Picture_icon_BLACK.svg.png";

    return (
        <img
            src={logoURL || defaultLogoUrl} 
            alt="Team Logo"
            className="image-preview"
            style = {{cursor: 'pointer'}} 
            onClick={onClick} 
        />
    );
};

export default ImageFileSelector;
