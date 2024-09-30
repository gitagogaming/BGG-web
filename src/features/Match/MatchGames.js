import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

export default function MatchGames({ maps, handleMapChange, getMapList }) {
    if (!maps || !maps.mapData) {
        return null; // or return some fallback UI
    }
    return (
    <>
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

    </>
    )
}

