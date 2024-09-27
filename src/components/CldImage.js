import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail, scale, fill, fit, crop } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { AdvancedImage, placeholder } from '@cloudinary/react';



const getResizeAction = (resizeType, width, height) => {
  switch (resizeType) {
    case 'thumbnail':
      return thumbnail().width(width).height(height).gravity(autoGravity());
    case 'scale':
      return scale().width(width).height(height);
    case 'fill':
      return fill().width(width).height(height).gravity(autoGravity());
    case 'fit':
      return fit().width(width).height(height);
    case 'crop':
      return crop().width(width).height(height).gravity(autoGravity());
    default:
      return thumbnail().width(width).height(height).gravity(autoGravity());
  }
};

// eslint-disable-next-line react/prop-types
const CldImage = ({ publicId, classNames, onClick, width = 300, height = 300, imgFormat = 'auto', imgQuality = 'auto', resizeType = 'thumbnail' }) => {
    
    // This will likely be passed down from the parent component
    const [cloudName, setCloudName] = useState('ddnp1mpva');

    const cld = new Cloudinary({
        cloud: {
          // cloudName: cloudName
          cloudName: cloudName // Uncomment this line if you want to use a hardcoded cloud name
        },
      });
      
  
  
    const resizeAction = getResizeAction(resizeType, width, height);

  const myImage = cld
    .image(publicId)
    .resize(resizeAction)
    .delivery(format(imgFormat))
    .delivery(quality(imgQuality));

  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <AdvancedImage
        cldImg={myImage}
        plugins={[placeholder()]}
        className={`rounded-lg ${classNames}`}
      />
    </div>
  );
};

export default CldImage;