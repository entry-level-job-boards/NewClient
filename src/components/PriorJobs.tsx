import React, { useState, useEffect } from 'react';
import { Pencil, X, Sparkles, Pen } from 'lucide-react';

type priorJobsProps = {
    handleSaveChanges: () => void;
    isEditing: boolean;
    isOwner?: boolean;
    userData?: any;
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

export const PriorJobs: React.FC<priorJobsProps> = ({ handleSaveChanges, isEditing, isOwner, userData }) => {
    const backendURL = import.meta.env.VITE_LINK;

    const [editingJobIndex, setEditingJobIndex] = useState<number | null>(null);
    const [isEditingJobs, setIsEditingJobs] = useState(false);
    const [priorJobs, setPriorJobs] = useState<PriorJob[]>([]);
    const [newJob, setNewJob] = useState<PriorJob>({
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        is_current: false,
        bullet_points: [''],
    });

    useEffect(() => {
        if (userData && Array.isArray(userData.prior_jobs)) {
            setPriorJobs(userData.prior_jobs);
        }
    }, [userData]);

    const handleJobChange = (index: number, field: keyof PriorJob, value: any) => {
        const jobsCopy = [...priorJobs];
        jobsCopy[index] = { ...jobsCopy[index], [field]: value };
        setPriorJobs(jobsCopy);
    };

    const handleBulletPointChange = (jobIndex: number, bulletIndex: number, value: string) => {
        const jobsCopy = [...priorJobs];
        const job = jobsCopy[jobIndex];
        job.bullet_points[bulletIndex] = value;
        setPriorJobs(jobsCopy);
    };

    const addBulletPoint = (jobIndex: number) => {
        const jobsCopy = [...priorJobs];
        jobsCopy[jobIndex].bullet_points.push('');
        setPriorJobs(jobsCopy);
    };

    const addNewBulletPoint = () => {
        setNewJob(prev => ({
            ...prev,
            bullet_points: [...prev.bullet_points, '']
        }));
    };

    const handleNewJobChange = (field: keyof PriorJob, value: any) => {
        setNewJob(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        let updatedJobs = [...priorJobs];

        if (editingJobIndex === -1) {
            // Add new job
            updatedJobs.push(newJob);
        } else if (editingJobIndex !== null) {
            // Edit existing job
            updatedJobs[editingJobIndex] = newJob;
        }

        setPriorJobs(updatedJobs);
        setEditingJobIndex(null);
        setNewJob({
            jobTitle: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            is_current: false,
            bullet_points: [''],
        });

        try {
            const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
            await fetch(`${backendURL}api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_ENCRYPTION_KEY!
                },
                body: JSON.stringify({ prior_jobs: updatedJobs })
            });
            console.log('✅ Jobs updated');
        } catch (err) {
            console.error('❌ Failed to save jobs:', err);
        }
    };

    useEffect(() => {
        if (editingJobIndex !== null && editingJobIndex !== -1) {
            const jobToEdit = priorJobs[editingJobIndex];
            setNewJob(jobToEdit);
        }
    }, [editingJobIndex]);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 min-h-[250px] relative">
            <div className='flex justify-between items-center'>
                <h2 className="text-lg font-semibold mb-4">Work History</h2>
                {/* <button className={`px-4 py-2 rounded-xl transition-all duration-200 ${isEditingJobs
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => setIsEditingJobs(!isEditingJobs)}
                >
                    {isOwner && (
                        isEditingJobs ? 'Save Changes' : <Pencil />
                    )}
                </button> */}
                {isOwner && (
                    <div className="flex gap-2">
                        {isEditingJobs && (
                            <>
                                <button
                                    className="px-4 py-2 rounded-xl bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-shadow shadow-md"
                                    onClick={() => setEditingJobIndex(-1)}
                                >
                                    <Pen className="h-5 w-5 mr-2 inline" />
                                    +
                                </button>
                                <button
                                    onClick={() => setIsEditingJobs(false)}
                                    className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        <button
                            className={`px-4 py-2 rounded-xl transition-all duration-200 ${isEditingJobs
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'text-indigo-600 hover:bg-indigo-50'
                                }`}
                            onClick={() => {
                                if (isEditingJobs) handleSave();
                                setIsEditingJobs(!isEditingJobs);
                            }}
                        >
                            {isEditingJobs ? 'Save Changes' : <Pencil />}
                        </button>
                    </div>
                )}
            </div>
            <ul className="list-disc pl-5 list-none mt-2">
                {priorJobs.length > 0 ? (
                    priorJobs.map((job, index) => (
                        <li key={index} className="mb-6 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow ">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {job.jobTitle} <span className="text-gray-700 font-medium">at</span> {job.company}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {job.location} &mdash; {job.startDate} to {job.is_current ? 'Present' : job.endDate}
                                    </p>
                                </div>
                                {isEditingJobs && (
                                    <button
                                        onClick={() => setEditingJobIndex(index)}
                                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                        title="Edit Job"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {job.bullet_points.length > 0 && (
                                <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc list-inside">
                                    {job.bullet_points.map((point, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <Sparkles className="h-4 w-4 text-indigo-600 mt-0.5" />
                                            <p>{point}</p>
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))
                ) : (
                    <>
                        <li>No prior jobs added.</li>
                    </>
                )}
            </ul>

            {editingJobIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setEditingJobIndex(null)}
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            {editingJobIndex === -1 ? 'Add Job' : 'Edit Job'}
                        </h2>

                        <div className="space-y-4">
                            {(editingJobIndex === -1 ? (
                                <>
                                    <input
                                        type="text"
                                        value={newJob.jobTitle}
                                        onChange={(e) => handleNewJobChange('jobTitle', e.target.value)}
                                        placeholder="Job Title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        value={newJob.company}
                                        onChange={(e) => handleNewJobChange('company', e.target.value)}
                                        placeholder="Company"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        value={newJob.location}
                                        onChange={(e) => handleNewJobChange('location', e.target.value)}
                                        placeholder="Location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newJob.startDate}
                                            onChange={(e) => handleNewJobChange('startDate', e.target.value)}
                                            placeholder="Start Date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                        {!newJob.is_current && (
                                            <input
                                                type="text"
                                                value={newJob.endDate}
                                                onChange={(e) => handleNewJobChange('endDate', e.target.value)}
                                                placeholder="End Date"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        )}
                                    </div>
                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={newJob.is_current}
                                            onChange={(e) => handleNewJobChange('is_current', e.target.checked)}
                                        />
                                        Currently Working Here
                                    </label>
                                    <label className="block font-medium mt-2">Bullet Points</label>
                                    {newJob.bullet_points.map((point, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={point}
                                            onChange={(e) =>
                                                setNewJob(prev => {
                                                    const updated = [...prev.bullet_points];
                                                    updated[i] = e.target.value;
                                                    return { ...prev, bullet_points: updated };
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                                        />
                                    ))}
                                    <button
                                        className="text-sm text-indigo-600 mt-2 hover:underline"
                                        onClick={addNewBulletPoint}
                                    >
                                        + Add Bullet Point
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={priorJobs[editingJobIndex].jobTitle}
                                        onChange={(e) => handleJobChange(editingJobIndex, 'jobTitle', e.target.value)}
                                        placeholder="Job Title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        value={priorJobs[editingJobIndex].company}
                                        onChange={(e) => handleJobChange(editingJobIndex, 'company', e.target.value)}
                                        placeholder="Company"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        value={priorJobs[editingJobIndex].location}
                                        onChange={(e) => handleJobChange(editingJobIndex, 'location', e.target.value)}
                                        placeholder="Location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={priorJobs[editingJobIndex].startDate}
                                            onChange={(e) => handleJobChange(editingJobIndex, 'startDate', e.target.value)}
                                            placeholder="Start Date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                        {!priorJobs[editingJobIndex].is_current && (
                                            <input
                                                type="text"
                                                value={priorJobs[editingJobIndex].endDate}
                                                onChange={(e) => handleJobChange(editingJobIndex, 'endDate', e.target.value)}
                                                placeholder="End Date"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        )}
                                    </div>

                                    <label className="inline-flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={priorJobs[editingJobIndex].is_current}
                                            onChange={(e) => handleJobChange(editingJobIndex, 'is_current', e.target.checked)}
                                        />
                                        Currently Working Here
                                    </label>

                                    <label className="block font-medium mt-2">Bullet Points</label>
                                    {priorJobs[editingJobIndex].bullet_points.map((point, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={point}
                                            onChange={(e) => handleBulletPointChange(editingJobIndex, i, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                                        />
                                    ))}

                                    <button
                                        className="text-sm text-indigo-600 mt-2 hover:underline"
                                        onClick={() => addBulletPoint(editingJobIndex)}
                                    >
                                        + Add Bullet Point
                                    </button>
                                </>
                            ))}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                                    onClick={() => setEditingJobIndex(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};