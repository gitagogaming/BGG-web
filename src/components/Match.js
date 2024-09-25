import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import GenerateTeamSide from '../components/GenerateTeamSide';
import '../styles/App.css'; 

const defaultMatchData = {
    currentGame: '',
    teams: {
        team1: {
            teamName: '',
            teamInfo: '',
            teamLogo: '',
            teamLogoUrl: '',
            teamScore: 0,
            teamColor: '',
            teamGroup: '',
            players: Array(6).fill({
                player: '',
                playerName: '',
                hero: '',
                role: '',
                info: '',
                image: null,
                imageUrl: null
            })
        },
        team2: {
            teamName: '',
            teamInfo: '',
            teamLogo: '',
            teamLogoUrl: '',
            teamScore: 0,
            teamColor: '',
            teamGroup: '',
            players: Array(6).fill({
                player: '',
                playerName: '',
                hero: '',
                role: '',
                info: '',
                image: null,
                imageUrl: null
            })
        }
    },
    maps: {
        selectedMap: '',
        mapData: Array(7).fill({
            map: '',
            team1Score: 0,
            team2Score: 0,
            completed: false
        })
    }
};

const Match = ({ onGenerateJSON, setCurrentGame, currentGame }) => {
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);

    const [team1Info, setTeam1Info] = useState({});
    const [team2Info, setTeam2Info] = useState({});
    
    const [maps, setMaps] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the JSON data from the server
        const fetchMatchData = async () => {
            try {
                console.log('Fetching match data...');
                const response = await fetch('/matchData.json');
                console.log('Response:', response);
                if (response.ok) {
                    const data = await response.json();
                    const filledData = { ...defaultMatchData, ...data };

                    setCurrentGame(filledData.currentGame);

                    setTeam1Players(filledData.teams.team1.players);
                    setTeam2Players(filledData.teams.team2.players);

                    setTeam1Info(filledData.teams.team1);
                    setTeam2Info(filledData.teams.team2);

                    setMaps(filledData.maps);

                    setIsLoading(false);
                } else {
                    console.error('Failed to fetch match data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching match data:', error);
            }
        };
    
        fetchMatchData();
    }, [setCurrentGame]);
    // }, [setCurrentGame]);

    const getMapList = () => {
        switch (currentGame) {
            case 'Overwatch':
                return ['Busan', 'Hanamura', 'Hollywood', 'Ilios', 'King\'s Row', 'Lijiang Tower', 'Nepal', 'Numbani', 'Oasis', 'Temple of Anubis', 'Volskaya Industries', 'Watchpoint: Gibraltar'];
            case 'Valorant':
                return ['Ascent', 'Bind', 'Breeze', 'Haven', 'Icebox', 'Split'];
            default:
                return [];
        }
    }

    const handleMapChange = (index, field, value) => {
        const newMapData = maps.mapData.map((map, i) =>
            i === index ? { ...map, [field]: value } : map
        );
        setMaps({ ...maps, mapData: newMapData });
    };

    const generateJSON = async () => {
        const team1Data = {
            teamName: team1Info.teamName,
            teamInfo: team1Info.teamInfo,
            teamLogo: team1Info.teamLogo,
            teamLogoUrl: team1Info.teamLogoUrl,
            teamScore: team1Info.teamScore,
            teamColor: team1Info.teamColor,
            teamGroup: team1Info.teamGroup,
            players: team1Players.map((player, index) => ({
                player: `P${index + 1}`,
                ...player
            }))
        };

        const team2Data = {
            teamName: team2Info.teamName,
            teamInfo: team2Info.teamInfo,
            teamLogo: team2Info.teamLogo,
            teamLogoUrl: team2Info.teamLogoUrl,
            teamScore: team2Info.teamScore,
            teamColor: team2Info.teamColor,
            teamGroup: team2Info.teamGroup,
            players: team2Players.map((player, index) => ({
                player: `P${index + 1}`,
                ...player
            }))
        };

        const jsonData = {
            teams: {
                team1: team1Data,
                team2: team2Data
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
        
        // Send JSON data to the server
        await fetch('http://localhost:8080/update-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        console.log("To-Server", JSON.stringify(jsonData, null, 2));
    };

    // Call the onGenerateJSON prop with the generateJSON function
    onGenerateJSON(generateJSON);

    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <Container fluid className="custom-container">
            <Row>
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

            <Row className = "bg-white">
                <Row className="mt-2">
                    <Col className="d-flex justify-content-center align-items-center">
                        <Form.Group controlId="activeMapSelect">
                            <Form.Label>Current Map Select</Form.Label>
                            <Form.Control
                                as="select"
                                value={maps.selectedMap}
                                onChange={(e) => setMaps({ ...maps, selectedMap: e.target.value })}
                            >
                                <option value="">Select a Map...</option>
                                {maps.mapData.map((_, index) => (
                                    <option key={index} value={`Map ${index + 1}`}>Map {index + 1}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Col>
                    <Row>
                        {maps.mapData.map((_, index) => (
                            <Col key={index}>
                                <Form.Label>Map {index + 1}</Form.Label>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {maps.mapData.map((map, index) => (
                            <Col key={index}>
                                <Form.Control
                                    as="select"
                                    value={map.selectedMap}
                                    onChange={(e) => handleMapChange(index, 'selectedMap', e.target.value)}
                                >
                                    <option value="">Select Map</option>
                                    {getMapList().map((map, index) => (
                                        <option key={index} value={map}>{map}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {maps.mapData.map((map, index) => (
                            <Col key={index} className="d-flex justify-content-center align-items-center gap-4">
                                <Form.Control
                                    type="number"
                                    value={map.team1Score}
                                    onChange={(e) => handleMapChange(index, 'team1Score', e.target.value)}
                                    style={{ width: '25%' }}
                                />
                                <Form.Control
                                    type="number"
                                    value={map.team2Score}
                                    onChange={(e) => handleMapChange(index, 'team2Score', e.target.value)}
                                    style={{ width: '25%' }}
                                />
                            </Col>
                        ))}
                    </Row>
                    <Row className="mb-3">
                        {maps.mapData.map((map, index) => (
                            <Col key={index}>
                                <Form.Check
                                    type="checkbox"
                                    label="Completed"
                                    checked={map.completed}
                                    onChange={(e) => handleMapChange(index, 'completed', e.target.checked)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Match;