import React, { useState, useEffect } from 'react';

const General = () => {
    const [inputs, setInputs] = useState([]);
    const [files, setFiles] = useState([]);
    const [colors, setColors] = useState([]);

    useEffect(() => {
        // Load state from local storage
        const savedInputs = JSON.parse(localStorage.getItem('inputs')) || [{ id: 'input1', label: 'Label 1', column: 'input' }];
        const savedFiles = JSON.parse(localStorage.getItem('files')) || [{ id: 'file1', label: 'File Select 1', url: '' }];
        const savedColors = JSON.parse(localStorage.getItem('colors')) || [{ id: 'color1', label: 'Color Select 1' }];
        setInputs(savedInputs);
        setFiles(savedFiles);
        setColors(savedColors);
    }, []);

    const saveState = () => {
        localStorage.setItem('inputs', JSON.stringify(inputs));
        localStorage.setItem('files', JSON.stringify(files));
        localStorage.setItem('colors', JSON.stringify(colors));
        alert('Layout updated!');
    };

    const addInput = (column) => {
        const newId = `${column}-${inputs.filter(input => input.column === column).length + 1}`;
        const newLabel = prompt('Enter label for new input:');
        setInputs([...inputs, { id: newId, label: newLabel, column }]);
    };

    const removeInput = (id) => {
        if (window.confirm('Are you sure you want to remove this input?')) {
            setInputs(inputs.filter(input => input.id !== id));
        }
    };

    const addFile = () => {
        const newId = `file${files.length + 1}`;
        const newLabel = prompt('Enter label for new file select:');
        setFiles([...files, { id: newId, label: newLabel, url: '' }]);
    };

    const removeFile = (id) => {
        if (window.confirm('Are you sure you want to remove this file select?')) {
            setFiles(files.filter(file => file.id !== id));
        }
    };

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFiles(files.map(f => f.id === id ? { ...f, url } : f));
        }
    };

    const addColor = () => {
        const newId = `color${colors.length + 1}`;
        const newLabel = prompt('Enter label for new color select:');
        setColors([...colors, { id: newId, label: newLabel }]);
    };

    const removeColor = (id) => {
        if (window.confirm('Are you sure you want to remove this color select?')) {
            setColors(colors.filter(color => color.id !== id));
        }
    };

    return (
        <div>
            <h2>General Tab</h2>
            <form>
                <div className="row">
                    {/* First Column: Label + Input */}
                    <div className="col-md-2">
                        {inputs.filter(input => input.column === 'input').map(input => (
                            <div key={input.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={input.id} className="label-width">{input.label}</label>
                                <input id={input.id} type="text" className="form-control mr-1" style={{ width: '100px' }} />
                                <i className="fas fa-trash-alt" onClick={() => removeInput(input.id)} style={{ cursor: 'pointer' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={() => addInput('input')}>+ Add Input</button>
                    </div>

                    {/* Second Column: Label + Input */}
                    <div className="col-md-2">
                        {inputs.filter(input => input.column === 'input2').map(input => (
                            <div key={input.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={input.id} className="label-width">{input.label}</label>
                                <input id={input.id} type="text" className="form-control mr-2" style={{ width: '100px' }} />
                                <i className="fas fa-trash-alt" onClick={() => removeInput(input.id)} style={{ cursor: 'pointer' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={() => addInput('input2')}>+ Add Input</button>
                    </div>

                    {/* Third Column: File Select */}
                    <div className="col-md-2">
                        {files.map(file => (
                            <div key={file.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={file.id} className="label-width">{file.label}</label>
                                <input id={file.id} type="file" className="form-control mr-2" style={{ width: '100px' }} onChange={(e) => handleFileChange(file.id, e)} />
                                <i className="fas fa-trash-alt" onClick={() => removeFile(file.id)} style={{ cursor: 'pointer' }}>❌</i>
                                {file.url && <img src={file.url} alt="Selected" style={{ width: '50px', height: '50px', marginLeft: '10px' }} />}
                            </div>
                        ))}
                        <button type="button" onClick={addFile}>+ Add File Select</button>
                    </div>

                    {/* Fourth Column: File Select */}
                    <div className="col-md-2">
                        {/* Similar to the third column, you can add dynamic file selects here */}
                    </div>

                    {/* Fifth Column: Color Selectors */}
                    <div className="col-md-2">
                        {colors.map(color => (
                            <div key={color.id} className="d-flex align-items-center mb-2">
                                <label htmlFor={color.id} className="label-width">{color.label}</label>
                                <input id={color.id} type="color" className="form-control mr-2" style={{ width: '100px' }} />
                                <i className="fas fa-trash-alt" onClick={() => removeColor(color.id)} style={{ cursor: 'pointer' }}>❌</i>
                            </div>
                        ))}
                        <button type="button" onClick={addColor}>+ Add Color Select</button>
                    </div>

                    {/* Sixth Column: Space for more input boxes */}
                    <div className="col-md-2">
                        {/* Leave space for future inputs */}
                    </div>

                </div>
                <button type="button" onClick={saveState} className="btn btn-primary mt-3">Update</button>
            </form>
        </div>
    );
};

export default General;