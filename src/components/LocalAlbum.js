import React, { useState, useEffect } from 'react';
import { Col, Row, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

const LocalAlbum = ({ items, handleSelect }) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filterItems = () => {
      let filtered = items;
      if (searchQuery) {
        filtered = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      // Sort items so folders come first
      filtered.sort((a, b) => (a.type === 'folder' ? -1 : 1));
      setFilteredItems(filtered);
    };

    filterItems();
  }, [searchQuery, items]);

  return (
    <div>
      {/* Search Box */}
      <FormControl
        type="text"
        placeholder="Search by name"
        className="mb-3 w-25"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Row>
        {filteredItems.map((item, index) => (
          <Col key={index} xs={6} md={4} lg={3} className="mb-3">
            <div className="image-item" onClick={() => handleSelect(item)} style={{ cursor: 'pointer' }}>
              {item.type === 'folder' ? (
                <div className="folder-icon text-center">
                  <FontAwesomeIcon icon={faFolderOpen} size="4x" />
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
    </div>
  );
};

export default LocalAlbum;