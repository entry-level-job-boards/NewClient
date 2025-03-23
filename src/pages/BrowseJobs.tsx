import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { JobCard } from '../components/JobCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const sampleJobs: Job[] = [
    {
        id: '1',
        title: 'Junior Software Developer',
        company: 'TechStart Solutions',
        location: 'Remote',
        description: 'Looking for a passionate developer to join our team. We provide comprehensive training and mentorship to help you grow in your role.',
        benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget', 'Remote Work'],
        deadline: 'March 30, 2024',
        salary: '$50,000 - $65,000',
        isRemote: true,
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
        postedDate: '2024-02-20',
        expirationDate: '2024-03-20'
    },
    {
        id: '2',
        title: 'Customer Success Associate',
        company: 'GrowthBase',
        location: 'New York, NY',
        description: 'Join our customer success team and help clients achieve their goals. Full training provided for the right candidate.',
        benefits: ['401(k)', 'Health Benefits', 'Professional Development', 'Team Events'],
        deadline: 'April 15, 2024',
        salary: '$45,000 - $55,000',
        isRemote: false,
        skills: ['Communication', 'Customer Service', 'Problem Solving', 'MS Office'],
        postedDate: '2024-02-25',
        expirationDate: '2024-03-25'
    },
];

const salaryRanges = [
    { label: 'All Salaries', min: 0, max: Infinity },
    { label: '$30k - $45k', min: 30000, max: 45000 },
    { label: '$45k - $60k', min: 45000, max: 60000 },
    { label: '$60k - $75k', min: 60000, max: 75000 },
    { label: '$75k+', min: 75000, max: Infinity },
];

export const BrowseJobs = () => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocationType, setSelectedLocationType] = useState<'all' | 'remote' | 'onsite'>('all');
    const [selectedSalaryRange, setSelectedSalaryRange] = useState(salaryRanges[0]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    // Get unique skills from all jobs
    const allSkills = useMemo(() => {
        const skillsSet = new Set<string>();
        sampleJobs.forEach(job => job.skills.forEach(skill => skillsSet.add(skill)));
        return Array.from(skillsSet);
    }, []);

    const handleToggleJob = (jobId: string) => {
        setExpandedJobId(prev => (prev === jobId ? null : jobId));
    };

    // Filter jobs based on all criteria
    const filteredJobs = useMemo(() => {
        return sampleJobs.filter(job => {
            // Search query filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.location.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower);

            // Location type filter
            const matchesLocationType =
                selectedLocationType === 'all' ||
                (selectedLocationType === 'remote' && job.isRemote) ||
                (selectedLocationType === 'onsite' && !job.isRemote);

            // Salary filter
            const jobSalary = parseInt(job.salary.replace(/[^0-9]/g, ''));
            const matchesSalary =
                jobSalary >= selectedSalaryRange.min && jobSalary <= selectedSalaryRange.max;

            // Skills filter
            const matchesSkills =
                selectedSkills.length === 0 ||
                selectedSkills.every(skill => job.skills.includes(skill));

            return matchesSearch && matchesLocationType && matchesSalary && matchesSkills;
        });
    }, [searchQuery, selectedLocationType, selectedSalaryRange, selectedSkills]);

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by title, company, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isFiltersOpen
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                        {(selectedLocationType !== 'all' || selectedSalaryRange !== salaryRanges[0] || selectedSkills.length > 0) && (
                            <span className="ml-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {(selectedLocationType !== 'all' ? 1 : 0) +
                                    (selectedSalaryRange !== salaryRanges[0] ? 1 : 0) +
                                    (selectedSkills.length > 0 ? 1 : 0)}
                            </span>
                        )}
                    </button>
                </div>

                {isFiltersOpen && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Location Type Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Location Type</h3>
                                <div className="space-y-2">
                                    {[
                                        { value: 'all', label: 'All Locations' },
                                        { value: 'remote', label: 'Remote Only' },
                                        { value: 'onsite', label: 'On-site Only' },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="locationType"
                                                value={option.value}
                                                checked={selectedLocationType === option.value}
                                                onChange={(e) => setSelectedLocationType(e.target.value as typeof selectedLocationType)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Salary Range Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h3>
                                <div className="space-y-2">
                                    {salaryRanges.map((range) => (
                                        <label key={range.label} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="salaryRange"
                                                checked={selectedSalaryRange === range}
                                                onChange={() => setSelectedSalaryRange(range)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-gray-700">{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Skills Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                                <div className="space-y-2">
                                    {allSkills.map((skill) => (
                                        <label key={skill} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedSkills.includes(skill)}
                                                onChange={() => toggleSkill(skill)}
                                                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-gray-700">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(selectedLocationType !== 'all' || selectedSalaryRange !== salaryRanges[0] || selectedSkills.length > 0) && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-gray-500">Active filters:</span>
                                    {selectedLocationType !== 'all' && (
                                        <span className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm">
                                            {selectedLocationType === 'remote' ? 'Remote Only' : 'On-site Only'}
                                            <button
                                                onClick={() => setSelectedLocationType('all')}
                                                className="ml-1 hover:text-indigo-900"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedSalaryRange !== salaryRanges[0] && (
                                        <span className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm">
                                            {selectedSalaryRange.label}
                                            <button
                                                onClick={() => setSelectedSalaryRange(salaryRanges[0])}
                                                className="ml-1 hover:text-indigo-900"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedSkills.map(skill => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm"
                                        >
                                            {skill}
                                            <button
                                                onClick={() => toggleSkill(skill)}
                                                className="ml-1 hover:text-indigo-900"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </span>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setSelectedLocationType('all');
                                            setSelectedSalaryRange(salaryRanges[0]);
                                            setSelectedSkills([]);
                                        }}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isExpanded={expandedJobId === job.id}
                            onToggle={handleToggleJob}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No jobs match your current filters.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedLocationType('all');
                                setSelectedSalaryRange(salaryRanges[0]);
                                setSelectedSkills([]);
                            }}
                            className="mt-4 text-indigo-600 hover:text-indigo-800"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};