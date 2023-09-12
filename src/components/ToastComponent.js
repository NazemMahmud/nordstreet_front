import React from "react";

/**
 * Return toast message body
 * @param messages
 * @returns {JSX.Element}
 * @constructor
 */
const ToastComponent = ({ messages }) => {
    return (
        <div>
            { typeof (messages) == "string" ? <p>{messages}</p> :
                messages.map(item => (
                    <p key={item}>
                        {item}
                    </p>
                ))}
        </div>
    );
};

export default ToastComponent;
