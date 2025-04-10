// resources/js/Components/SelectInput.jsx
import React from "react";

const SelectInput = ({
    id,
    value,
    className,
    onChange,
    children,
    ...props
}) => {
    return (
        <select
            id={id}
            value={value}
            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
            onChange={onChange}
            {...props}
        >
            {children}
        </select>
    );
};

export default SelectInput;
