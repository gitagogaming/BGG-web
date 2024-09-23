import React from 'react';

const Bracket = () => {
    const inputs = Array.from({ length: 50 }, (_, index) => (
        <input key={index} type="text" placeholder={`Bracket Input ${index + 1}`} className="form-control mb-2" />
    ));

    return (
        <div>
            <h2>Bracket Tab</h2>
            <form>
                {inputs}
            </form>
        </div>
    );
};

export default Bracket;