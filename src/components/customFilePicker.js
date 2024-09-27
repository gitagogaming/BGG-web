import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Button, Row, Col, FormControl, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons';


import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

// import filterItems from './FilterItems';

import CldAlbum from './CldAlbum';

// import { useImageContext } from '../context/ImageContext';
import LocalAlbum from './LocalAlbum';

// Issues:
// 1. Seems to be a few 'events' triggering when loading homepage with filtering items

// Questions:
// 1. This can now do local uploads and cloudinary uploads depending on if we set upload type..
// - Question is, how can we still use the upload cloudinary widget in the same way as this component?

const CustomFilePicker = ({ onSelect }) => {

    // <ImageContext.Provider value={{ photos, loading, filteredPhotos, filterItems }}>
    // const { filteredPhotos, filterItems } = useImageContext();

    // useEffect(() => {
    //     setItems(filteredPhotos);
    // }, [filterItems]);

    const [show, setShow] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    // const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [uploadType, setUploadType] = useState('local'); // cloud or local
    const [cloudImages, setCloudImages] = useState([]);


    // Cloudinary Setup
    // const [showAlbum, setShowAlbum] = useState(false);
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

    // const cld = new Cloudinary({
    //     cloud: {
    //         cloudName
    //     }
    // });

    // const myImage = cld.image(publicId);


    useEffect(() => {
        console.log("PublicID changed:", publicId);
    }, [publicId]);


    useEffect(() => {
        console.log("Cloud Images:", cloudImages);
    }, [cloudImages]);



    // useEffect(() => {
    //     fetchItems();
    // }, []);

    // useEffect(() => {
    //     if (uploadType === 'cloud' && cloudImages.length > 0) {
    //         filterItems({ currentPath, searchQuery, items: cloudImages });
    //     } else if (uploadType === 'local') {
    //         console.log('Filtering items for path:', currentPath, 'and query:', searchQuery);
    //         if (allItems.length > 0) {
    //             filterItems({ currentPath, searchQuery, items: allItems });
    //         }

    //     }

    // }, [searchQuery, currentPath]);

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
                // filterItems({ currentPath, searchQuery, items: normalizedData, setItems });
            })
            .catch(error => console.error('Error fetching items:', error));
    };





    // const filterItems = (path, query, items = allItems) => {
    //     console.log('Filtering items for path:', path, 'and query:', query);
    //     let filteredItems;

    //     if (query) {
    //         // Filter items based on search query
    //         filteredItems = items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    //     } else {
    //         // Filter items based on current path
    //         filteredItems = items.filter(item => {
    //             const itemPath = item.path || '';
    //             return itemPath.startsWith(path) && itemPath.split('/').length === path.split('/').length + 1;
    //         });
    //     }

    //     // Sort items so folders appear at the top
    //     filteredItems.sort((a, b) => {
    //         if (a.type === 'folder' && b.type !== 'folder') return -1;
    //         if (a.type !== 'folder' && b.type === 'folder') return 1;
    //         return a.name.localeCompare(b.name);
    //     });

    //     console.log('Filtered items:', filteredItems);
    //     setItems(filteredItems);
    // };


    const handleShow = () => {
        fetchItems();
        setShow(true)
    };


    const handleClose = () => setShow(false);


    const handleSelect = (item) => {
        if (item.type === 'folder') {
            console.log(`Current path: ${currentPath}/${item.name}`);
            setCurrentPath(`${currentPath}/${item.name}`);
        } else {
            //  this is selecting the iamge from the custom file selector(photo album
            onSelect(`/uploads/teamLogos${item.path}`);
            handleClose();
        }
    };


    const handleBack = () => {
        const pathParts = currentPath.split('/').filter(Boolean);
        pathParts.pop();
        setCurrentPath(pathParts.join('/'));
    };


    // const handleSearchChange = (e) => {
    //     setSearchQuery(e.target.value);
    // };


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Uploading file:", file);
            const formData = new FormData();
            formData.append('teamLogo', file); // Ensure the field name matches the backend
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
            {/*  displaying the albumb just wont work.. im getting errors about possible exports :default ? */}

            {/* <div>
                <button onClick={() => setShowAlbum(true)}>Show Album</button>
                {showAlbum && (
                    <div className="modal">
                        <button onClick={() => setShowAlbum(false)}>Close</button>
                        <CldAlbum tag="esports" />
                    </div>
                )}
            </div> */}

            {/* <AdvancedImage cldImg={myImage} /> */}

            <Button id="filePickerButton" variant="secondary" onClick={handleShow} className="d-none">
                Select Image
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select an Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    {/* <FormControl
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="mb-3"
                    /> */}
                    {currentPath && (
                        <Button variant="link" onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    <Row className="justify-content-center">
                        {uploadType === 'cloud' ? (
                            <CldAlbum
                                key={publicId}
                                // tag="esports"
                                folderName="BGGTOOL_LOGOS"
                                publicId={publicId}
                                setCloudImages={setCloudImages}
                                onClick={handleSelect}
                                

                            />
                        ) : (
                            <LocalAlbum items={allItems} handleSelect={handleSelect} />
                            // <>
                            // {items.map((item, index) => (
                            //     <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                            //         <div className="image-item" onClick={() => handleSelect(item)} style={{ cursor: 'pointer' }}>
                            //             {item.type === 'folder' ? (
                            //                 <div className="folder-icon text-center">
                            //                     <FontAwesomeIcon icon={faFolderOpen} size="4x" />
                            //                     <p className="text-center text-ellipsis">{item.name}</p>
                            //                 </div>
                            //             ) : (
                            //                 <div>
                            //                     <img src={`/uploads/teamLogos${item.path}`} alt={`Image ${index + 1}`} className="filepicker-imageSize" />
                            //                     <p className="text-center text-ellipsis">{item.name}</p>
                            //                 </div>
                            //             )}
                            //         </div>
                            //     </Col>
                            // ))}
                            // </>
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
                                        {/* <Button variant="danger" onClick={handleClose}>
                                        Close
                                    </Button> */}
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