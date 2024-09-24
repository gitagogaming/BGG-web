import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
// import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const StatusBar = ({ message, variant }) => {
    const [show, setShow] = useState(!!message);
    const icons = {
        success: "✅",
        error: "❗",
        info: "💡"
    };

    // Automatically hide the alert after a short duration
    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 3000); // Hide after 3 seconds

            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [message]);

    if (!show || !message) return null; // Don't render if no message

    return (
        <Alert variant={variant} className={`mt-3 status-bar ${variant}`} style={{ display: show ? 'block' : 'none' }}>
            {icons[variant]}
            {message}
        </Alert>
    );
};

export default StatusBar;
