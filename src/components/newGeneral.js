import React, { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover, Form, Dropdown, ButtonGroup, Row, Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

import RGL, { WidthProvider } from 'react-grid-layout';
import _ from 'lodash';

const ReactGridLayout = WidthProvider(RGL);

// ISSUES
// 1. When clicking to drag an item, the item moves approximately 50-100px to the right, every single time. 
// 2. Making a few excessive calls to localstorage.. needs refined a bit
// 3. When using "Toggle Overlap", the items do not retain their specific position after a reload.. likely due to how the layout is being saved

// To Do: 
// Set up resizable grid item? do we really need it for this? doesnt feel so besides MAYBE an image upload
// Rename the item.. ??
// Better close and drag handle?


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
    const [layout, setLayout] = useState([]);
    const columns = ["file", "text", "color"];

    const [collision, setCollision] = useState(true);
    const [overlap, setOverlap] = useState(false);
    const [horizontalCompact, setHoriztonalCompact] = useState(false);
    const [verticalCompact, setVerticalCompact] = useState(false);


    // Loading Inputs when the component mounts
    useEffect(() => {
        const savedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
        const newLayout = [];
        Object.keys(savedInputs).forEach((key, i) => {
            newLayout.push(savedInputs[key].layout);
        });

        setInputs(savedInputs);
        setLayout(newLayout);
    }, []);



    const handleRemoveInput = (inputId) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            // Remove the item from the inputs object
            setInputs(prevInputs => {
                const newInputs = { ...prevInputs };
                delete newInputs[inputId];
                return newInputs;
            });
            // Currently the layout is rerendered every time the layout is changed.. inside of the onLayoutChange function
        }
    };


    const onLayoutChange = (layout) => {
        const currentInputs = JSON.parse(localStorage.getItem('inputs')) || {};

        const newInputs = {};
        layout.forEach(item => {
            if (currentInputs[item.i]) {
                newInputs[item.i] = { ...currentInputs[item.i], layout: item };
            }
        });

        // we save layouts to 'inputs' although its not used in the normal version of the 'general tab'
        localStorage.setItem('inputs', JSON.stringify(newInputs));
        setInputs(newInputs);
    };


    const addInput = (type) => {
        let id = "";
        while (id === "") {
            id = prompt('Enter label for new item:');
            if (id === null) {
                return; // User canceled input
            }
            if (id === "") {
                alert('Please enter a label for the new input.');
            }
        }
        const newInput = {
            id: id,
            type: type,
            label: `${id} `,
            value: type === 'color' ? '#000000' : '',
            url: type === 'file' ? '' : undefined,
            column: type
        };

        setInputs(prevInputs => {
            const newInputs = {
                ...prevInputs,
                [id]: newInput
            };

            localStorage.setItem('inputs', JSON.stringify(newInputs));
            localStorage.setItem('columns', JSON.stringify(columns));

            return newInputs;
        });

        setLayout(prevLayout => [...prevLayout, {
            x: (layout.length * 2) % 12,
            y: Math.floor(layout.length / 6) * 2,
            w: 2,
            h: 2, // Fixed height to accommodate two rows
            i: id
        }]);
    };


    const handleInputChange = (id, value) => {
        setInputs(prevInputs => {
            const newInputs = { ...prevInputs, [id]: { ...prevInputs[id], value } };
            localStorage.setItem('inputs', JSON.stringify(newInputs));
            localStorage.setItem('columns', JSON.stringify(columns));

            return newInputs;
        });
    };



    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setInputs(prevInputs => {
                const newInputs = { ...prevInputs, [id]: { ...prevInputs[id], url: reader.result } };
                localStorage.setItem('inputs', JSON.stringify(newInputs));
                localStorage.setItem('columns', JSON.stringify(columns));

                return newInputs;
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };


    return (
        <div >
            <Form >
                <ReactGridLayout
                    className="bg-light border grid-background"
                    layout={layout}
                    onLayoutChange={onLayoutChange}
                    cols={12}
                    rowHeight={35}
                    width={1200}

                    resizeHandles={['se', 's', 'e']} // Resize from bottom right, bottom, and right
                    
                    draggableHandle=".drag-handle"
                    verticalCompact={false}  // forces layout to be compact vertically
                    // compactType=
                    preventCollision={collision} // prevents collision of elements
                    allowOverlap={overlap} // Allow overlapping of elements
                    isResizable={false} // Prevents resizing

                    // autoSize={true} // Automatically resizes the grid items to fit their content - useful if many different sizes

           
                >
                    {Object.values(inputs).map((input) => (
                        <div key={input.id} className="general-grid-item">
                            <div className="general-grid-item-content">
                                <div className="general-grid-item-title">
                                    <label htmlFor={input.id} className="general-label-width">{input.label}</label>
                                </div>
                                <div className="general-grid-item-body">
                                    {input.type === 'text' && (
                                        <Form.Control
                                            id={input.id}
                                            type="text"
                                            className="form-control mr-2"
                                            style={{ width: '120px' }}
                                            value={input.value}
                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
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
                                        onClick={() => handleRemoveInput(input.id)}
                                        style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} // Change the color here
                                    />
                                    <FontAwesomeIcon
                                        icon={faArrowsAlt}
                                        className="drag-handle"
                                        style={{ width: '15px', height: '15px', position: 'absolute', top: '0', right: '0', cursor: 'move', color: 'gray' }}
                                    />

                                    {/* <div className="drag-handle" style={{ width: '15px', height: '15px', backgroundColor: 'gray', position: 'absolute', top: '0', right: '0', cursor: 'move' }}></div> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </ReactGridLayout>
                <div className="py-2 px-2 bg-dark">
                    <Row>
                        <Col>
                            <ButtonGroup size='sm'>
                                <Button variant="secondary" onClick={() => addInput('text')}>Add Text Input</Button>
                                <Button variant="secondary" onClick={() => addInput('file')}>Add File Select</Button>
                                <Button variant="secondary" onClick={() => addInput('color')}>Add Color Select</Button>
                            </ButtonGroup>
                        </Col>
                        <Col className="text-right">
                            <ButtonGroup size='sm'>
                                <Button onClick={() => saveState(inputs, columns)}  variant="primary" className="">Save Layout</Button>
                                <Dropdown >
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        Options 
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item 
                                        onClick={() => setCollision(!collision)} 
                                        active={collision}
                                        > Toggle Collision
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => setOverlap(!overlap)} 
                                            active={overlap}
                                        > Toggle Overlap
                                        </Dropdown.Item>

                                        {/* compact vertical and or horiztonal buttons */}
                                        <Dropdown.Item
                                            onClick={() => setHoriztonalCompact(!horizontalCompact)}
                                            active={horizontalCompact}
                                        > Toggle Horizontal Compact
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => setVerticalCompact(!verticalCompact)}
                                            active={verticalCompact}
                                        > Toggle Vertical Compact
                                        </Dropdown.Item>


                                    </Dropdown.Menu>
                                </Dropdown>
                            </ButtonGroup>
                          

                        </Col>
                    </Row>
                </div>

            </Form>
        </div>
    );
};

export default General;