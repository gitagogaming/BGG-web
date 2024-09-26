import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { AdvancedImage, placeholder } from '@cloudinary/react';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddnp1mpva', // Replace with your Cloudinary cloud name
  },
});

const CldImage = ({ publicId }) => {
  const myImage = cld
    .image(publicId)
    .resize(thumbnail().width(300).height(300).gravity(autoGravity()))
    .delivery(format('auto'))
    .delivery(quality('auto'));
  return (
    <AdvancedImage
      cldImg={myImage}
      style={{ maxWidth: '100%' }}
      plugins={[placeholder()]}
      className="rounded-lg shadow-lg"
    />
  );
};

const CloudinaryGallery = () => {
  const publicId = 'ANSON_ovqgst'; // Replace with your public ID

  return (
    <div>
      <h1>Cloudinary Image Example</h1>
      <CldImage publicId={publicId} />
    </div>
  );
};

export default CloudinaryGallery;