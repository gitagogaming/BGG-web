import React, { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover, Form, Dropdown, ButtonGroup, Row, Col, DropdownButton } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faGrip, faCog, faQuestionCircle, faClipboard, faWindowClose, faLock } from '@fortawesome/free-solid-svg-icons';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

// ISSUES
// 1. When clicking to drag an item, the item moves approximately 50-100px to the right, every single time. 
// 2. Making a few excessive calls to localstorage.. needs refined a bit
// 3. When using "Toggle Overlap", the items do not retain their specific position after a reload.. likely due to how the layout is being saved
// 4. Popover does not automatically close when user clicks around it
//    - Solution: Figure out an alternative method or fix the current one
// 5. when adding an input, adjusting it then adding another input the layout resets to previous.. BUT if you go to any other tab and back again before adding a new input its fine
// 6. When naming a Color input, if its longer than 9 characters it willuse the edit button to go behind the color selector
//    - Solution: Move the edit button somewhere that it wont be affected

// To Do: 
// Set up resizable grid item? do we really need it for this? doesnt feel so besides MAYBE an image upload
// ✅ Option to Rename the item ??
// Select a Better close and drag handle icon + location?
// Option to have a 'parent card' which will ahve children items in it.. 
// - currently an item is refered to as general.file.FILENAMEHERE.url but if we have a parent card then it would be general.PARENTCARD.FILENAMEHERE.url instead
// -- This would allow users to have a card that has multiple items in it that relate to one another, like player name, logo, color, tagline etc.. whatever they want
// make some default inputs for the user to start with so they can see how it works and for colors for basic app branding colors and logo

const handleFileClick = (id) => {
    document.getElementById(id).click();
};

// Popover ToopTip for API Route
const renderTooltip = (input, handleCopy) => (
    <Popover id="popover-basic" style={{ maxWidth: '100%' }}>
        <Popover.Header as="h3">API Route</Popover.Header>
        <Popover.Body style={{ width: '100%' }}>
            <div className="d-flex flex-column">
                <div style={{ fontSize: '12px' }}>
                    <strong>Value:</strong>
                    <div className="d-flex align-items-center" style={{ marginTop: '5px' }}>
                        <div
                            className="form-control"
                            style={{
                                display: 'inline-block',
                                width: 'calc(100% )', // Adjust width to leave space for the icon
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #ced4da',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: 'text'
                            }}
                        >
                            {`http://localhost:8080/getValue?path=general.${input.type}.${input.id}.value`}
                        </div>
                        <FontAwesomeIcon
                            icon={faClipboard}
                            className="copy-icon"
                            onClick={() => handleCopy(`http://localhost:8080/getValue?path=general.${input.type}.${input.id}.value`)}
                            style={{ cursor: 'pointer', marginLeft: '10px', color: 'blue' }}
                        />
                    </div>
                </div>
            </div>
        </Popover.Body>
    </Popover>
);

const General = ({ saveState }) => {
    // const [inputs, setInputs] = useState({});
    // const [layout, setLayout] = useState([]);
    const columns = ["file", "text", "color"];


    const [collision, setCollision] = useState(true);
    const [overlap, setOverlap] = useState(false);
    const [horizontalCompact, setHoriztonalCompact] = useState(false);
    const [verticalCompact, setVerticalCompact] = useState(false);


    const [copySuccess, setCopySuccess] = useState(false);
    const [animationClass, setAnimationClass] = useState('');



    // Copy API Route to Clipboard (Popover/ToolTip)
    const handleCopy = (route) => {
        navigator.clipboard.writeText(route).then(() => {
            setAnimationClass('slide-in');
            setCopySuccess(true);
            setTimeout(() => {
                setAnimationClass('slide-out');
                setTimeout(() => setCopySuccess(false), 500);
            }, 2500); // Show for 2 seconds
        });
    };

    // According to "docs" we should avoid useEffect in this type of situation as its not needed.. just put in the function?? perhaps not this one.. 
    // https://react.dev/learn/you-might-not-need-an-effect
    // useEffect(() => {
    //     // Retrieve saved inputs from localStorage
    //     const savedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
    //     const newLayout = [];
    //     let x = 0; // Initialize x position for default layout
    
    //     // Merge defaultInputs with savedInputs (savedInputs take precedence)
    //     const mergedInputs = { ...defaultInputs, ...savedInputs };
    
    //     // Loop through merged inputs to construct layout
    //     Object.keys(mergedInputs).forEach((key) => {
    //         const input = mergedInputs[key];
    
    //         if (input.layout) {
    //             // If layout exists, push it to the newLayout array
    //             newLayout.push(input.layout);
    //         } else {
    //             // If layout doesn't exist, create a default one
    //             const defaultItem = {
    //                 id: key,
    //                 type: input.type || "text",
    //                 label: input.label || key,
    //                 value: input.value || "",
    //                 column: input.column || "text",
    //                 layout: {
    //                     w: 2,
    //                     h: 2,
    //                     x: x,
    //                     y: 0,
    //                     i: key,
    //                     moved: false,
    //                     static: false
    //                 }
    //             };
    //             newLayout.push(defaultItem.layout);
    //             x += 2; // Increment x position for the next item
    //         }
    //     });

    //     localStorage.setItem('inputs', JSON.stringify(mergedInputs));
    
    //     // Save inputs and layout states
    //     setInputs(mergedInputs);
    //     setLayout(newLayout);
    // }, []);



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

    // const toggleLockInput = (inputId, event) => {
    //     if (event.ctrlKey) {
    //         setInputs(prevInputs => {
    //             const newInputs = { ...prevInputs };
    //             newInputs[inputId].layout.static = !newInputs[inputId].layout.static;
    //             return newInputs;
    //         });

    //         localStorage.setItem('inputs', JSON.stringify(inputs));
    //     }
    // };

    const renameInput = (inputId) => {
        let newLabel = null;

        // ask user for new label, check if it exists if it does then ask again saying it already exists
        do {
            newLabel = prompt('Enter new label for this item:');
            if (newLabel === null) {
                return; // User canceled input
            }
            if (newLabel === "") {
                alert('Please enter a label for the new input.');
            } else if (isDuplicateLabel(newLabel, inputs)) {
                alert('This label already exists. Please enter a different label.');
                newLabel = ""; // Reset newLabel to continue the loop
            }
        } while (newLabel === "");

        setInputs(prevInputs => {
            const newInputs = { ...prevInputs };
            const inputToRename = newInputs[inputId];

            // Delete the old key and add the new key with updated label and id
            delete newInputs[inputId];
            newInputs[newLabel] = {
                ...inputToRename,
                label: newLabel,
                id: newLabel
            };

            // Update layout information
            const newLayout = layout.map(item => {
                if (item.i === inputId) {
                    return { ...item, i: newLabel };
                }
                return item;
            });

            localStorage.setItem('inputs', JSON.stringify(newInputs));
            // localStorage.setItem('layout', JSON.stringify(newLayout));
            setLayout(newLayout); // Update the layout state
            return newInputs;
        });
    };


    const isDuplicateLabel = (label, inputs) => {
        return Object.values(inputs).some(input => input.label.trim() === label.trim());
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

        // ask user for new label, check if it exists if it does then ask again saying it already exists
        do {
            id = prompt('Enter label for new item:');
            if (id === null) {
                return; // User canceled input
            }
            if (id === "") {
                alert('Please enter a label for the new input.');
            } else if (isDuplicateLabel(id, inputs)) {
                alert('This label already exists. Please enter a different label.');
                id = ""; // Reset id to continue the loop
            } else if (id.length > 11) {
                alert('This label already exists. Please enter a different label.');
                id = ""; // Reset id to continue the loop
            }
        } while (id === "");

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
            // h: 2, // Fixed height to accommodate two rows
            h: type === 'color' ? 1 : 2,
            i: id
            // static: true
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

    // These are default inputs we need to make sure are always present for the current implementation of the UI..
    // The Color Branding should be LOCKED
    // The Branding logo should be LOCKED for one of them
    const defaultInputs = {
        "BGG_C1": {
            "id": "BGG_C1",
            "type": "color",
            "label": "BGG_C1",
            "value": "#FFFFFF",
            "column": "color",
            "layout": {
                "w": 2,
                "h": 1,
                "x": 10,
                "y": 0,
                "i": "BGG_C1",
                "moved": false,
                "static": true
            }
        },
        "BGG_C2": {
            "id": "BGG_C2",
            "type": "color",
            "label": "BGG_C2",
            "value": "#000000",
            "column": "color",
            "layout": {
                "w": 2,
                "h": 1,
                "x": 10,
                "y": 1,
                "i": "BGG_C2",
                "moved": false,
                "static": true
            }
        },
        "BGG_C3": {
            "id": "BGG_C3",
            "type": "color",
            "label": "BGG_C3",
            "value": "#131131",
            "column": "color",
            "layout": {
                "w": 2,
                "h": 1,
                "x": 10,
                "y": 2,
                "i": "BGG_C3",
                "moved": false,
                "static": true
            }
        },
        "BGG_C4": {
            "id": "BGG_C4",
            "type": "color",
            "label": "BGG_C4",
            "value": "#C0BEE9",
            "column": "color",
            "layout": {
                "w": 2,
                "h": 1,
                "x": 10,
                "y": 3,
                "i": "BGG_C4",
                "moved": false,
                "static": true
            }
        },
        "BGG_L1": {
            "id": "BGG_L1",
            "type": "file",
            "label": "BGG_L1",
            "value": "Scoreboard/General/image15.png",
            "column": "file",
            "layout": {
                "w": 2,
                "h": 2,
                "x": 10,
                "y": 4,
                "i": "BGG_L1",
                "moved": false,
                "static": true
            }
        },
        "BGG_L2": {
            "id": "BGG_L2",
            "type": "file",
            "label": "BGG_L2",
            "value": "Scoreboard/General/image15.png",
            "column": "file",
            "layout": {
                "w": 2,
                "h": 2,
                "x": 10,
                "y": 6,
                "i": "BGG_L2",
                "moved": false,
                "static": true
            }
        },
        "BGG_TAGLINE": {
            "id": "BGG_TAGLINE",
            "type": "text",
            "label": "BGG_TAGLINE",
            "value": "Powered by Broadcast.GG",
            "column": "text",
            "layout": {
                "w": 2,
                "h": 2,
                "x": 10,
                "y": 8,
                "i": "BGG_TAGLINE",
                "moved": false,
                "static": true
            }
        },
        "Caster1": {
            "id": "Caster1",
            "type": "text",
            "label": "Caster1",
            "value": "Caster 1",
            "column": "text",
            "layout": {
                "w": 2,
                "h": 2,
                "x": 0,
                "y": 0,
                "i": "Caster1",
                "moved": false,
                "static": false
            }
        },
        "Caster2": {
            "id": "Caster2",
            "type": "text",
            "label": "Caster2",
            "value": "Caster 2",
            "column": "text",
            "layout": {
                "w": 2,
                "h": 2,
                "x": 0,
                "y": 2,
                "i": "Caster2",
                "moved": false,
                "static": false
            }
        }
    };

    // Retrieve saved inputs from localStorage
    const savedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
    const newLayout = [];
    let x = 0; // Initialize x position for default layout

    // Merge defaultInputs with savedInputs (savedInputs take precedence)
    const mergedInputs = { ...defaultInputs, ...savedInputs };

    // Loop through merged inputs to construct layout
    Object.keys(mergedInputs).forEach((key) => {
        const input = mergedInputs[key];

        if (input.layout) {
            // If layout exists, push it to the newLayout array
            newLayout.push(input.layout);
        } else {
            // If layout doesn't exist, create a default one
            const defaultItem = {
                id: key,
                type: input.type || "text",
                label: input.label || key,
                value: input.value || "",
                column: input.column || "text",
                layout: {
                    w: 2,
                    h: 2,
                    x: x,
                    y: 0,
                    i: key,
                    moved: false,
                    static: false
                }
            };
            newLayout.push(defaultItem.layout);
            x += 2; // Increment x position for the next item
        }
    });

    localStorage.setItem('inputs', JSON.stringify(mergedInputs));

    // Initialize state directly
    const [inputs, setInputs] = useState(mergedInputs);
    const [layout, setLayout] = useState(newLayout);
    return (
        <div >
            {copySuccess && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    zIndex: 1000
                }} className={animationClass}>
                    Copied to clipboard
                </div>
            )}
            <Form >
                <ReactGridLayout
                    className="bg-light border grid-background"
                    style={{ minHeight: "600px" }}
                    layout={layout}
                    onLayoutChange={onLayoutChange}
                    cols={12}
                    rowHeight={35}
                    width={1200}
                    draggableHandle=".drag-handle"
                    // verticalCompact={false}
                    preventCollision={collision}
                    allowOverlap={overlap}
                >
                    {Object.values(inputs).map((input) => (
                        <div key={input.id} className="general-grid-item">
                            <div className="general-grid-item-content">
                                <div className="general-grid-item-title">
                                <label htmlFor={input.id} className="general-label-width">
                                {input.label}

                                {/* If input is in default inputs then we do not allow edits */}
                                {!defaultInputs[input.id] && (
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="edit-icon pl-2"
                                        onClick={() => renameInput(input.id)}
                                        style={{ cursor: 'pointer', marginLeft: 'auto', color: 'blue' }}
                                    />
                                )}
                            </label>
                                </div>
                                <div className="general-grid-item-body">
                                    {input.type === 'text' && (
                                        <Form.Control
                                            id={input.id}
                                            type="text"
                                            className="form-control mr-2"
                                            style={{ width: '85%' }}
                                            value={input.value}
                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        />
                                    )}
                                    {input.type === 'file' && (
                                        <div className="d-flex align-items-center position-relative">
                                            <Form.Control
                                                id={input.id}
                                                type="file"
                                                className="d-none"
                                                onChange={(e) => handleFileChange(input.id, e)}
                                            />
                                            {input.url ? (
                                                <OverlayTrigger
                                                    trigger="hover"
                                                    placement="right"
                                                    overlay={renderTooltip(input, handleCopy)}
                                                >
                                                    <img src={input.url} alt="Selected"
                                                        style={{
                                                            position: 'absolute', width: '50px', height: '50px',
                                                            bottom: -10, left: 105,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleFileClick(input.id)}
                                                    />
                                                </OverlayTrigger>
                                            ) : (
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/271px-Picture_icon_BLACK.svg.png"
                                                    alt="Placeholder Image..."
                                                    style={{
                                                        position: 'absolute', width: '50px', height: '50px',
                                                        bottom: -10, left: 105,
                                                        cursor: 'pointer',
                                                        opacity: 0.5
                                                    }}
                                                    onClick={() => handleFileClick(input.id)}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {input.type === 'color' && (
                                        <Form.Control
                                            id={input.id}
                                            type="color"
                                            className="form-control mr-2"
                                            style={{ position: 'absolute', width: '40%', height: '70%', bottom: '15%', left: '40%', border: 0, outline: '1px solid black' }}
                                            value={input.value}
                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        />
                                    )}
                                    <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '2px' }}>
                                        <OverlayTrigger
                                            trigger="click"
                                            placement="right"
                                            overlay={renderTooltip(input, handleCopy)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faQuestionCircle}
                                                className="question-icon"
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </OverlayTrigger>

                                        {input.layout && !input.layout.static && (
                                            <FontAwesomeIcon
                                                icon={faWindowClose}
                                                className="delete-icon"
                                                onClick={() => handleRemoveInput(input.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        )}

                                    </div>
                                    {/* keeping it bottom right until we figure out how to resize properly */}
                                    {input.layout && !input.layout.static ? (
                                        <FontAwesomeIcon
                                            icon={faGrip}
                                            className="drag-handle"
                                            style={{ width: '15px', height: '15px', position: 'absolute', bottom: '5', right: '5', cursor: 'move', color: 'gray' }}

                                        />

                                    ) : (
                                        <></>
                                        // <FontAwesomeIcon
                                        //     icon={faLock}
                                        //     className="lock-icon"
                                        //     style={{ width: '15px', height: '15px', position: 'absolute', bottom: '5px', right: '5px', color: 'gray' }}
                                        //     onClick={() => alert('This item is locked and cannot be moved.')}
                                        // // onClick={(event) => toggleLockInput(input.id, event)}
                                        // />
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}


                </ReactGridLayout>
                <div className="pt-2 px-2 bg-dark">

                    <Row className="align-items-center">
                        <Col>
                            <ButtonGroup size='sm'>
                                <Button variant="secondary" onClick={() => addInput('text')}>Add Text Input</Button>
                                <Button variant="secondary" onClick={() => addInput('file')}>Add File Select</Button>
                                <Button variant="secondary" onClick={() => addInput('color')}>Add Color Select</Button>
                            </ButtonGroup>
                        </Col>
                        <Col className="text-right">
                            <ButtonGroup size='sm' className="custom-button-group">
                                <Button onClick={() => saveState(inputs, columns)} variant="primary" className="">Save Layout</Button>
                                <DropdownButton as={ButtonGroup} title={<FontAwesomeIcon icon={faCog} />} variant="secondary" id="dropdown-basic">
                                    <Dropdown.Item
                                        onClick={() => setCollision(!collision)}
                                        active={collision}
                                    >
                                        Toggle Collision
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => setOverlap(!overlap)}
                                        active={overlap}
                                    >
                                        Toggle Overlap
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => setHoriztonalCompact(!horizontalCompact)}
                                        active={horizontalCompact}
                                    >
                                        Toggle Horizontal Compact
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => setVerticalCompact(!verticalCompact)}
                                        active={verticalCompact}
                                    >
                                        Toggle Vertical Compact
                                    </Dropdown.Item>
                                </DropdownButton>
                            </ButtonGroup>


                        </Col>
                    </Row>
                </div>

            </Form>
        </div>
    );
};

export default General;