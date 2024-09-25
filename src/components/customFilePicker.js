import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const CustomFilePicker = ({ onSelect }) => {
    const [show, setShow] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        filterItems(currentPath, searchQuery);
    }, [currentPath, allItems, searchQuery]);

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
                filterItems(currentPath, searchQuery, normalizedData);
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    const filterItems = (path, query, items = allItems) => {
        console.log('Filtering items for path:', path, 'and query:', query);
        let filteredItems;

        if (query) {
            // Filter items based on search query
            filteredItems = items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        } else {
            // Filter items based on current path
            filteredItems = items.filter(item => {
                const itemPath = item.path || '';
                return itemPath.startsWith(path) && itemPath.split('/').length === path.split('/').length + 1;
            });
        }

        // Sort items so folders appear at the top
        filteredItems.sort((a, b) => {
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            return a.name.localeCompare(b.name);
        });

        console.log('Filtered items:', filteredItems);
        setItems(filteredItems);
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleSelect = (item) => {
        if (item.type === 'folder') {
            setCurrentPath(`${currentPath}/${item.name}`);
        } else {
            onSelect(`/uploads/teamLogos${item.path}`);
            handleClose();
        }
    };

    const handleBack = () => {
        const pathParts = currentPath.split('/').filter(Boolean);
        pathParts.pop();
        setCurrentPath(pathParts.join('/'));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Uploading file:", file);
            const formData = new FormData();
            formData.append('teamLogo', file); // Ensure the field name matches the backend
            formData.append('path', currentPath);
            formData.append('name', file.name);

            try {
                const response = await fetch('http://localhost:8080/upload', {
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
            <Button id="filePickerButton" variant="secondary" onClick={handleShow} className="d-none">
                Select Image
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select an Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ml-5 custom-modal-body">
                    <FormControl
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="mb-3"
                    />
                    {currentPath && (
                        <Button variant="link" onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    <Row className="justify-content-center">
                        {items.map((item, index) => (
                            <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                                <div className="image-item" onClick={() => handleSelect(item)} style={{ cursor: 'pointer' }}>
                                    {item.type === 'folder' ? (
                                        <div className="folder-icon text-center">
                                            <FontAwesomeIcon icon={faFolder} size="4x" />
                                            <p className="text-center text-ellipsis">{item.name}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <img src={`/uploads/teamLogos${item.path}`} alt={`Image ${index + 1}`} className="filepicker-imageSize" />
                                            <p className="text-center text-ellipsis">{item.name}</p>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <input
                        type="file"
                        id="fileUpload"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                    <Button variant="primary" onClick={() => document.getElementById('fileUpload').click()}>
                        Upload
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CustomFilePicker;