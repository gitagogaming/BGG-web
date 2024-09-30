import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useRef, useEffect } from 'react';
import Match from './features/Match/Match';
import General from './features/General/General';
import Replays from './features/Replays/Replays';
import Bracket from './features/Bracket/Bracket';
import { Container, Button, Dropdown, DropdownButton, Nav } from 'react-bootstrap';
import StatusBar from './components/UI/StatusBar'; 
import { fetchAllConfigs } from './services/LoadGameConfig';


import GeneralTest from './features/General/DraggableGeneral';

import { useCurrentGameConfig } from './context/currentGameConfig';

// finished with heros1.html - need to copy over to heroes2.html
// starting to work on duorow.html  



function App() {
    const [activeTab, setActiveTab] = useState('match');
    const [currentgame, setSelectedGame] = useState('');
    const generateJSONRef = useRef(null);

    const fileInputRef = useRef(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusVariant, setStatusVariant] = useState('success'); 

    // Loading from configs folder
    const [gameConfigs, setGameConfigs] = useState([]);

    // Setting the game config to be used in the app
    const { currentGameConfig, setCurrentGameConfig } = useCurrentGameConfig();




    const loadConfigs = async () => {
        try {
            // const storedConfigs = getConfigsFromStorage();
            // if (storedConfigs.length > 0) {
                // setConfigs(storedConfigs);
            // } else {
                const allConfigs = await fetchAllConfigs();

                setGameConfigs(allConfigs);

                // console.log("All Configs", allConfigs);

                setCurrentGameConfig(allConfigs);

                // console.log("Game config sending..", allConfigs[currentgame]);

                // console.log("Current Game Configg", allConfigs[currentgame].maps.map);
                
                // we need to seperate the config and set data that is set by game config verus the data thats set based on the actual match data itself
                // console.log("All Configs", allConfigs[0].config);
                // setConfigs(allConfigs);
            // }
        } catch (error) {
            console.error('Error loading the configs:', error);
        }
    };

    useEffect(() => {
        loadConfigs();
    }, []);



    const setStatus = (message, variant) => {
        setStatusMessage(message);
        setStatusVariant(variant);
    };

 const importGame = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('configFile', file); // Ensure the field name matches the backend

        try {
            const response = await fetch('/upload/config', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log("Successfull upload..")
            
            loadConfigs(); // could probably just get this list from the server on response of a new uploded config?

            const data = await response.json();
            setUploadStatus(data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Error uploading file');
        }
    };


    // const saveState = async (inputs, columns) => {
    //     localStorage.setItem('inputs', JSON.stringify(inputs));
    //     localStorage.setItem('columns', JSON.stringify(columns));

    //     setStatus('Layout updated!', 'success');

    //     // Check if fullJson is empty and try to load it from local storage
    //     let currentFullJson = fullJson;
    //     if (Object.keys(currentFullJson).length === 0) {
    //         currentFullJson = JSON.parse(localStorage.getItem('fullJson')) || {};
    //     }

    //     // Group inputs by type
    //     const groupedInputs = {};
    //     Object.entries(inputs).forEach(([key, value]) => {
    //         if (!groupedInputs[value.type]) {
    //             groupedInputs[value.type] = {};
    //         }
    //         groupedInputs[value.type][key] = value;
    //     });

    //     const updatedData = {
    //         ...currentFullJson,
    //         general: groupedInputs
    //     };

    //     // Update local storage
    //     localStorage.setItem('fullJson', JSON.stringify(updatedData));
    //     setFullJson(updatedData);

    //     // Update server
    //     await fetch('http://localhost:8080/update-json', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(updatedData)
    //     });

    //     console.log("Updated JSON", JSON.stringify(updatedData, null, 2));
    // };

    const saveState = async (inputs, columns) => {
        localStorage.setItem('inputs', JSON.stringify(inputs));
        localStorage.setItem('columns', JSON.stringify(columns));


        setStatus('Layout updated!', 'success');

        //  This is fetchign fulljson from our localhost and then combining it with the current 'inputs' from the general tab and then updating the json

        // if (onGenerateJSON) {
            const response = await fetch('http://localhost:8080/getFullJson');
            const existingData = await response.json();

            // Group inputs by type
            const groupedInputs = {};
            Object.entries(inputs).forEach(([key, value]) => {
                if (!groupedInputs[value.type]) {
                    groupedInputs[value.type] = {};
                }
                groupedInputs[value.type][key] = value;
            });

            const updatedData = {
                ...existingData,
                general: groupedInputs
            };

            await fetch('http://localhost:8080/update-json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            console.log("Updated JSON", JSON.stringify(updatedData, null, 2));
    
    };


    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'match':
                return <Match 
                onGenerateJSON={(generateJSON) => generateJSONRef.current = generateJSON} 
                setCurrentGame={setSelectedGame}
                currentGame={currentgame}
                />;

            case 'general':
                return <General 
                    // onGenerateJSON={() => generateJSONRef.current && generateJSONRef.current()}
                    setStatus={setStatus}
                    saveState={saveState}
                />;

            case 'replays':
                return <Replays />;

            case 'bracket':
                return <Bracket />;

            case 'generalTest':
                return <GeneralTest
                // onGenerateJSON={() => generateJSONRef.current && generateJSONRef.current()}
                setStatus={setStatus}
                saveState={saveState}
                />;

            default:
                return <Match />;
        }
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleButtonClick = (action) => {
        console.log(`${action} button clicked`);
        if (action === 'Update' && generateJSONRef.current) {
            generateJSONRef.current();
        }
    };

    const renderButtons = () => {
        if (activeTab === 'match') {
            return (
                <div className="tab-buttons d-flex align-items-center mr-2">
                    <Button 
                        variant="danger" 
                        onClick={() => handleButtonClick('Reset')}
                        className="tab-button"
                        size="sm"
                    >Reset
                    </Button>
                    <Button 
                        variant="secondary"
                        onClick={() => handleButtonClick('Swap')}
                        className="tab-button"
                        size="sm"
                    >Swap
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleButtonClick('Update')}
                        className="tab-button"
                        size="sm"
                    >Update
                    </Button>
                    
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="⚙️"
                        variant="secondary"
                        className="ml-2"
                        size="sm"
                    >
                        <Dropdown.ItemText>Select a Game</Dropdown.ItemText>
                        <Dropdown.Item onClick={handleImportClick}> Import Game </Dropdown.Item>

                        <Dropdown.Divider />

                            {Object.keys(gameConfigs).map((game, index) => (
                                <Dropdown.Item
                                    key={index}
                                    onClick={() => setSelectedGame(game)}
                                    active={currentgame === game}
                                >{game}
                                </Dropdown.Item>
                            ))}
            
                    </DropdownButton>
                    <input
                        type="file"
                        accept=".bgg"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={importGame}
                    />
                </div>
            );
        }
        return null;
    };

    return (
       
        <Container className="bg-dark px-0 pt-2">
            <div className="d-flex justify-content-between">
                <Nav className="pl-2 nav-tabs d-flex align-items-center flex-wrap">
                    <Nav.Item>
                        <Nav.Link className={`nav-link ${activeTab === 'match' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('match')}>Match</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className={`nav-link ${activeTab === 'general' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('general')}>General</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className={`nav-link ${activeTab === 'replays' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('replays')}>Replays</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className={`nav-link ${activeTab === 'bracket' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('bracket')}>Bracket</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className={`nav-link ${activeTab === 'generalTest' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('generalTest')}>Draggable</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div className="d-none d-md-flex">
                    {renderButtons()}
                </div>
            </div>
            <div className="d-md-none mt-2">
                {renderButtons()}
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>

            {/* <StatusBar message={statusMessage} variant={statusVariant} />  */}

                
            {/* <StatusBar
                message="Connected successfully!"
                variant="error"
                connectionDetails={{currentGame: "Game1",
                status:"Connected", "error": "Naah"}} 
                /> */}
        </Container>
        
    );
}

export default App;