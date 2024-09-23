import React from 'react';

const General = () => {
    const inputs = Array.from({ length: 50 }, (_, index) => (
        <input key={index} type="text" placeholder={`General Input ${index + 1}`} className="form-control mb-2" />
    ));

    return (
        <div>
            <h2>General Tab</h2>
            <form>
                {inputs}
            </form>
        </div>
    );
};

export default General;