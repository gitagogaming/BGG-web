import React, { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import RGL, { WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

const ReactGridLayout = WidthProvider(RGL);

// ISSUES
// 1. When adding an item, it does not ask for a title for the item and just prepopulates causing duplicates etc
// 2. The Json is not formatted correctly and needs reworked :(


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
    const [columns, setColumns] = useState(["file", "text", "color"]); // Not used in the 'draggable' version but we need to fill it out still for folks using the 'static' version potentially
    const [layout, setLayout] = useState([]);

    useEffect(() => {
        // Loading the 'inputs' from localStorage which is holding data for any inputs created in the 'general tab'
        const savedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
        // We need to loop thru inputs and recreate the layouts by making an array with each layout ver input
        
        const newLayout = [];
        Object.keys(savedInputs).forEach((key, i) => {
            newLayout.push(savedInputs[key].layout);
            // newLayout.push({
            //     x: key.x,
            //     y: key.y,
            //     w: key.w,
            //     h: key.h,
            //     i: key.i
            // });
        });

        console.log(newLayout);

        setInputs(savedInputs);
        setLayout(newLayout);




        // setInputs(savedInputs);
        // setLayout(generateLayout(savedInputs));
        // console.log(savedInputs)
    }, []);

    const handleRemoveInput = (inputId) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            // setInputs(prevInputs => {
            //     const newInputs = { ...prevInputs };
            //     delete newInputs[inputId];
            //     return newInputs;
            // });

            setLayout(prevLayout => prevLayout.filter(item => item.i !== inputId));
        }
    };

    const generateLayout = (inputs) => {
        return _.map(Object.keys(inputs), (key, i) => {
            return {
                x: (i * 2) % 12,
                y: Math.floor(i / 6) * 2,
                w: 2,
                h: 2, // Fixed height to accommodate two rows
                i: key
            };
        });
    };

    const onLayoutChange = (layout) => {
        // for every item in the layout, check the ID(i) and see if it is also in localstorage('inputs') and if so add layout to that input.. 
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
        
        // setLayout(layout);
        // localStorage.setItem('layout', JSON.stringify(layout));
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
        <div>
            <Form>
                <ReactGridLayout
                    layout={layout}
                    onLayoutChange={onLayoutChange}
                    cols={12}
                    rowHeight={35}
                    width={1200}
                    verticalCompact={true}  // forces layout to be compact vertically
                    preventCollision={false} // prevents collision of elements
                    draggableHandle=".drag-handle" // Only allow dragging by the handle
                    allowOverlap= {false}
                    isResizable={false} // Prevents resizing
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
                <div className="mt-3">
                    <Dropdown as={ButtonGroup}>
                        <Button variant="secondary" onClick={() => addInput('text')}>Add Text Input</Button>
                        <Button variant="secondary" onClick={() => addInput('file')}>Add File Select</Button>
                        <Button variant="secondary" onClick={() => addInput('color')}>Add Color Select</Button>
                    </Dropdown>
                </div>
                {/* <Button onClick={() => localStorage.setItem('inputs', JSON.stringify(inputs))} variant="primary" className="mt-5 mb-2 ml-2">Save Layout</Button> */}
                {/* <Button onClick= {saveState} variant="primary" className="mt-5 mb-2 ml-2">Save Layout</Button> */}
                <Button onClick={() => saveState(inputs, columns)} variant="primary" className="mt-5 mb-2 ml-2">Save Layout</Button>

            </Form>
        </div>
    );
};

export default General;