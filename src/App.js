import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Match from './components/Match';
import General from './components/General';
import Replays from './components/Replays';
import Bracket from './components/Bracket';
import { Container, Button, Dropdown, DropdownButton } from 'react-bootstrap';





// finished with heros1.html - need to copy over to heroes2.html
// starting to work on duorow.html  



function App() {
    const [activeTab, setActiveTab] = useState('match');
    const [currentgame, setSelectedGame] = useState('');
    const generateJSONRef = useRef(null);

    const importGame = async () => {
        
    }

    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'match':
                return <Match 
                onGenerateJSON={(generateJSON) => generateJSONRef.current = generateJSON} 
                setCurrentGame={setSelectedGame}
                currentGame={currentgame}
                
                />;
            case 'general':
                return <General />;
            case 'replays':
                return <Replays />;
            case 'bracket':
                return <Bracket />;
            default:
                return <Match />;
        }
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
                <div className="tab-buttons d-flex align-items-center">
                    <Button 
                        variant="danger" 
                        onClick={() => handleButtonClick('Reset')}
                        className="tab-button"
                    >Reset
                    </Button>
                    <Button 
                        variant="secondary"
                        onClick={() => handleButtonClick('Swap')}
                        className="tab-button"
                    >Swap
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleButtonClick('Update')}
                        className="tab-button"
                    >Update
                    </Button>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="⚙️"
                        variant="secondary"
                        className="ml-2"
                    >
                        <Dropdown.ItemText>Select a Game</Dropdown.ItemText>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            onClick={() => setSelectedGame('Overwatch')}
                            active={currentgame === 'Overwatch'}
                        >Overwatch
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => setSelectedGame('Valorant')}
                            active={currentgame === 'Valorant'}
                        >Valorant
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => importGame()}
                        >Import Game
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
            );
        }
        return null;
    };

    return (
        <Container>
            <nav className="nav nav-tabs d-flex justify-content-between align-items-center">
                <div className="nav nav-tabs">
                    <button className={`nav-link ${activeTab === 'match' ? 'active' : ''}`} onClick={() => setActiveTab('match')}>Match</button>
                    <button className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
                    <button className={`nav-link ${activeTab === 'replays' ? 'active' : ''}`} onClick={() => setActiveTab('replays')}>Replays</button>
                    <button className={`nav-link ${activeTab === 'bracket' ? 'active' : ''}`} onClick={() => setActiveTab('bracket')}>Bracket</button>
                </div>
                {renderButtons()}
            </nav>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </Container>
    );
}

export default App;