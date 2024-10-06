import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import CldAlbum from '../CldAlbum';
import LocalAlbum from '../LocalAlbum';

// Issues:
// 1. Seems to be a few 'events' triggering when loading homepage with filtering items

// Questions:
// 1. This can now do local uploads and cloudinary uploads depending on if we set upload type..
// - Question is, how can we still use the upload cloudinary widget in the same way as this component?

const CustomFilePicker = ({ onSelect, team, buttonID }) => {
    const [show, setShow] = useState(false);
    const [allItems, setAllItems] = useState([]);
    const [uploadType, setUploadType] = useState('local'); // cloud or local
    const [cloudImages, setCloudImages] = useState([]);
    

    // Cloudinary Setup
    const [publicId, setPublicId] = useState("");
    const [cloudName] = useState("ddnp1mpva");
    const [uploadPreset] = useState("bgg-logos");
    const [uwConfig] = useState({
        cloudName,
        uploadPreset,
        cropping: true, //add a cropping step - even if we add cropping the ORIGINAL image is uploaded
        // - I think we have to get the cropped frame and then size it based on that later im not even sure yet

        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        sources: ["local", "url", "google_drive", "dropbox"], // restrict the upload sources to URL and local files
        // multiple: false,  //restrict upload to a single file
        // folder: "user_images", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        clientAllowedFormats: ["image"], //restrict uploading to image files only
        maxImageFileSize: 2500000,  //restrict file size to less than 2MB
        // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
        // theme: "purple", //change to a purple theme
    });


    // useEffect(() => {
    //     console.log("PublicID changed:", publicId);
    // }, [publicId]);

    // useEffect(() => {
    //     console.log("Cloud Images:", cloudImages);
    // }, [cloudImages]);


    const fetchItems = () => {
        fetch('http://localhost:8080/api/images')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched items:', data); // Log the filenames and folders
                // Normalize paths to use forward slashes
                const normalizedData = data.map(item => ({
                    ...item,
                    path: item.path.replace(/\\/g, '/')
                }));
                setAllItems(normalizedData);
            })
            .catch(error => console.error('Error fetching items:', error));
    };


    // Everytime user clicks on the image picker button we fetch the local uploads
    const handleShow = () => {
        fetchItems();
        setShow(true)
    };


    const handleClose = () => setShow(false);



    const handleSelect = (item) => {
        // Firing off the Onselect to trigger the image to be set in the parent component
        if (uploadType === 'local') {
            onSelect(`/uploads/teamLogos${item.path}`);
            handleClose();

        } else if (uploadType === 'cloud') {
            onSelect(item.url);
            handleClose();
        }
    
    }



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Uploading file:", file);
            const formData = new FormData();
            formData.append('teamLogo', file);
            formData.append('name', file.name);

            // setting a var for cloudinary folder
            formData.append('folder', 'BGGTOOL-LOGOS');

            let uploadEndpoint = null
            //  we can upload to local as well by jus tusing :8080/upload
            try {
                if (uploadType === 'cloud') {
                    uploadEndpoint = 'http://localhost:8080/api/uploadImage';
                } else if (uploadType === 'local') {
                    uploadEndpoint = 'http://localhost:8080/upload';
                }
                const response = await fetch(uploadEndpoint, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('File uploaded successfully:', data);
                    fetchItems(); // Refresh the items list
                } else {
                    console.error('Error uploading file:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <>
            <Button 
                id={buttonID}
                variant="secondary"
                onClick={handleShow}
                className="d-none">
                Select Image
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select an Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    <Row className="justify-content-center">
                        {uploadType === 'cloud' ? (
                            <CldAlbum
                                key={publicId}
                                // tag="esports"
                                folderName="BGGTOOL_LOGOS"
                                publicId={publicId}
                                setCloudImages={setCloudImages}
                                handleSelect={handleSelect}
                            />
                        ) : (
                            <LocalAlbum 
                                items={allItems}
                                handleSelect={handleSelect} />
                        )}

                    </Row>
                </Modal.Body>
                <Modal.Footer className="bg-dark">
                    <Row className="w-100">
                        <Col>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <ButtonGroup size='sm'>
                                        <Button
                                            variant={uploadType === 'cloud' ? 'primary' : 'secondary'}
                                            onClick={() => setUploadType('cloud')}
                                        >
                                            Use Cloudinary
                                        </Button>
                                        <Button
                                            variant={uploadType === 'local' ? 'primary' : 'secondary'}
                                            onClick={() => setUploadType('local')}
                                        >
                                            Use Local
                                        </Button>
                                    </ButtonGroup>
                                </div>
                                <div>
                                    <ButtonGroup size="sm">
                                        {uploadType === 'cloud' ? (
                                            <CloudinaryUploadWidget
                                                uwConfig={uwConfig}
                                                setPublicId={setPublicId}
                                                variant="outline-light"
                                            />
                                        ) : (
                                            <>
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileUpload}
                                                />
                                                <Button variant="outline-light" onClick={() => document.getElementById('fileUpload').click()}>
                                                    <FontAwesomeIcon icon={faFile} className="pr-2" />
                                                    Upload to Local
                                                </Button>
                                            </>
                                        )}

                                    </ButtonGroup>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CustomFilePicker;