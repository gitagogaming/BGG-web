import React, { useState } from 'react';
import { Form, Dropdown } from 'react-bootstrap';

const Autocomplete = ({ items, onSelect, teamName, ...restProps }) => {
    const [query, setQuery] = useState(teamName);
    const [filteredItems, setFilteredItems] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value) {
            const filtered = items.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(filtered);
            setShowDropdown(true);
        } else {
            setFilteredItems([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (item) => {
        const teamName = item.split('.')[0]; // Extract team name by splitting on the dot
        setQuery(teamName);
        setFilteredItems([]);
        setShowDropdown(false);
        onSelect(teamName);
    };

    return (
        <div className="autocomplete" style={{ position: 'relative' }}>
            <Form.Control
                type="text"
                value={query}
                onChange={handleInputChange}
                autoComplete="off"
                {...restProps}
            />
            {showDropdown && filteredItems.length > 0 && (
                <Dropdown.Menu show>
                    {filteredItems.map((item, index) => (
                        <Dropdown.Item key={index} onClick={() => handleSelect(item)}>
                            {item.split('.')[0]} {/* Display team name without extension */}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            )}
        </div>
    );
};

export default Autocomplete;