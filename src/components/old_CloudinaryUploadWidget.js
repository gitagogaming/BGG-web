import { useState, useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";



// https://cloudinary.com/documentation/upload_widget
// https://cloudinary.com/documentation/upload_widget_reference

export default function CloudinaryWidget() {
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("ddnp1mpva");
  const [uploadPreset] = useState("bgg-logos");

  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });

  const myImage = cld.image(publicId);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const myWidget = window.cloudinary.createUploadWidget({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        cropping: true,
        multiple: false,
        maxImageFileSize: 2500000, // Limiting to 2.5mb, I do not see any reason to ever have a larger file for team logos
        clientAllowedFormats: ["image"] // Restricting to only images since we are strictly doing logos
      }, (error, result) => {
        if (!error && result && result.event === "success") {
          console.log('File uploaded successfully:', result.info);
          setPublicId(result.info.public_id);
        }
      });

      document.getElementById("upload_widget").addEventListener("click", function () {
        myWidget.open();
      }, false);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [cloudName, uploadPreset]);

  return (
    <div className="CloudinaryWidget">
      <button id="upload_widget" className="cloudinary-button">
        Upload files
      </button>
      <p>
        <a
          href="https://cloudinary.com/documentation/upload_widget"
          target="_blank"
          rel="noopener noreferrer"
        >
          Upload Widget User Guide
        </a>
      </p>
      <p>
        <a
          href="https://cloudinary.com/documentation/upload_widget_reference"
          target="_blank"
          rel="noopener noreferrer"
        >
          Upload Widget Reference
        </a>
      </p>
      <div style={{ width: "800px" }}>
        <AdvancedImage
          style={{ maxWidth: "100%" }}
          cldImg={myImage}
          plugins={[responsive(), placeholder()]}
        />
      </div>
    </div>
  );
}




// - SEND TO BACKEND



// import { useState, useEffect } from "react";
// import { Cloudinary } from "@cloudinary/url-gen";
// import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

// export default function CloudinaryWidget() {
//   const [publicId, setPublicId] = useState("");
//   const [cloudName] = useState("ddnp1mpva");
//   const [uploadPreset] = useState("bgg-logos");

//   const cld = new Cloudinary({
//     cloud: {
//       cloudName
//     }
//   });

//   const myImage = cld.image(publicId);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
//     script.type = 'text/javascript';
//     script.async = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       const myWidget = window.cloudinary.createUploadWidget({
//         cloudName: cloudName,
//         uploadPreset: uploadPreset
//       }, (error, result) => {
//         if (!error && result && result.event === "success") {
//           console.log('File selected:', result.info);
//           // Send the file to the backend API
//           fetch('/api/uploadImage', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               file: result.info.secure_url,
//               folder: 'BGGTOOL_LOGOS' // Replace with your desired folder name
//             })
//           })
//           .then(response => response.json())
//           .then(data => {
//             console.log('File uploaded to backend:', data);
//             setPublicId(data.publicId);
//           })
//           .catch(error => {
//             console.error('Error uploading file to backend:', error);
//           });
//         }
//       });

//       document.getElementById("upload_widget").addEventListener("click", function () {
//         myWidget.open();
//       }, false);
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [cloudName, uploadPreset]);

//   return (
//     <div className="CloudinaryWidget">
//       <button id="upload_widget" className="cloudinary-button">
//         Upload files
//       </button>
//       <p>
//         <a
//           href="https://cloudinary.com/documentation/upload_widget"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Upload Widget User Guide
//         </a>
//       </p>
//       <p>
//         <a
//           href="https://cloudinary.com/documentation/upload_widget_reference"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Upload Widget Reference
//         </a>
//       </p>
//       <div style={{ width: "800px" }}>
//         <AdvancedImage
//           style={{ maxWidth: "100%" }}
//           cldImg={myImage}
//           plugins={[responsive(), placeholder()]}
//         />
//       </div>
//     </div>
//   );
// }