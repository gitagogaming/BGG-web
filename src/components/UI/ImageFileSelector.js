import React, { useState } from 'react';

const ImageFileSelector = ({ logoURL, onClick }) => {
    const [isError, setIsError] = useState(false);
    const defaultLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/271px-Picture_icon_BLACK.svg.png";

    const handleError = () => {
        setIsError(true);
    };

    return (
        <img
            src={isError ? defaultLogoUrl : logoURL || defaultLogoUrl}
            alt="TeamLogo"
            className="image-preview"
            style={{ cursor: 'pointer' }}
            onClick={onClick}
            onError={handleError}
        />
    );
};

export default ImageFileSelector;