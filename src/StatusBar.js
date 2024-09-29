import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Popover, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faUser, 
  faCloud, 
  faUserSlash
} from '@fortawesome/free-solid-svg-icons';

const StatusBar = ({ message, variant, connectionDetails, userLoggedIn }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Message disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const icons = {
    success: <FontAwesomeIcon icon={faCheckCircle} color="white" className="mr-2" />,
    error: <FontAwesomeIcon icon={faExclamationCircle} color="white" className="mr-2" />,
    info: <FontAwesomeIcon icon={faInfoCircle} color="white" className="mr-2" />
  };

  const connectionIcons = [
    // { icon: faWifi, name: 'Network', status: connectionDetails.networkStatus },
    { icon: faCloud, name: 'Cloud', status: connectionDetails.cloudStatus },
    // { icon: faDatabase, name: 'Database', status: connectionDetails.databaseStatus }
  ];

  const renderConnectionIcon = (iconData) => (
    <OverlayTrigger
      key={iconData.name}
      trigger="hover"
      placement="top"
      overlay={
        <Popover id={`popover-${iconData.name.toLowerCase()}`}>
          <Popover.Header as="h3">{iconData.name} Connection</Popover.Header>
          <Popover.Body>
            <strong>Status:</strong> {iconData.status || 'N/A'}
          </Popover.Body>
        </Popover>
      }
    >
      <FontAwesomeIcon 
        icon={iconData.icon} 
        style={{ cursor: 'pointer', marginRight: '10px' }} 
        color={iconData.status === 'Connected' ? 'blue' : 'white'}
      />
    </OverlayTrigger>
  );

  return (
    <div className="status-bar d-flex align-items-center justify-content-between mt-2">
      <div className="status-message">
        {showMessage && (
            <>
            <div className={`status-item ${variant} px-5`}>
            {icons[variant]} {currentMessage}
            </div>
        </>
        )}
      </div>
      <div className="status-icons d-flex align-items-center mr-3">
        {connectionIcons.map(renderConnectionIcon)}
        <OverlayTrigger
          trigger="hover"
          placement="top"
          overlay={
            <Popover id="popover-user">
              <Popover.Header as="h3">User Status</Popover.Header>
              <Popover.Body>
                {userLoggedIn ? 'Logged In' : 'Not Logged In'}
              </Popover.Body>
            </Popover>
          }
        >
          <FontAwesomeIcon 
            icon={userLoggedIn ? faUser : faUserSlash}
            style={{ cursor: 'pointer' }} 
            color={userLoggedIn ? 'blue' : 'white'}
          />
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default StatusBar;