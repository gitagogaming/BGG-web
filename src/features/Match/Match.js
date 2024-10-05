import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

import { defaultMatchData } from './defaultMatchData';
import GenerateTeamSide from '../../components/GenerateTeamSide';
import { useCurrentGameConfig } from '../../context/currentGameConfig';




// we still need to render hero roles/ and heros for based on 'currentGameConfig' solely..



const Match = ({ onGenerateJSON, setCurrentGame, currentGame, onUpdate}) => {
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    const [team1Info, setTeam1Info] = useState({});
    const [team2Info, setTeam2Info] = useState({});
    const [maps, setMaps] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    const { currentGameConfig } = useCurrentGameConfig();



    // we can likely seperate this into two funcsone for setting maps and current game based on setcurentGame and then one that is used to do the actual update if
    useEffect(() => {
        // Fetch the JSON data from localStorage or use DefaultMatchData
        const fetchMatchData = async () => {
            try {
                console.log('Fetching match data...');
                
                // Retrieve data from localStorage
                const response = localStorage.getItem('currentMatchData');
                console.log('Response:', response);
    
                if (response) {
                    const data = JSON.parse(response); // Parse the JSON string from localStorage
                    const filledData = { ...defaultMatchData, ...data };
    
                    setCurrentGame(filledData.currentGame);
                    setTeam1Players(filledData.teams.team1.players);
                    setTeam2Players(filledData.teams.team2.players);
                    setTeam1Info(filledData.teams.team1);
                    setTeam2Info(filledData.teams.team2);
                    setMaps(filledData.maps);
                } else {
                    console.info('No match data found, using default data...');
                    
                    // Using & Storing DefaultMatchData if not found in local storage 
                    localStorage.setItem('currentMatchData', JSON.stringify(defaultMatchData));
    
                    setCurrentGame(defaultMatchData.currentGame);
                    setTeam1Players(defaultMatchData.teams.team1.players);
                    setTeam2Players(defaultMatchData.teams.team2.players);
                    setTeam1Info(defaultMatchData.teams.team1);
                    setTeam2Info(defaultMatchData.teams.team2);
                    setMaps(defaultMatchData.maps);
                }
    
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching match data:', error);
            }
        };
    
        fetchMatchData();
    }, []);
    
    // Getting Map List from the currentGameConfig
    const getMapList = () => {
        if (!currentGameConfig || !currentGameConfig.maps) {
            console.error("Error: Game configuration or maps not found.");
            return [];
        }
        const currentMaps = currentGameConfig.maps.map;
        console.log("Current maps from the config thingy", currentMaps);
        return currentMaps || [];
    };
    

    // When map changes, we sort the avaialble maps based 
    const handleMapChange = (index, field, value) => {
        const newMapData = maps.mapData.map((map, i) =>
            i === index ? { ...map, [field]: value } : map
        );
        setMaps({ ...maps, mapData: newMapData });
    };


    // This needs to be replaced/merged up with other update functions
    //  This way it will also upadte the inputs/columns as well
    const generateJSON = async (event) => {
        const matchData = {
            teams: {
                // team1: team1Data,
                team1: {...team1Info, players: team1Players},
                team2: {...team2Info, players: team2Players}
            },
            maps: {
                selectedMap: maps.selectedMap,
                mapData: maps.mapData.map((map, index) => ({
                    map: `Map ${index + 1}`,
                    ...map
                }))
            },
            currentGame: currentGame
        };
    
        console.log("match data from match.js", matchData);
        onUpdate({ matchData });
    };

    // Call the onGenerateJSON prop with the generateJSON function
    onGenerateJSON(generateJSON);

    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <Container fluid className="main-container">
            <Row>

                {/* Team 1 Side */}
                <Col md={6} className="team-side team-side-left py-2">
                    <GenerateTeamSide
                        team="Team1"
                        players={team1Players}
                        setPlayers={setTeam1Players}
                        teamInfo={team1Info}
                        setTeamInfo={setTeam1Info}
                        currentGame={currentGame}
                    />
                </Col>

                {/* Team 2 Side */}
                <Col md={6} className="team-side team-side-right py-2">
                    <GenerateTeamSide
                        team="Team2"
                        players={team2Players}
                        setPlayers={setTeam2Players}
                        teamInfo={team2Info}
                        setTeamInfo={setTeam2Info}
                        currentGame={currentGame}
                    />
                </Col>

            </Row>

            {/* Map Selection */}
            <Row className="bg-white">
                <Row className="pt-2 pb-3 map-select">
                    <Col >
                        <Form.Group controlId="activeMapSelect" className="d-flex flex-column align-items-center">
                            <Form.Label>Current Map Select</Form.Label>
                            <Form.Control
                                as="select"
                                value={maps.selectedMap}
                                onChange={(e) => setMaps({ ...maps, selectedMap: e.target.value })}
                            >
                                <option value="">Select a Map...</option>

                                {maps && maps.mapData && maps.mapData.map((map, index) => (
                                    <option key={index} value={`Map ${index + 1}`}>
                                        Map {index + 1}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                    </Col>
                </Row>

                {/* Looping over mapData */}
                {maps.mapData.map((map, index) => (
                    <Col key={index} className=" map-select maps pb-2">
                        <Form.Label className="d-flex justify-content-center">Map {index + 1}</Form.Label>
                        <Form.Group controlId={`mapSelect${index}`} className='d-flex justify-content-center'>

                            <Form.Control
                                as="select"
                                value={map.selectedMap}
                                onChange={(e) => handleMapChange(index, 'selectedMap', e.target.value)}
                            >
                                <option value="">Select Map</option>
                                {getMapList().map((mapName, mapIndex) => (
                                    <option key={mapIndex} value={mapName}>{mapName}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {/* Map Score Boxes */}
                        <Row className="mt-2 ">
                            <Col>
                                <Form.Group controlId={`teamScores${index}`} className="d-flex justify-content-center gap-2">

                                    {/* Team 1 Map Score */}
                                    <Form.Control
                                        type="number"
                                        value={map.team1Score}
                                        onChange={(e) => handleMapChange(index, 'team1Score', e.target.value)}
                                        placeholder="Team 1 Score"
                                        className='score-input'
                                    />
                                    
                                    <span className="score-separator">-</span>

                                    {/* Team 2 Map Score */}
                                    <Form.Control
                                        type="number"
                                        value={map.team2Score}
                                        onChange={(e) => handleMapChange(index, 'team2Score', e.target.value)}
                                        placeholder="Team 2 Score"
                                        className='score-input'
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Map Completed Checkbox */}
                        <Form.Group controlId={`completed${index}`} className="d-flex justify-content-center mt-2">
                            <Form.Check
                                type="checkbox"
                                label={map.completed ? "Completed" : "Not Played"}
                                checked={map.completed}
                                onChange={(e) => handleMapChange(index, 'completed', e.target.checked)}
                            />

                        </Form.Group>
                        
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Match;