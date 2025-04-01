import { useState, useMemo, useRef, useEffect } from 'react';
import { Job } from '../types';
import { JobCard } from '../components/JobCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { Jobs } from '../utils/mockJobs';
import { use } from 'framer-motion/client';


const salaryRanges = [
    { label: 'All Salaries', min: 0, max: Infinity },
    { label: '$30k - $45k', min: 30000, max: 45000 },
    { label: '$45k - $60k', min: 45000, max: 60000 },
    { label: '$60k - $75k', min: 60000, max: 75000 },
    { label: '$75k+', min: 75000, max: Infinity },
];


export const BrowseJobs = () => {

    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Getting all of the tags and job titles for predicitive text
    useEffect(() => {
        const fetchTags = () => {
            setIsLoading(true);

            const uniqueTags = new Set<string>();

            Jobs.forEach((job) => {
                job.tags.forEach((tag) => uniqueTags.add(tag));
                uniqueTags.add(job.title);
            });


            setTags(Array.from(uniqueTags));
            setIsLoading(false);
        };

        fetchTags();
        console.log('Tags:', tags);
    }, []);


    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocationType, setSelectedLocationType] = useState<'all' | 'remote' | 'onsite'>('all');
    const [selectedSalaryRange, setSelectedSalaryRange] = useState(salaryRanges[0]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    const [skillInput, setSkillInput] = useState('');

    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const suggestionsRef = useRef<HTMLUListElement | null>(null);

    const handleToggleJob = (jobId: string) => {
        setExpandedJobId(prev => (prev === jobId ? null : jobId));
    };

    // Filter jobs based on all criteria
    const filteredJobs = useMemo(() => {
        return Jobs.filter(job => {
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
                job.skills
                    .map((s) => s.toLowerCase())
                    .some((jobSkill) =>
                        selectedSkills.some((selected) => selected.toLowerCase() === jobSkill)
                    );

            return matchesSearch && matchesLocationType && matchesSalary && matchesSkills;
        });
    }, [searchQuery, selectedLocationType, selectedSalaryRange, selectedSkills]);

    // Toggle adding skills 
    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    // Generate suggestions based on search query and job data
    const suggestions = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return [];

        const uniqueSuggestions = new Set<string>();

        Jobs.forEach((job) => {
            if (job.title.toLowerCase().includes(query)) uniqueSuggestions.add(job.title);
            if (job.company.toLowerCase().includes(query)) uniqueSuggestions.add(job.company);
            if (job.location.toLowerCase().includes(query)) uniqueSuggestions.add(job.location);
        });

        return Array.from(uniqueSuggestions).slice(0, 5); // limit to 5 suggestions
    }, [searchQuery]);

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
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 150)} // small delay to allow click on suggestion
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setActiveSuggestionIndex(-1);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setActiveSuggestionIndex((prev) =>
                                        prev < suggestions.length - 1 ? prev + 1 : 0
                                    );
                                } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setActiveSuggestionIndex((prev) =>
                                        prev > 0 ? prev - 1 : suggestions.length - 1
                                    );
                                } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                                    e.preventDefault();
                                    setSearchQuery(suggestions[activeSuggestionIndex]);
                                    setActiveSuggestionIndex(-1);
                                }
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {isFocused && suggestions.length > 0 && (
                            <ul
                                ref={suggestionsRef}
                                className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 w-full max-h-60 overflow-y-auto"
                            >
                                {suggestions.map((item, index) => (
                                    <li
                                        key={index}
                                        onMouseDown={() => {
                                            setSearchQuery(item);
                                            setActiveSuggestionIndex(-1);
                                        }}
                                        className={`px-4 py-2 cursor-pointer text-sm text-gray-700 ${index === activeSuggestionIndex
                                            ? 'bg-indigo-100 text-indigo-800'
                                            : 'hover:bg-indigo-50'
                                            }`}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
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
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Skills</h3>

                                {/* Skill Tags */}
                                <div className="mb-2">
                                    {selectedSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => toggleSkill(skill)}
                                                className="ml-1 hover:text-indigo-900"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Input + Add Button */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
                                                    setSelectedSkills([...selectedSkills, skillInput.trim()]);
                                                    setSkillInput('');
                                                }
                                            }
                                        }}
                                        placeholder="Add a skill to filter..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
                                                setSelectedSkills([...selectedSkills, skillInput.trim()]);
                                                setSkillInput('');
                                            }
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        Add
                                    </button>
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