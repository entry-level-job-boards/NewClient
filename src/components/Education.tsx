import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

type EducationProps = {
    handleSaveChanges: () => void;
    userData: any;
    isOwner: boolean;
};

type EducationDetails = {
    institution: string;
    degree: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    stillStudying: boolean;
};

export const Education: React.FC<EducationProps> = ({ handleSaveChanges, userData, isOwner }) => {
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [educationDetails, setEducationDetails] = useState<EducationDetails[]>([
        {
            institution: '',
            degree: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            stillStudying: false,
        },
    ]);

    useEffect(() => {
        console.log('User: ', userData);
    }, [userData]);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 min-h-[250px] relative">
            <div className='flex justify-between items-center'>
                <h2>Education</h2>
                <button className={`px-4 py-2 rounded-lg transition-all duration-200 ${isEditingEducation
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => setIsEditingEducation(!isEditingEducation)}
                >
                    {isOwner && (
                        isEditingEducation ? 'Save Changes' : <Pencil />
                    )}
                </button>
            </div>
            {/* Adding temporarily to get rid of error */}
            {isEditingEducation ? (
                <div className='flex flex-col gap-4 mt-2'>
                    <div>
                        <input type='text' placeholder='Institution' className='border rounded-lg p-2 w-full outline-none' />
                        <input type='text' placeholder='Degree' className='border rounded-lg p-2 w-full mt-5 outline-none' />
                    </div>

                    <div className='flex flex-row gap-4'>
                        {/* Start Date */}
                        <div className='flex flex-col w-full'>
                            <label className='mb-1 text-sm font-medium text-gray-700'>Start Date</label>
                            <div className='flex gap-2'>
                                <select className='border rounded-lg p-2 w-1/2 outline-none'>
                                    <option value="">Month</option>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i} value={String(i + 1).padStart(2, '0')}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                                <select className='border rounded-lg p-2 w-1/2 outline-none'>
                                    <option value="">Year</option>
                                    {Array.from({ length: 100 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* End Date */}
                        <div className='flex flex-col w-full'>
                            <label className='mb-1 text-sm font-medium text-gray-700'>End Date</label>
                            <div className='flex gap-2'>
                                <select className='border rounded-lg p-2 w-1/2 outline-none'>
                                    <option value="">Month</option>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i} value={String(i + 1).padStart(2, '0')}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                                <select className='border rounded-lg p-2 w-1/2 outline-none'>
                                    <option value="">Year</option>
                                    {Array.from({ length: 100 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2 ml-1">
                        <input
                            type="checkbox"
                            id="stillStudying"
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="stillStudying" className="text-sm font-medium text-gray-700">
                            Still Studying
                        </label>
                    </div>

                </div>
            ) : (
                <div>
                    {/* Checking to see if education detail keys have any actual values or if they are empty */}
                    {educationDetails.some(e => e.institution || e.degree || e.startMonth || e.startYear || e.endMonth || e.endYear) ? (
                        educationDetails.map((education, index) => (
                            <div key={index} className='border-b border-gray-300 py-2'>
                                <h3 className='text-lg font-semibold'>{education.institution}</h3>
                                <p className='text-gray-600'>{education.degree}</p>
                                <p className='text-gray-600'>
                                    {education.startMonth}/{education.startYear} - {education.stillStudying ? 'Present' : education.endMonth + '/' + education.endYear}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className='relative w-full min-h-[200px]'>
                            <p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center letter-spacing text-gray-500'>
                                No education details yet. <br /> Click the '<Pencil className="inline w-4 h-4" />' to get started!
                            </p>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    )
}