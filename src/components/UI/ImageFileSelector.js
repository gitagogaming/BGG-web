import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ImageFileSelector = ({ logoURL, onClick }) => {
    const [isError, setIsError] = useState(false);
    const defaultLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/271px-Picture_icon_BLACK.svg.png";

    const handleError = () => {
        setIsError(true);
    };

    const renderTooltip = (props) => (
        <Tooltip id="image-tooltip" {...props}>
            <img
                src={isError ? defaultLogoUrl : logoURL || defaultLogoUrl}
                alt="TeamLogo"
                style={{ width: '150px', height: '150px' }}
            />
            <div className="text-center text-ellipsis" style={{ direction: 'rtl'}}>
                {/* {logoURL.split('/').pop()} */}
                {logoURL}
            </div>
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 750, hide: 100 }}
            overlay={renderTooltip}
        >
            <img
                src={isError ? defaultLogoUrl : logoURL || defaultLogoUrl}
                alt="TeamLogo"
                className="image-preview"
                style={{ cursor: 'pointer' }}
                onClick={onClick}
                onError={handleError}
            />
        </OverlayTrigger>
    );
};

export default ImageFileSelector;




// // ImageFileSelector component that displays the image and calls the onClick handler when clicked
// import React from 'react';

// const ImageFileSelector = ({ logoURL, onClick}) => {
//     const defaultLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/271px-Picture_icon_BLACK.svg.png";

//     return (
        
//         <img
//             // key = {team}
//             src={logoURL || defaultLogoUrl} 
//             alt={`TeamLogo`}
//             className="image-preview"
//             style = {{cursor: 'pointer'}} 
//             onClick={onClick} 
//         />
//     );
// };

// export default ImageFileSelector;
