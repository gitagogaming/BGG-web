import React, { createContext, useState, useEffect } from 'react';

export const MatchDataContext = createContext();

export const MatchDataProvider = ({ children }) => {
    const [matchData, setMatchData] = useState(null);

    // Fetching match data from localStorage on component mount
    useEffect(() => {
        const fetchMatchData = () => {
            try {
                const storedMatchData = JSON.parse(localStorage.getItem('currentMatchData')) || {};
                const storedInputs = JSON.parse(localStorage.getItem('inputs')) || {};
                // const storedColumns = JSON.parse(localStorage.getItem('columns')) || {};


                // perhaps we shoudl not add the 'general' object with al the inputs directly in 'matchData' since that is being saved to local storage and we want it to be seperated ??
                // so we could add another variable we share desides matchData that is called 'AppInputs' or something else ??
                // before we go this route, lets clean things up.. oooof
                
                const groupedInputs = {};
                Object.entries(storedInputs).forEach(([key, value]) => {
                    if (!groupedInputs[value.type]) {
                        groupedInputs[value.type] = {};
                    }
                    groupedInputs[value.type][key] = value;
                });

                const combinedMatchData = {
                    ...storedMatchData,
                    general: groupedInputs
                };
                
                setMatchData(combinedMatchData);
            } catch (error) {
                console.error('Error fetching match data:', error);
            }
        };

        fetchMatchData();
    }, []);





    const updateMatchData = async () => {
        if (matchData) {  // Ensure matchData is available
            try {
                await fetch('http://localhost:8080/update-json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(matchData)
                });
                console.log('Match data updated:', matchData);
            } catch (error) {
                console.error('Error updating match data:', error);
            }
        }
    };

    // Update backend when matchData changes
    useEffect(() => {
        updateMatchData();
    }, [matchData]); 

    return (
        <MatchDataContext.Provider value={matchData}>
            {children}
        </MatchDataContext.Provider>
    );
};