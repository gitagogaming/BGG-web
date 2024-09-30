import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import GenerateTeamSide from '../../components/GenerateTeamSide';
import '../../styles/App.css';

import MatchGames from './MatchGames';

import { useCurrentGameConfig } from '../../context/currentGameConfig';



// we still need to render hero roles/ and heros for based on 'currentGameConfig' solely..

const defaultMatchData = {
    currentGame: 'Overwatch',
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

const Match = ({ onGenerateJSON, setCurrentGame, currentGame}) => {
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);

    const [team1Info, setTeam1Info] = useState({});
    const [team2Info, setTeam2Info] = useState({});

    const [maps, setMaps] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    const { currentGameConfig } = useCurrentGameConfig();




    // useEffect(() => {
    //     const loadMatchData = async () => {
    //         try {
    //             console.log('Fetching match data...');
    //             let data;
    
    //             const localData = localStorage.getItem('currentMatchData');
    //             if (localData) {
    //                 console.log('Using local data...');
    //                 data = JSON.parse(localData);
    //             } else {
    //                 console.log('No local data found, using default configuration...');
    //                 data = defaultMatchData;
    //             }
    
    //             const filledData = { ...defaultMatchData, ...data };
    
    //             setCurrentGame(filledData.currentGame);
    //             setTeam1Players(filledData.teams.team1.players);
    //             setTeam2Players(filledData.teams.team2.players);
    //             setTeam1Info(filledData.teams.team1);
    //             setTeam2Info(filledData.teams.team2);
    //             setMaps(filledData.maps);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching match data:', error);
    //         }
    //     };

    //     loadMatchData();
    // }, [setCurrentGame]);

    // Currently this is firing due to app.js sending over the setCurrentGame func, thats really about it..
    useEffect(() => {
        // Fetch the JSON data from the server
        const fetchMatchData = async () => {
            try {
                console.log('Fetching match data...');

                // this is meant to represent a previous save game file incase of a reboot/crash or something lets say
                // - should be moved to local storage instead...
                // const response = await fetch('/matchData.json');
                
                const currentMatchData = localStorage.getItem('currentMatchData');
                // if (currentMatchData) {

                // localStorage.setItem('currentMatchData', JSON.stringify(response));

                console.log('Response:', currentMatchData);
                if (currentMatchData) {
                    // const data = await response.json();
                    const data = currentMatchData;
                    // const filledData = { ...defaultMatchData, ...data };
                    const filledData = { ...JSON.parse(data) };

                    console.log("this is the filled data", filledData);

                    setCurrentGame(filledData.currentGame);

                    setTeam1Players(filledData.teams.team1.players);
                    setTeam2Players(filledData.teams.team2.players);

                    setTeam1Info(filledData.teams.team1);
                    setTeam2Info(filledData.teams.team2);

                    
                    // setMaps(filledData.maps);

                    setMaps(defaultMatchData.maps);

              

                    setIsLoading(false);
                } else {
                    // console.error('Failed to fetch match data:', response.statusText);
                    console.error('Failed to fetch match data:', currentMatchData);
                }
            } catch (error) {
                console.error('Error fetching match data:', error);
            }
        };

        fetchMatchData();
    }, [setCurrentGame]);


    // Getting the map list based on what has been loaded from the new game config via xaml thats loaded into json
    // const getMapList = () => {
    //     if (!currentGameConfig || !currentGameConfig[currentGame] || !currentGameConfig[currentGame].maps) {
    //         console.error("Error: Game configuration or maps not found.");
    //         return [];
    //     }
    //     const currentMaps = currentGameConfig[currentGame].maps.map;
    //     console.log("Current maps from the config thingy", currentMaps);
    //     return currentMaps || [];
    // }

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


    const generateJSON = async (event) => {
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
        <Container fluid className="main-container">
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

                {/*  USING MATCHGAMES INSTEAD .. FOR BELOW */}
                {/* {maps  && 
                    <MatchGames maps={maps} handleMapChange={handleMapChange} getMapList={getMapList} />
                    } */}

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
                        <Row className="mt-2 ">
                            <Col>
                                <Form.Group controlId={`teamScores${index}`} className="d-flex justify-content-center gap-2">
                                    <Form.Control
                                        type="number"
                                        value={map.team1Score}
                                        onChange={(e) => handleMapChange(index, 'team1Score', e.target.value)}
                                        placeholder="Team 1 Score"
                                        className='score-input'

                                    />
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