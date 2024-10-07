
//  ISSUES
// 1. When resetting bracket with clear bracket, it takes a refresh for everything to take effect.. 

import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, ListGroup, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCog } from '@fortawesome/free-solid-svg-icons';
import './Brackets.css';

const TeamInput = ({ teamName, teams, onSelect, teamLogo }) => {
    return (
        <div className="team-input">
            <div className="team-logo-container">
                <img src={teamLogo || "https://via.placeholder.com/50"} alt="team logo" />
            </div>
            <select defaultValue={teamName} onChange={onSelect}>
                <option value="">Select a team</option>
                {teams.map((team, index) => (
                    <option key={index} value={team.name}>{team.name}</option>
                ))}
            </select>
        </div>
    );
};

const BracketRound = ({ title, team1, team2, teams, onTeamSelect }) => {
    return (
        <div className="bracket-round">
            <div className="round-title">{title}</div>

            <TeamInput
                teamName={team1}
                teams={teams}
                onSelect={(e) => onTeamSelect(title, 'team1', e.target.value)}
                teamLogo={teams.find(team => team.name === team1)?.logo}
            />

            <TeamInput
                teamName={team2}
                teams={teams}
                onSelect={(e) => onTeamSelect(title, 'team2', e.target.value)}
                teamLogo={teams.find(team => team.name === team2)?.logo}
            />
        </div>
    );
};


// BracketGroup Component 
const BracketGroup = ({ children }) => {
    return (
        <div className="bracket-group">
            {children}
        </div>
    );
};

const TeamManagement = ({ show, handleClose, teams, setTeams }) => {
    const [newTeam, setNewTeam] = useState({ name: '', wins: 0, losses: 0, ties: 0, otlosses: 0 });
    const [editingTeam, setEditingTeam] = useState(null);

    const handleAddTeam = () => {
        if (editingTeam !== null) {
            // Update existing team
            const updatedTeams = teams.map((team, index) =>
                index === editingTeam ? newTeam : team
            );
            setTeams(updatedTeams);
            setEditingTeam(null);
        } else {
            // Add new team
            setTeams([...teams, newTeam]);
        }
        setNewTeam({ name: '', wins: 0, losses: 0, ties: 0, otlosses: 0 });
    };

    const handleEditTeam = (index) => {
        setEditingTeam(index);
        setNewTeam(teams[index]);
    };

    const handleDeleteTeam = (index) => {
        const updatedTeams = teams.filter((_, i) => i !== index);
        setTeams(updatedTeams);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editingTeam !== null ? 'Edit Team' : 'Add New Team'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-around pt-4">
                <Form>
                    <Form.Group>
                        <Form.Label>Team Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newTeam.name}
                            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Wins</Form.Label>
                        <Form.Control
                            type="number"
                            value={newTeam.wins}
                            onChange={(e) => setNewTeam({ ...newTeam, wins: parseInt(e.target.value) })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Losses</Form.Label>
                        <Form.Control
                            type="number"
                            value={newTeam.losses}
                            onChange={(e) => setNewTeam({ ...newTeam, losses: parseInt(e.target.value) })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ties</Form.Label>
                        <Form.Control
                            type="number"
                            value={newTeam.ties}
                            onChange={(e) => setNewTeam({ ...newTeam, ties: parseInt(e.target.value) })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>OT Losses</Form.Label>
                        <Form.Control
                            type="number"
                            value={newTeam.otlosses}
                            onChange={(e) => setNewTeam({ ...newTeam, otlosses: parseInt(e.target.value) })}
                        />
                    </Form.Group>


                    <Button className="mt-2" onClick={handleAddTeam}>
                        {editingTeam !== null ? 'Update Team' : 'Add Team'}
                    </Button>
                </Form>
                <hr />

                <div>
                    <h5>Current Teams:</h5>
                    <ListGroup style={{ maxHeight: "450px", width: "350px", overflowY: 'auto' }}>

                        {teams.map((team, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                <span>{team.name}</span>
                                <span className="pr-2" style={{ marginLeft: 'auto' }}>
                                    ({team.wins}-{team.losses}-{team.ties}-{team.otlosses})
                                </span>
                                <div>
                                    <Button variant="outline-primary" size="sm" className="mr-2" onClick={() => handleEditTeam(index)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTeam(index)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>


            </Modal.Body>
        </Modal>
    );
};

// Main Bracket Component 
const Bracket = () => {
    const [bracketType, setBracketType] = useState('single-elim');
    const [showTeamManagement, setShowTeamManagement] = useState(false);
    const [teams, setTeams] = useState(JSON.parse(localStorage.getItem('bracket-teams') || '[]'));
    const [bracketData, setBracketData] = useState(JSON.parse(localStorage.getItem('bracket-data') || '{}'));

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('bracket-teams', JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        localStorage.setItem('bracket-data', JSON.stringify(bracketData));
    }, [bracketData]);

    const handleTeamSelect = (roundTitle, position, teamName) => {
        setBracketData(prevData => ({
            ...prevData,
            [roundTitle]: {
                ...prevData[roundTitle],
                [position]: teamName
            }
        }));
    };

    const saveBracket = () => {
        localStorage.setItem('bracket-data', JSON.stringify(bracketData));
        // good place for a status message popup like other areas.. 
        // need to make this a global component....
        // alert('Bracket saved!');
    };

    const clearBracket = () => {
        // Show the custom confirmation modal
        setShowConfirmModal(true);
    };

    const handleConfirmClear = () => {
        // Clear the bracket data
        setBracketData({});
        // Hide the modal
        setShowConfirmModal(false);
    };

    const handleCancelClear = () => {
        // Hide the modal without clearing the bracket data
        setShowConfirmModal(false);
    };


    const renderBracket = () => {
        if (bracketType === 'single-elim') {
            return (
                <div className="bracket">
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                title="Quarterfinal 1"
                                team1={bracketData['Quarterfinal 1']?.team1}
                                team2={bracketData['Quarterfinal 1']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                title="Quarterfinal 2"
                                team1={bracketData['Quarterfinal 2']?.team1}
                                team2={bracketData['Quarterfinal 2']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                title="Quarterfinal 3"
                                team1={bracketData['Quarterfinal 3']?.team1}
                                team2={bracketData['Quarterfinal 3']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                title="Quarterfinal 4"
                                team1={bracketData['Quarterfinal 4']?.team1}
                                team2={bracketData['Quarterfinal 4']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                title="Semifinal 1"
                                team1={bracketData['Semifinal 1']?.team1}
                                team2={bracketData['Semifinal 1']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                title="Semifinal 2"
                                team1={bracketData['Semifinal 2']?.team1}
                                team2={bracketData['Semifinal 2']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                title="Grand Final"
                                team1={bracketData['Grand Final']?.team1}
                                team2={bracketData['Grand Final']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={`bracket`}>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                title="SemiFinal 1"
                                team1={bracketData['SemiFinal 1']?.team1}
                                team2={bracketData['SemiFinal 1']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                title="SemiFinal 2"
                                team1={bracketData['SemiFinal 2']?.team1}
                                team2={bracketData['SemiFinal 2']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                        <div className="bracket-row loser-round">
                            <BracketGroup>
                                <BracketRound
                                    title="Loser's SemiFinal"
                                    team1={bracketData["Loser's SemiFinal"]?.team1}
                                    team2={bracketData["Loser's SemiFinal"]?.team2}
                                    teams={teams}
                                    onTeamSelect={handleTeamSelect}
                                />
                            </BracketGroup>
                        </div>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                title="Winners' Final"
                                team1={bracketData["Winners' Final"]?.team1}
                                team2={bracketData["Winners' Final"]?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                        <div className="bracket-row loser-round">
                            <BracketGroup>
                                <BracketRound
                                    title="Loser's Final"
                                    team1={bracketData["Loser's Final"]?.team1}
                                    team2={bracketData["Loser's Final"]?.team2}
                                    teams={teams}
                                    onTeamSelect={handleTeamSelect}
                                />
                            </BracketGroup>
                        </div>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                title="Grand Final"
                                team1={bracketData['Grand Final']?.team1}
                                team2={bracketData['Grand Final']?.team2}
                                teams={teams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            {renderBracket()}

            <div className="bracket-footer d-flex justify-content-between">
                <Button
                    variant="info"
                    onClick={() => setShowTeamManagement(true)}
                >
                    Manage Teams
                </Button>

                <div className="d-flex">
                    <Modal show={showConfirmModal} onHide={handleCancelClear} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Clear Bracket</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Are you sure you want to clear the bracket?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCancelClear}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleConfirmClear}>
                                Clear Bracket
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <ButtonGroup>

                        <Button variant="danger" onClick={() => clearBracket()}>
                            Clear Bracket
                        </Button>

                        <Button
                            variant="success"
                            onClick={saveBracket}
                        >
                            Save Bracket
                        </Button>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle variant="secondary" id="gear-cog-dropdown">
                                <FontAwesomeIcon icon={faCog} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    active={bracketType === 'single-elim'}
                                    onClick={() => setBracketType('single-elim')}
                                >
                                    Single Elimination
                                </Dropdown.Item>
                                <Dropdown.Item
                                    active={bracketType === 'dbl-elim'}
                                    onClick={() => setBracketType('dbl-elim')}
                                >
                                    Double Elimination
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonGroup>
                </div>
            </div>

            <TeamManagement
                show={showTeamManagement}
                handleClose={() => setShowTeamManagement(false)}
                teams={teams}
                setTeams={setTeams}
            />
        </div>
    );
};

export default Bracket;


// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, ListGroup, Dropdown, DropdownButton, Image, ButtonGroup } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faCog } from '@fortawesome/free-solid-svg-icons';
// import './Brackets.css';


// const TeamInput = ({ teamName, teams }) => {
//     return (
//         <div className="team-input">
//             <div className="team-logo-container">
//                 <img src="https://via.placeholder.com/50" alt="team logo" />
//             </div>
//             <select defaultValue={teamName}>
//                 <option value="">Select a team</option>
//                 {teams.map((team, index) => (
//                     <option key={index} value={team.name}>{team.name}</option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// // BracketRound Component (modified to pass teams)
// const BracketRound = ({ title, team1, team2, teams }) => {
//     return (
//         <div className={`bracket-round`}>
//             <div className="round-title">{title}</div>
//             <TeamInput teamName={team1} teams={teams} />
//             <TeamInput teamName={team2} teams={teams} />
//         </div>
//     );
// };

// // BracketGroup Component (unchanged)
// const BracketGroup = ({ children }) => {
//     return (
//         <div className="bracket-group">
//             {children}
//         </div>
//     );
// };

// const TeamManagement = ({ show, handleClose, teams, setTeams }) => {
//     const [newTeam, setNewTeam] = useState({ name: '', wins: 0, losses: 0, ties: 0, otlosses: 0 });
//     const [editingTeam, setEditingTeam] = useState(null);

//     const handleAddTeam = () => {
//         if (editingTeam !== null) {
//             // Update existing team
//             const updatedTeams = teams.map((team, index) =>
//                 index === editingTeam ? newTeam : team
//             );
//             setTeams(updatedTeams);
//             setEditingTeam(null);
//         } else {
//             // Add new team
//             setTeams([...teams, newTeam]);
//         }
//         setNewTeam({ name: '', wins: 0, losses: 0, ties: 0, otlosses: 0 });
//     };

//     const handleEditTeam = (index) => {
//         setEditingTeam(index);
//         setNewTeam(teams[index]);
//     };

//     const handleDeleteTeam = (index) => {
//         const updatedTeams = teams.filter((_, i) => i !== index);
//         setTeams(updatedTeams);
//     };

//     return (
//         <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>{editingTeam !== null ? 'Edit Team' : 'Add New Team'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body className="d-flex justify-content-around pt-4">
//                 <Form>
//                     <Form.Group>
//                         <Form.Label>Team Name</Form.Label>
//                         <Form.Control
//                             type="text"
//                             value={newTeam.name}
//                             onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
//                         />
//                     </Form.Group>
//                     <Form.Group>
//                         <Form.Label>Wins</Form.Label>
//                         <Form.Control
//                             type="number"
//                             value={newTeam.wins}
//                             onChange={(e) => setNewTeam({ ...newTeam, wins: parseInt(e.target.value) })}
//                         />
//                     </Form.Group>
//                     <Form.Group>
//                         <Form.Label>Losses</Form.Label>
//                         <Form.Control
//                             type="number"
//                             value={newTeam.losses}
//                             onChange={(e) => setNewTeam({ ...newTeam, losses: parseInt(e.target.value) })}
//                         />
//                     </Form.Group>
//                     <Form.Group>
//                         <Form.Label>Ties</Form.Label>
//                         <Form.Control
//                             type="number"
//                             value={newTeam.ties}
//                             onChange={(e) => setNewTeam({ ...newTeam, ties: parseInt(e.target.value) })}
//                         />
//                     </Form.Group>
//                     <Form.Group>
//                         <Form.Label>OT Losses</Form.Label>
//                         <Form.Control
//                             type="number"
//                             value={newTeam.otlosses}
//                             onChange={(e) => setNewTeam({ ...newTeam, otlosses: parseInt(e.target.value) })}
//                         />
//                     </Form.Group>


//                     <Button className="mt-2" onClick={handleAddTeam}>
//                         {editingTeam !== null ? 'Update Team' : 'Add Team'}
//                     </Button>
//                 </Form>
//                 <hr />

//                 <div>
//                     <h5>Current Teams:</h5>
//                     <ListGroup style={{ maxHeight: "450px", width: "350px", overflowY: 'auto' }}>

//                         {teams.map((team, index) => (
//                             <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
//                                 <span>{team.name}</span>
//                                 <span className="pr-2" style={{ marginLeft: 'auto' }}>
//                                     ({team.wins}-{team.losses}-{team.ties}-{team.otlosses})
//                                 </span>
//                                 <div>
//                                     <Button variant="outline-primary" size="sm" className="mr-2" onClick={() => handleEditTeam(index)}>
//                                         <FontAwesomeIcon icon={faEdit} />
//                                     </Button>
//                                     <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTeam(index)}>
//                                         <FontAwesomeIcon icon={faTrash} />
//                                     </Button>
//                                 </div>
//                             </ListGroup.Item>
//                         ))}
//                     </ListGroup>
//                 </div>


//             </Modal.Body>
//         </Modal>
//     );
// };

// // Main Bracket Component
// const Bracket = () => {
//     const [bracketType, setBracketType] = useState('single-elim');
//     const [showTeamManagement, setShowTeamManagement] = useState(false);
//     const [teams, setTeams] = useState(localStorage.getItem('bracket-teams') ? JSON.parse(localStorage.getItem('bracket-teams')) : []);


//     const saveTeamManagement = (teams) => {
//         localStorage.setItem('bracket-teams', JSON.stringify(teams));
//     };

//     useEffect(() => {
//         saveTeamManagement(teams);
//     }, [teams]);

//     const saveBracket = () => {
//         alert('Bracket saved!');
//     };

//     return (
//         <div>
//             {bracketType === 'single-elim' ? (
//                 <div className="bracket">
//                     {/* Quarterfinals Column */}
//                     <div className="bracket-column">
//                         <BracketGroup>
//                             <BracketRound title="Quarterfinal 1" team1="TBA" team2="TBA" teams={teams} />
//                             <BracketRound title="Quarterfinal 2" team1="TBA" team2="TBA" teams={teams} />
//                             <BracketRound title="Quarterfinal 3" team1="TBA" team2="TBA" teams={teams} />
//                             <BracketRound title="Quarterfinal 4" team1="TBA" team2="TBA" teams={teams} />
//                         </BracketGroup>
//                     </div>

//                     {/* Semifinals Column */}
//                     <div className="bracket-column">
//                         <BracketGroup>
//                             <BracketRound title="Semifinal 1" team1="TBA" team2="TBA" teams={teams} />
//                             <BracketRound title="Semifinal 2" team1="TBA" team2="TBA" teams={teams} />
//                         </BracketGroup>
//                     </div>

//                     {/* Grand Final Column */}
//                     <div className="bracket-column">
//                         <BracketGroup>
//                             <BracketRound title="Grand Final" team1="TBA" team2="TBA" teams={teams} />
//                         </BracketGroup>
//                     </div>
//                 </div>
//             ) : (
//                 <div className={`bracket`}>
//                     <div className="bracket-column">
//                         <BracketGroup>
//                             <BracketRound title="SemiFinal 1" team1="TBA" team2="TBA" teams={teams} />
//                             <BracketRound title="SemiFinal 2" team1="TBA" team2="TBA" teams={teams} />
//                         </BracketGroup>

//                         <div className="bracket-row loser-round">
//                             <BracketGroup>
//                                 <BracketRound title="Loser's SemiFinal" team1="TBA" team2="TBA" teams={teams} />
//                             </BracketGroup>
//                         </div>
//                     </div>

//                     <div className="bracket-column">
//                         <BracketGroup>
//                             <BracketRound title="Winners' Final" team1="TBA" team2="TBA" teams={teams} />
//                         </BracketGroup>

//                         <div className="bracket-row loser-round">
//                             <BracketGroup>
//                                 <BracketRound title="Loser's Final" team1="TBA" team2="TBA" teams={teams} />
//                             </BracketGroup>
//                         </div>
//                     </div>

//                     <div className="bracket-column">
//                         <BracketGroup>
//                             <BracketRound title="Grand Final" team1="TBA" team2="TBA" teams={teams} />
//                         </BracketGroup>
//                     </div>
//                 </div>
//             )}

//            <div className="bracket-footer d-flex justify-content-between">
//             <Button
//                 variant="info"
//                 onClick={() => setShowTeamManagement(true)}
//             >
//                 Manage Teams
//             </Button>

//             <div className="d-flex">
//                 <ButtonGroup>
//                     <Button
//                         variant="success"
//                         onClick={() => saveBracket()}
//                     >
//                         Save Bracket
//                     </Button>
//                     <Dropdown as={ButtonGroup}>
//                         <Dropdown.Toggle variant="secondary" id="gear-cog-dropdown">
//                             <FontAwesomeIcon icon={faCog} />
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu>
//                             <Dropdown.Item
//                                 active={bracketType === 'single-elim'}
//                                 onClick={() => setBracketType('single-elim')}
//                             >
//                                 Single Elimination
//                             </Dropdown.Item>
//                             <Dropdown.Item
//                                 active={bracketType === 'dbl-elim'}
//                                 onClick={() => setBracketType('dbl-elim')}
//                             >
//                                 Double Elimination
//                             </Dropdown.Item>
//                         </Dropdown.Menu>
//                     </Dropdown>
//                 </ButtonGroup>
//             </div>
//         </div>


//             <TeamManagement
//                 show={showTeamManagement}
//                 handleClose={() => setShowTeamManagement(false)}
//                 teams={teams}
//                 setTeams={setTeams}
//             />
//         </div>
//     );
// };

// export default Bracket;











