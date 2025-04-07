import React, { useState, useEffect } from 'react';

type EducationProps = {
    handleSaveChanges: () => void;
    userData: any;
};

type EducationDetails = {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    stillStudying: boolean;
};

export const Education: React.FC<EducationProps> = ({ handleSaveChanges, userData }) => {

    return (
        <div className="bg-white shadow-md rounded-lg p-4 min-h-[250px] relative">
            <h2>Education</h2>
            <p>Details about education will go here.</p>
            {/* Adding temporarily to get rid of error */}
            <p onClick={handleSaveChanges}>hello</p>
        </div>
    )
}