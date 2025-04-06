import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';

type priorJobsProps = {
    handleSaveChanges: () => void;
    isEditing: boolean;
    isOwner?: boolean;
};

type PriorJob = {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    is_current: boolean;
    bullet_points: string[];
};

export const PriorJobs: React.FC<priorJobsProps> = ({ handleSaveChanges, isEditing, isOwner }) => {
    const [priorJobs, setPriorJobs] = useState<PriorJob[]>([
        // {
        //     jobTitle: 'Software Engineer',
        //     company: 'Tech Corp',
        //     location: 'New York, NY',
        //     startDate: 'June 2020',
        //     endDate: 'Present',
        //     is_current: true,
        //     bullet_points: ['Developed web applications', 'Collaborated with cross-functional teams'],
        // },
        // {
        //     jobTitle: 'Web Developer',
        //     company: 'Web Solutions',
        //     location: 'San Francisco, CA',
        //     startDate: 'January 2019',
        //     endDate: 'May 2020',
        //     is_current: false,
        //     bullet_points: ['Built responsive websites', 'Optimized website performance'],
        // },
        // {
        //     jobTitle: 'Intern',
        //     company: 'Startup Inc.',
        //     location: 'Remote',
        //     startDate: 'June 2018',
        //     endDate: 'August 2018',
        //     is_current: false,
        //     bullet_points: ['Assisted in software development', 'Conducted market research'],
        // }
    ]);

    useEffect(() => {
        const storedJobs = localStorage.getItem('priorJobs');
        if (storedJobs) {
            setPriorJobs(JSON.parse(storedJobs));
        }
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 min-h-[250px]">
            <h2 className="text-lg font-semibold mb-4">Work History</h2>
            <ul className="list-disc pl-5">
                {priorJobs.length > 0 ? (
                    priorJobs.map((job, index) => (
                        <li key={index} className="mb-2">
                            <div className="font-semibold">{job.jobTitle} at {job.company}</div>
                            <div className="text-sm text-gray-600">
                                {job.location} — {job.startDate} to {job.is_current ? 'Present' : job.endDate}
                            </div>
                            <ul className="list-disc pl-5 mt-1 text-sm text-gray-700">
                                {job.bullet_points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No prior jobs available.</p>
                )}
            </ul>
        </div>


    );
}