import React, { useEffect, useState } from 'react';
import { Col, Row, ListGroup, ButtonGroup, Button, OverlayTrigger, Tooltip, FormControl } from 'react-bootstrap';
import CldImage from '../components/CldImage';

const CldAlbum = ({ tag = 'esports', folderName = 'BGGTOOL_LOGOS', publicId, handleSelect }) => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (publicId) {
      // Check if the publicId is not already in the photos array
      const isNewUpload = !photos.some(photo => photo.public_id === publicId);

      if (isNewUpload) {
        // Create a new photo object
        const newPhoto = {
          public_id: publicId,
          format: 'unknown', // we need to adjust info coming from upload widget to include...
          width: 0, // we need to adjust info coming from upload widget to include...
          height: 0, // we need to adjust info coming from upload widget to include...
          bytes: 0 // we need to adjust info coming from upload widget to include...
        };

        // Add the new photo to the photos array
        setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
        setFilteredPhotos(prevFiltered => [newPhoto, ...prevFiltered]);
      }
    }
  }, [publicId, photos]);

  const getData = async () => {
    console.log("Public ID changed, why aren't we fetching new data?", publicId);
    try {
      const response = await fetch(`/api/fetchImages?folderName=${folderName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      console.log("We fetched... getData", data);

      setPhotos(data);
      setFilteredPhotos(data); // Initialize filteredPhotos
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const filterPhotos = () => {
      if (searchQuery) {
        const filtered = photos.filter(photo => photo.public_id.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredPhotos(filtered);
      } else {
        setFilteredPhotos(photos);
      }
    };

    filterPhotos();
  }, [searchQuery, photos]);

  const handleViewChange = (newView) => {
    console.log("New view:", newView);
    setView(newView);
  };

  if (loading) {
    return <p>Loading gallery...</p>;
  }

  if (filteredPhotos.length === 0) {
    return <p>No photos to display.</p>;
  }

  return (
    <div>
      {/* Search Box */}
      <FormControl
        type="text"
        placeholder="Search by filename"
        className="mb-3 w-25"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* View Selection Buttons */}
      <ButtonGroup aria-label="View Toggle" className="mb-3" size="sm">
        <Button variant={view === 'card' ? 'primary' : 'outline-primary'} onClick={() => handleViewChange('card')}>Card View</Button>
        <Button variant={view === 'list' ? 'primary' : 'outline-primary'} onClick={() => handleViewChange('list')}>List View</Button>
      </ButtonGroup>

      {/* Render the selected view */}
      <Row>
        {view === 'card' && filteredPhotos.map((photo) => (
          <Col key={photo.public_id} xs={6} md={4} lg={3} className="mb-3">
            <div className="card-view">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-${photo.public_id}`}>
                  <p className="m-0 text-left"> {photo.public_id.split('/').pop()}</p>
                  <p className="m-0 text-left"><strong>Size:</strong> {photo.bytes} bytes</p>
                  <p className="m-0 text-left"><strong>Format:</strong> {photo.format}</p>
                  <p className="m-0 text-left"><strong>Resolution:</strong> {photo.width}x{photo.height}</p>
                </Tooltip>}
              >
                <div style={{ cursor: 'pointer' }}>
                  <CldImage
                    publicId={photo.public_id}
                    classNames="filepicker-imageSize"
                    onClick={() => handleSelect(photo)}
                  />
                </div>
              </OverlayTrigger>
            </div>
          </Col>
        ))}

        {view === 'list' && (
          <ListGroup>
            {filteredPhotos.map((photo) => (
              <ListGroup.Item key={photo.public_id}>
                <Row>
                  <Col xs={4} md={3} className="d-flex justify-content-center">
                    <CldImage
                      publicId={photo.public_id}
                      classNames="filepicker-imageSize-list"
                      onClick={() => handleSelect(photo)}
                    />
                  </Col>
                  <Col xs={8} md={9}>
                    <div className="file-details">
                      <p className="m-0"><strong>Filename:</strong> {photo.public_id.split('/').pop()}</p>
                      <p className="m-0">
                        <strong>Size:</strong> {photo.size_bytes < 1048576
                          ? (photo.size_bytes / 1024).toFixed(2) + ' KB'
                          : (photo.size_bytes / 1048576).toFixed(2) + ' MB'}
                      </p>
                      <p className="m-0"><strong>Format:</strong> {photo.format}</p>
                      <p className="m-0"><strong>Resolution:</strong> {photo.width}x{photo.height}</p>
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Row>
    </div>
  );
};

export default CldAlbum;