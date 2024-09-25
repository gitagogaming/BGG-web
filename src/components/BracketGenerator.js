import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SingleEliminationBracket, Match, SVGViewer, createTheme } from '@g-loot/react-tournament-brackets';




const WhiteTheme = createTheme({
    textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
    matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
    score: {
      background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
      text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
    },
    border: {
      color: '#CED1F2',
      highlightedColor: '#da96c6',
    },
    roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
    connectorColor: '#CED1F2',
    connectorColorHighlight: '#da96c6',
    svgBackground: '#FAFAFA',
  });

// Define the useWindowSize hook within the same file
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handler right away so state gets updated with initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return [windowSize.width, windowSize.height];
};












const SingleElimination = ({ matches }) => {
  const [width, height] = useWindowSize();
  const finalWidth = Math.max(width - 620, 500);
  const finalHeight = Math.max(height - 200, 500);

  if (!matches || !Array.isArray(matches)) {
    console.error('Invalid matches prop:', matches);
    return null;
  }

  return (
    <SingleEliminationBracket
      matches={matches}
      matchComponent={Match}
    theme={WhiteTheme}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={finalWidth} height={finalHeight} {...props} >
          {children}
        </SVGViewer>
      )}
    />
  );
};

SingleElimination.propTypes = {
  matches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      nextMatchId: PropTypes.string,
      tournamentRoundText: PropTypes.string,
      startTime: PropTypes.string,
      state: PropTypes.string,
      participants: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          resultText: PropTypes.string,
          isWinner: PropTypes.bool,
          status: PropTypes.string,
          name: PropTypes.string,
        })
      ),
    })
  ).isRequired,
};

export default SingleElimination;