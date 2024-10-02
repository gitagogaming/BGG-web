import React, { useState, useEffect } from 'react';
import { Form, Dropdown } from 'react-bootstrap';

const Autocomplete = ({ items, onSelect, teamName, handleTeamInfoChange, ...restProps }) => {
    const [query, setQuery] = useState(teamName || ''); // Initialize with teamName prop
    const [filteredItems, setFilteredItems] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Sync the internal query state with the external teamName prop
    useEffect(() => {
        if (teamName !== query) {
            setQuery(teamName || ''); // Set query if teamName changes
        }
    }, [teamName]);

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

        // Call handleTeamInfoChange for updating teamName field
        handleTeamInfoChange(event, 'teamName');
    };

    const handleSelect = (item) => {
        const selectedTeamName = item.split('.')[0]; // Extract team name
        setQuery(selectedTeamName); // Update query with the selected team name
        setFilteredItems([]);
        setShowDropdown(false);

        // Create a synthetic event to pass to handleTeamInfoChange
        const syntheticEvent = {
            target: { value: selectedTeamName }
        };
        handleTeamInfoChange(syntheticEvent, 'teamName');

        // Pass selected team name to parent via onSelect if needed
        onSelect(selectedTeamName);
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
