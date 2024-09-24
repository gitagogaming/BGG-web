import React, { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import RGL, { WidthProvider } from 'react-grid-layout';
import _ from 'lodash';

const ReactGridLayout = WidthProvider(RGL);

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

const General = ({ onGenerateJSON, setStatus }) => {
    const [inputs, setInputs] = useState({});
    const [layout, setLayout] = useState([]);

    useEffect(() => {
        const savedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
        setInputs(savedInputs);
        setLayout(generateLayout(savedInputs));
    }, []);

    const handleRemoveInput = (inputId) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            setInputs(prevInputs => {
                const newInputs = { ...prevInputs };
                delete newInputs[inputId];
                return newInputs;
            });
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
        setLayout(layout);
    };

    const addInput = (type) => {
        const id = `input-${Date.now()}`;
        const newInput = { id, type, label: `${type} input`, value: '' };
        setInputs(prevInputs => {
            const newInputs = { ...prevInputs, [id]: newInput };
            localStorage.setItem('inputs', JSON.stringify(newInputs));
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
                    rowHeight={50}
                    width={1200}
                    verticalCompact={false}
                    preventCollision={true}
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
                                            style={{ width: '100px' }}
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
                <Button onClick={() => localStorage.setItem('inputs', JSON.stringify(inputs))} variant="primary" className="mt-5 mb-2 ml-2">Save Layout</Button>
            </Form>
        </div>
    );
};

export default General;