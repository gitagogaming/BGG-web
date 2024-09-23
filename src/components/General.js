import React, { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

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

const General = ({ onGenerateJSON }) => {
    const [inputs, setInputs] = useState({});
    const [files, setFiles] = useState({});
    const [colors, setColors] = useState({});

    useEffect(() => {
        // Load state from local storage
        const savedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
        const savedFiles = JSON.parse(localStorage.getItem('files')) || {};
        const savedColors = JSON.parse(localStorage.getItem('colors')) || {};
        setInputs(savedInputs);
        setFiles(savedFiles);
        setColors(savedColors);
    }, []);

    const saveState = async () => {
        localStorage.setItem('inputs', JSON.stringify(inputs));
        localStorage.setItem('files', JSON.stringify(files));
        localStorage.setItem('colors', JSON.stringify(colors));
        alert('Layout updated!');

        if (onGenerateJSON) {
            const additionalData = {
                inputs,
                files,
                colors
            };

            const response = await fetch('http://localhost:8080/getFullJson');
            const existingData = await response.json();

            const updatedData = {
                ...existingData,
                general: additionalData
            };

            await fetch('http://localhost:8080/update-json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            console.log("Updated JSON", JSON.stringify(updatedData, null, 2));
        }
    };

    const addInput = (column) => {
        const newId = `${column}-${Object.keys(inputs).filter(key => inputs[key].column === column).length + 1}`;
        const newLabel = prompt('Enter label for new input:');
        setInputs({
            ...inputs,
            [newId]: { id: newId, label: newLabel, column, value: '' }
        });
    };

    const removeInput = (id) => {
        if (window.confirm('Are you sure you want to remove this input?')) {
            const newInputs = { ...inputs };
            delete newInputs[id];
            setInputs(newInputs);
        }
    };

    const handleInputChange = (id, value) => {
        setInputs({
            ...inputs,
            [id]: { ...inputs[id], value }
        });
    };

    const addFile = (column) => {
        const newId = `${column}-${Object.keys(files).filter(key => files[key].column === column).length + 1}`;
        const newLabel = prompt('Enter label for new file select:');
        setFiles({
            ...files,
            [newId]: { id: newId, label: newLabel, column, url: '', value: '' }
        });
    };

    const removeFile = (id) => {
        if (window.confirm('Are you sure you want to remove this file select?')) {
            const newFiles = { ...files };
            delete newFiles[id];
            setFiles(newFiles);
        }
    };

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFiles({
                ...files,
                [id]: { ...files[id], url, value: file.name }
            });
        }
    };

    const addColor = () => {
        const newId = `color${Object.keys(colors).length + 1}`;
        const newLabel = prompt('Enter label for new color select:');
        setColors({
            ...colors,
            [newId]: { id: newId, label: newLabel, value: '' }
        });
    };

    const removeColor = (id) => {
        if (window.confirm('Are you sure you want to remove this color select?')) {
            const newColors = { ...colors };
            delete newColors[id];
            setColors(newColors);
        }
    };

    const handleColorChange = (id, value) => {
        setColors({
            ...colors,
            [id]: { ...colors[id], value }
        });
    };

    return (
        <div>
            <h2>General Tab</h2>
            <form>
                <div className="row">

                    {/* First Column: Label + Input */}
                    <div className="col-md-2">
                        {Object.values(inputs).filter(input => input.column === 'input').map(input => (
                            <div key={input.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={input.id} className="label-width">{input.label}</label>
                                <input
                                    id={input.id}
                                    type="text"
                                    className="form-control mr-2"
                                    style={{ width: '100px' }}
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                />
                                <i className="fas fa-trash-alt" onClick={() => removeInput(input.id)} style={{ cursor: 'pointer' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={() => addInput('input')}>+ Add Input</button>
                    </div>
                    
                    {/* Second Column: Label + Input */}
                    <div className="col-md-2">
                        {Object.values(inputs).filter(input => input.column === 'input2').map(input => (
                            <div key={input.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={input.id} className="label-width">{input.label}</label>
                                <input
                                    id={input.id}
                                    type="text"
                                    className="form-control mr-2"
                                    style={{ width: '100px' }}
                                    value={input.value}
                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                />
                                <i className="fas fa-trash-alt" onClick={() => removeInput(input.id)} style={{ cursor: 'pointer' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={() => addInput('input2')}>+ Add Input</button>
                    </div>

                    {/* Third Column: File Select */}
                    <div className="col-md-2">
                        {Object.values(files).filter(file => file.column === 'file').map(file => (
                            <div key={file.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={file.id} className="label-width">{file.label}</label>
                                <input
                                    id={file.id}
                                    type="file"
                                    className="d-none"
                                    onChange={(e) => handleFileChange(file.id, e)}
                                />
                                <OverlayTrigger
                                    trigger="hover"
                                    placement="right"
                                    overlay={renderPopover(file)}
                                >
                                    <Button
                                        variant="secondary"
                                        className='image-file-selector'
                                        onClick={() => handleFileClick(file.id)}
                                    >
                                        {file.url ? (
                                            <img src={file.url} alt="Selected" style={{ width: '20px', height: '20px' }} />
                                        ) : (
                                            '...'
                                        )}
                                    </Button>
                                </OverlayTrigger>
                                <i className="fas fa-trash-alt" onClick={() => removeFile(file.id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={() => addFile('file')}>+ Add File Select</button>
                    </div>

                    {/* Fourth Column: File Select */}
                    <div className="col-md-2">
                        {Object.values(files).filter(file => file.column === 'file2').map(file => (
                            <div key={file.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={file.id} className="label-width">{file.label}</label>
                                <input
                                    id={file.id}
                                    type="file"
                                    className="d-none"
                                    onChange={(e) => handleFileChange(file.id, e)}
                                />
                                <OverlayTrigger
                                    trigger="hover"
                                    placement="right"
                                    overlay={renderPopover(file)}
                                >
                                    <Button
                                        variant="secondary"
                                        className='image-file-selector'
                                        onClick={() => handleFileClick(file.id)}
                                    >
                                        {file.url ? (
                                            <img src={file.url} alt="Selected" style={{ width: '20px', height: '20px' }} />
                                        ) : (
                                            '...'
                                        )}
                                    </Button>
                                </OverlayTrigger>
                                <i className="fas fa-trash-alt" onClick={() => removeFile(file.id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={() => addFile('file2')}>+ Add File Select</button>
                    </div>

                    {/* Fifth Column: Color Selectors */}
                    <div className="col-md-2">
                        {Object.values(colors).map(color => (
                            <div key={color.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={color.id} className="label-width">{color.label}</label>
                                <input
                                    id={color.id}
                                    type="color"
                                    className="form-control mr-2"
                                    style={{ width: '100px', height: '50px' }}
                                    value={color.value}
                                    onChange={(e) => handleColorChange(color.id, e.target.value)}
                                />
                                <i className="fas fa-trash-alt" onClick={() => removeColor(color.id)} style={{ cursor: 'pointer' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={addColor}>+ Add Color Select</button>
                    </div>

                    {/* Sixth Column: Space for more input boxes */}
                    <div className="col-md-2">
                     
                    </div>

                </div>
                <button type="button" onClick={saveState} className="btn btn-primary mt-3">Update</button>
            </form>
        </div>
    );
};

export default General;