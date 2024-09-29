import React, { useState, useEffect } from 'react';
import { Col, Row, FormControl, Button, InputGroup, ButtonGroup, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

const LocalAlbum = ({ items, handleSelect }) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [view, setView] = useState('list');

  const handleBack = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
  };

  useEffect(() => {
    const filterItems = () => {
      let filtered = items;

      // Filter items based on the current path
      if (currentPath) {
        filtered = filtered.filter(item => item.path.startsWith(currentPath) && item.path !== currentPath);
      }

      // Filter items based on the search query
      if (searchQuery) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // Sort items so folders come first
      filtered.sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return 0;
      });

      // Modify the last item to be the "Back" button if we're not at the root level
      if (currentPath) {
        const backFolder = {
          name: 'Back',
          path: '',
          type: 'folder',
          isBackFolder: true,
        };
        
        // Replace the last item with the back button
        if (filtered.length > 0) {
          filtered.unshift(backFolder);
        } else {
          filtered.unshift(backFolder); // In case there are no items, just add the back folder
        }
      }

      setFilteredItems(filtered);
    };

    filterItems();
  }, [searchQuery, currentPath, items]);

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      if (item.isBackFolder) {
        // If it's a back folder, go up one level
        handleBack();
      } else {
        // Otherwise, go into the folder and set the current path
        setCurrentPath(item.path);
      }
    } else {
      handleSelect(item);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div>
      {/* Enhanced Search Box */}
      <InputGroup className="mb-3 w-50">
        <InputGroup.Text id="search-icon">
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </InputGroup.Text>
        <FormControl
          type="text"
          placeholder="Search by name"
          aria-label="Search"
          aria-describedby="search-icon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ height: '30px' }}
        />
      </InputGroup>

      {/* View Selection Buttons */}
      <ButtonGroup aria-label="View Toggle" className="mb-3" size="sm">
        <Button variant={view === 'card' ? 'primary' : 'outline-primary'} onClick={() => handleViewChange('card')}>Card View</Button>
        <Button variant={view === 'list' ? 'primary' : 'outline-primary'} onClick={() => handleViewChange('list')}>List View</Button>
      </ButtonGroup>

      {/* Render the selected view */}
      <Row>
        {view === 'card' && filteredItems.map((item, index) => (
          <Col key={index} xs={6} md={4} lg={3} className="mb-3">
            <div className="card-view" onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
              {item.type === 'folder' ? (
                <div className="folder-icon text-center">
                  <FontAwesomeIcon icon={item.isBackFolder ? faArrowLeft : faFolderOpen} size="4x" />
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

        {view === 'list' && (
          <ListGroup>
            {filteredItems.map((item, index) => (
              <ListGroup.Item key={index} onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
                <Row>
                  <Col xs={4} md={3} className="d-flex justify-content-center">
                    {item.type === 'folder' ? (
                      <div className="folder-icon text-center">
                        <FontAwesomeIcon icon={item.isBackFolder ? faArrowLeft : faFolderOpen} size="4x" />
                      </div>
                    ) : (
                      <img src={`/uploads/teamLogos${item.path}`} alt={`Image ${index + 1}`} className="filepicker-imageSize-list" />
                    )}
                  </Col>
                  <Col xs={8} md={9}>
                    <div className="file-details">
                      <p className="m-0"><strong>Name:</strong> {item.name}</p>
                      {item.type !== 'folder' && (
                        <p className="m-0"><strong>Type:</strong> {item.type}</p>
                      )}
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

export default LocalAlbum;
