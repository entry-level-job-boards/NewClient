import React, { useState, useEffect } from 'react';
import { Pencil, Pen } from 'lucide-react';

type EducationProps = {
    handleSaveChanges: () => void;
    userData: any;
    isOwner: boolean;
};

type EducationDetails = {
    institution: string;
    degree: string;
    degree_type: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    stillStudying: boolean;
};

export const Education: React.FC<EducationProps> = ({ handleSaveChanges, userData, isOwner }) => {
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [addingEducation, setAddingEducation] = useState(false);
    const [isEditingEducationIndex, setIsEditingEducationIndex] = useState<number | null>(null);
    const [educationDetails, setEducationDetails] = useState<EducationDetails[]>([]);

    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    const backendURL = import.meta.env.VITE_LINK;

    const handleInputChange = (index: number, field: keyof EducationDetails, value: string | boolean) => {
        setEducationDetails(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
        console.log(educationDetails);
    };

    const saveEducation = async (updatedDetails: EducationDetails[]) => {
        const form = new FormData();
        form.append('education', JSON.stringify(updatedDetails));

        try {
            const response = await fetch(`${backendURL}api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'x-api-key': import.meta.env.VITE_ENCRYPTION_KEY!
                },
                body: form,
            });

            if (!response.ok) throw new Error('Failed to save education');
            const result = await response.json();
            console.log('✅ Education saved:', result);
        } catch (err) {
            console.error('❌ Failed to auto-save:', err);
        }
    };

    const addNewEducation = () => {
        setEducationDetails(prev => [...prev, {
            institution: '',
            degree: '',
            degree_type: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            stillStudying: false,
        }]);

        console.log(educationDetails);
    };

    const handleDeleteEducation = async (index: number) => {
        const updated = [...educationDetails];
        updated.splice(index, 1); // remove the entry at that index
        setEducationDetails(updated); // update local state

        const form = new FormData();
        form.append('education', JSON.stringify(updated));

        try {
            const response = await fetch(`${backendURL}api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'x-api-key': import.meta.env.VITE_ENCRYPTION_KEY!
                },
                body: form,
            });

            if (!response.ok) throw new Error('Failed to delete education entry');
            const result = await response.json();
            console.log('✅ Education entry deleted:', result);
        } catch (err) {
            console.error('❌ Failed to delete education:', err);
        }
    };

    const getMonthName = (monthNumber: string | number) => {
        if (!monthNumber) return '';
        const monthIndex = parseInt(monthNumber.toString(), 10) - 1;
        return new Date(0, monthIndex).toLocaleString('default', { month: 'long' });
    };

    // Parse the education data from userData
    useEffect(() => {
        try {
            let edu = userData?.education;

            if (typeof edu === 'string') {
                edu = JSON.parse(edu);
            }

            if (Array.isArray(edu)) {
                setEducationDetails(edu);
                console.log('✅ Parsed and set education details:', edu);
            } else {
                console.warn('⚠️ Parsed education is not an array:', edu);
            }
        } catch (err) {
            console.error('❌ Failed to parse education from userData:', err);
        }
    }, [userData?.education]);

    return (
        <>
            <div className="bg-white shadow-md rounded-lg p-4 min-h-[250px] relative">
                <div className='flex justify-between items-center'>
                    <h2 className="text-lg font-semibold ml-1">Education</h2>
                    {isOwner && (
                        <div className='flex gap-2 flex-row items-center'>
                            {isEditingEducation && (
                                <>
                                    <button
                                        className="px-4 py-2 rounded-xl bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-shadow shadow-md"
                                        onClick={() => {
                                            const newIndex = educationDetails.length;
                                            addNewEducation();
                                            // Wait for educationDetails to actually update before opening the modal
                                            setTimeout(() => {
                                                setIsEditingEducation(true);
                                                setIsEditingEducationIndex(newIndex);
                                                setAddingEducation(true);
                                            }, 0);
                                        }}
                                    >
                                        <Pen className="h-5 w-5 inline" />
                                        +
                                    </button>
                                    <button
                                        onClick={() => setIsEditingEducation(false)}
                                        className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                            <button className={`px-4 py-2 rounded-lg transition-all duration-200 ${isEditingEducation
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'text-indigo-600 hover:bg-indigo-50'
                                }`}
                                onClick={() => setIsEditingEducation(!isEditingEducation)}
                            >

                                {isEditingEducation ? 'Save Changes' : <Pencil />}

                            </button>
                        </div>
                    )}
                </div>

                <ul className="mt-4 space-y-4">
                    {educationDetails.length > 0 ? (
                        educationDetails
                            .filter(
                                (education) =>
                                    education.institution.trim() !== '' ||
                                    education.degree.trim() !== '' ||
                                    education.degree_type.trim() !== '' ||
                                    education.startMonth.trim() !== '' ||
                                    education.startYear.trim() !== '' ||
                                    education.endMonth.trim() !== '' ||
                                    education.endYear.trim() !== ''
                            )
                            .map((education, index) => (
                                <li
                                    key={index}
                                    className="relative mb-6 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {education.degree}{' '}
                                            <span className="text-sm text-gray-500">({education.degree_type})</span>
                                        </h3>
                                        <p className="text-gray-600">{education.institution}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {getMonthName(education.startMonth)} {education.startYear} –{' '}
                                            {education.stillStudying
                                                ? 'Present'
                                                : `${getMonthName(education.endMonth)} ${education.endYear}`}
                                        </p>
                                    </div>
                                    {isEditingEducation && (
                                        <>
                                            <button
                                                onClick={() => setIsEditingEducationIndex(index)}
                                                className="absolute top-5 right-5 text-indigo-600 hover:text-indigo-800 transition-colors"
                                                title="Edit Job"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteEducation(index)}
                                                className="absolute bottom-5 right-5 text-red-600 hover:text-red-800 transition-colors"
                                                title="Delete Education"
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))
                    ) : (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setAddingEducation(true)}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Add Education
                            </button>
                        </div>
                    )}
                </ul>
            </div >


            {(addingEducation || isEditingEducationIndex !== null) && (() => {
                const index = isEditingEducationIndex !== null ? isEditingEducationIndex : educationDetails.length;

                // Fallback for new item
                const education = educationDetails[index] ?? {
                    institution: '',
                    degree: '',
                    degree_type: '',
                    startMonth: '',
                    startYear: '',
                    endMonth: '',
                    endYear: '',
                    stillStudying: false,
                };

                return (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                        onClick={() => {
                            setIsEditingEducationIndex(null);
                            setAddingEducation(false);
                        }}
                    >
                        <div
                            className="h-[95%] w-[95%] md:h-[75%] md:w-[40%] bg-white shadow-md rounded-lg overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 h-[95%] w-[95%] md:h-[75%] md:w-[40%] bg-white shadow-md rounded-lg overflow-y-auto">
                                <h1 className="text-[24px] font-semibold mt-4 ml-4">
                                    {addingEducation ? "Adding Education" : "Updating Education"}
                                </h1>
                                <div className='flex flex-col gap-4 mt-4'>
                                    <label className="text-sm font-medium text-gray-700 ml-5 mt-2">University</label>
                                    <input
                                        type="text"
                                        placeholder="Institution"
                                        value={education.institution}
                                        onChange={(e) => handleInputChange(index, 'institution', e.target.value)}
                                        disabled={!isEditingEducation}
                                        className="w-[95%] mx-auto h-[44px] border border-gray-300 rounded-md px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />

                                    <label className="text-sm font-medium text-gray-700 ml-5 mt-2">Degree</label>
                                    <input
                                        type="text"
                                        placeholder="Degree"
                                        value={education.degree}
                                        onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                                        disabled={!isEditingEducation}
                                        className="w-[95%] mx-auto h-[44px] border border-gray-300 rounded-md px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />

                                    <label className="text-sm font-medium text-gray-700 ml-5 mt-2">Degree Type</label>
                                    <select
                                        value={education.degree_type}
                                        onChange={(e) => handleInputChange(index, 'degree_type', e.target.value)}
                                        disabled={!isEditingEducation}
                                        className="w-[95%] mx-auto h-[44px] border border-gray-300 rounded-md px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Degree Type</option>
                                        <option value="Bachelor's">Bachelor's</option>
                                        <option value="Master's">Master's</option>
                                        <option value="PhD">PhD</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Certificate">Certificate</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    <div className='flex flex-row gap-4 w-[95%] mx-auto'>
                                        <label className='text-sm font-medium text-gray-700 w-[49%]'>Start Date</label>
                                        <label className='text-sm font-medium text-gray-700'>End Date</label>
                                    </div>

                                    <div className='flex flex-row gap-4 justify-between w-[95%] mx-auto'>
                                        {/* Start Date */}
                                        <div className='flex gap-2 w-full'>
                                            <select
                                                value={education.startMonth}
                                                onChange={(e) => handleInputChange(index, 'startMonth', e.target.value)}
                                                disabled={!isEditingEducation}
                                                className='w-1/2 h-[40px] border border-gray-300 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                            >
                                                <option value="">Month</option>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i} value={i + 1}>
                                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                value={education.startYear}
                                                onChange={(e) => handleInputChange(index, 'startYear', e.target.value)}
                                                disabled={!isEditingEducation}
                                                className="w-1/2 h-[40px] border border-gray-300 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Year</option>
                                                {Array.from({ length: 100 }, (_, i) => {
                                                    const year = new Date().getFullYear() - i;
                                                    return <option key={year} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </div>

                                        {/* End Date */}
                                        <div className='flex gap-2 w-full'>
                                            <select
                                                value={education.endMonth}
                                                onChange={(e) => handleInputChange(index, 'endMonth', e.target.value)}
                                                disabled={!isEditingEducation || education.stillStudying}
                                                className='w-1/2 h-[40px] border border-gray-300 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                            >
                                                <option value="">Month</option>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i} value={i + 1}>
                                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                value={education.endYear}
                                                onChange={(e) => handleInputChange(index, 'endYear', e.target.value)}
                                                disabled={!isEditingEducation || education.stillStudying}
                                                className="w-1/2 h-[40px] border border-gray-300 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Year</option>
                                                {Array.from({ length: 100 }, (_, i) => {
                                                    const year = new Date().getFullYear() - i;
                                                    return <option key={year} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <label className='flex items-center mt-1 ml-5'>
                                        <input
                                            type="checkbox"
                                            checked={education.stillStudying}
                                            onChange={(e) => handleInputChange(index, 'stillStudying', e.target.checked)}
                                            disabled={!isEditingEducation}
                                            className='mr-2 h-[20px] w-[20px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        />
                                        Currently Enrolled
                                    </label>
                                </div>

                                <button
                                    onClick={() => {
                                        const updated = [...educationDetails];
                                        updated[isEditingEducationIndex ?? updated.length - 1] = education;
                                        setEducationDetails(updated);
                                        saveEducation(updated);
                                        setIsEditingEducationIndex(null);
                                        setAddingEducation(false);
                                    }}
                                    className='absolute bottom-2 right-2 bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4'
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() => {
                                        setIsEditingEducationIndex(null);
                                        setAddingEducation(false);
                                    }}
                                    className='absolute bottom-2 left-2 bg-red-600 text-white px-4 py-2 rounded-lg mt-4'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div >
                    </div >
                );
            })()}
        </>
    )
}