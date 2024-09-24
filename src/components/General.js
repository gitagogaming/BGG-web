import React, { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover, Form, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';


const handleFileClick = (id) => {
    document.getElementById(id).click();
};

const renderPopover = (file) => (
    <Popover id={`popover-${file.id}`}>
        <Popover.Body>
            {file.url ? (
                <img src={file.url} alt="Selected" style={{ width: '100%', height: 'auto' }} />
            ) : (
                <span>No image selected</span>
            )}
        </Popover.Body>
    </Popover>
);

const General = ({ onGenerateJSON, setStatus, saveState }) => {
    const [inputs, setInputs] = useState({});
    const [columns, setColumns] = useState([]);


    // The 'Add Item' button is a dual button.. by default it only made the one section of it clickable.. I didnt like it..
    const handleDropdownClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropdownToggle = e.currentTarget.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.click();
        }
    };


    useEffect(() => {
        const savedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
        const savedColumns = JSON.parse(localStorage.getItem('columns')) || [];
        setInputs(savedInputs);
        setColumns(savedColumns);
    }, []);

    // const saveState = async () => {
    //     localStorage.setItem('inputs', JSON.stringify(inputs));
    //     localStorage.setItem('columns', JSON.stringify(columns));


    //     setStatus('Layout updated!', 'success');

    //     if (onGenerateJSON) {
    //         const response = await fetch('http://localhost:8080/getFullJson');
    //         const existingData = await response.json();

    //         // Group inputs by type
    //         const groupedInputs = {};
    //         Object.entries(inputs).forEach(([key, value]) => {
    //             if (!groupedInputs[value.type]) {
    //                 groupedInputs[value.type] = {};
    //             }
    //             groupedInputs[value.type][key] = value;
    //         });

    //         const updatedData = {
    //             ...existingData,
    //             general: groupedInputs
    //         };

    //         await fetch('http://localhost:8080/update-json', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(updatedData)
    //         });

    //         console.log("Updated JSON", JSON.stringify(updatedData, null, 2));
    //     }
    // };



    // This is a 'Hotkey' so to speak.. 
    //we can move this to App.js and create keybinds for everythiing needed.
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault(); // Prevent the default behavior
                saveState();
            }
        };

        // Add the event listener
        window.addEventListener('keydown', handleKeyDown);

        // Remove the event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [saveState]);


    const createColumn = () => {
        const columnName = prompt('Enter name for new column (leave blank for default):');
        const newColumnName = columnName || `Column${columns.length + 1}`;
        if (!columns.includes(newColumnName)) {
            setColumns([...columns, newColumnName]);
        } else {
            alert('Column already exists.');
        }
    };

    const addInput = (type, columnName) => {
        let inputID = "";
        while (inputID === "") {
            inputID = prompt('Enter label for new item:');
            if (inputID === null) {
                return; // User canceled input
            }
            if (inputID === "") {
                alert('Please enter a label for the new input.');
            }
        }

        const newInput = {
            id: inputID,
            label: inputID,
            value: type === 'color' ? '#000000' : '',
            type: type,
            url: type === 'file' ? '' : undefined,
            column: columnName
        };

        setInputs(prevInputs => ({
            ...prevInputs,
            [inputID]: newInput
        }));
    };

    const handleInputChange = (inputId, value) => {
        setInputs(prevInputs => ({
            ...prevInputs,
            [inputId]: {
                ...prevInputs[inputId],
                value: value
            }
        }));
    };

    const handleFileChange = (inputId, event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setInputs(prevInputs => ({
                ...prevInputs,
                [inputId]: {
                    ...prevInputs[inputId],
                    value: file.name,
                    url: url
                }
            }));
        }
    };

    const removeInput = (inputId) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            setInputs(prevInputs => {
                const newInputs = { ...prevInputs };
                delete newInputs[inputId];
                return newInputs;
            });
        }
    };


    // Group inputs by column for rendering
    const groupedInputs = Object.values(inputs).reduce((acc, input) => {
        const columnKey = input.column || 'default';
        if (!acc[columnKey]) {
            acc[columnKey] = [];
        }
        acc[columnKey].push(input);
        return acc;
    }, {});

    return (
        <div>
            <Form>
                <Row>
                    {columns.map((columnName) => (
                        <Col key={columnName} md={4}>
                            <h5>{columnName}</h5>
                            {(groupedInputs[columnName] || []).map((input) => (
                                <div key={input.id} className="d-flex align-items-center mb-2">
                                    <label htmlFor={input.id} className="label-width">{input.label}</label>
                                    {input.type === 'text' && (
                                        <Form.Control
                                            id={input.id}
                                            type="text"
                                            className="form-control mr-2"
                                            style={{ width: '100px' }}
                                            value={input.value}
                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        // onKeyDown={(e) => {
                                        //     if (e.key === 'Enter') {
                                        //         e.preventDefault(); // Prevent the default form submission behavior
                                        //         saveState();
                                        //     }
                                        // }}
                                        />
                                    )}
                                    {input.type === 'file' && (
                                        <>
                                            <Form.Control
                                                id={input.id}
                                                type="file"
                                                className="d-none"
                                                onChange={(e) => handleFileChange(input.id, e)}
                                            />
                                            <OverlayTrigger
                                                trigger="hover"
                                                placement="right"
                                                overlay={renderPopover(input)}
                                            >
                                                <Button
                                                    variant="secondary"
                                                    className="image-file-selector"
                                                    onClick={() => handleFileClick(input.id)}
                                                >
                                                    {input.url ? (
                                                        <img src={input.url} alt="Selected" style={{ width: '20px', height: '20px' }} />
                                                    ) : (
                                                        '+'
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                        </>
                                    )}
                                    {input.type === 'color' && (
                                        <Form.Control
                                            id={input.id}
                                            type="color"
                                            className="form-control mr-2"
                                            style={{ width: '50px' }}
                                            value={input.value}
                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        />
                                    )}
                                    <FontAwesomeIcon
                                        icon={faDeleteLeft}
                                        className="delete-icon"
                                        onClick={() => removeInput(input.id)}
                                    />
                                </div>
                            ))}

                            <div className="mt-3">
                                    <Dropdown as={ButtonGroup} onClick={handleDropdownClick}>
                                    <Button variant="secondary">Add Item</Button>
                                    <Dropdown.Toggle split variant="primary" id="dropdown-basic" />
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => addInput('text', columnName)}>Text Input</Dropdown.Item>
                                        <Dropdown.Item onClick={() => addInput('file', columnName)}>File Select</Dropdown.Item>
                                        <Dropdown.Item onClick={() => addInput('color', columnName)}>Color Select</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            </div>
                        </Col>
                    ))}
                </Row>

                <Button onClick={createColumn} variant="success" className="mt-5 mb-2">Create Column</Button>
                <Button onClick={() => saveState(inputs, columns)} variant="primary" className="mt-5 mb-2 ml-2">Save Layout</Button>

            </Form>
        </div>
    );
};

export default General;