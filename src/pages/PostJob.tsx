import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

export const PostJob = () => {

    const [phone, setPhone] = useState('');

    const [contactEmail, setContactEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);

    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [isSkillRejected, setIsSkillRejected] = useState(false);

    const [benefits, setBenefits] = useState<string[]>([]);
    const [benefitInput, setBenefitInput] = useState('');

    const [description, setDescription] = useState('');
    const [isDescriptionValid, setIsDescriptionValid] = useState(true);

    const bannedWords = [
        // General experience-related
        'experience',
        'years',
        'year',
        'prior',
        'previous',
        'proven',
        'required',
        'musthaveexperience',
        'experienced',
        'background',
        'expertise',
        'skilled',
        'veteran',
        'trackrecord',

        // Time-based phrases
        '2years',
        '3years',
        '5years',
        'oneyear',
        'twoyears',
        'threeplusyears',
        'multipleyears',
        'pastwork',

        // Skill-level gatekeeping
        'advanced',
        'senior',
        'expert',
        'guru',
        'highlyskilled',
        'independent',
        'selfstarter',
        'rockstar',
        'ninja',

        // Indirect phrases
        'musthave',
        'weexpect',
        'shouldhave',
        'idealcandidate',
        'minimumrequirement',
        'strongbackground',
        'established',
        'infield',

        // Roles to filter out
        'manager',
        'supervisor',
        'leadengineer',
        'techlead',
        'teamlead',
    ];

    // Format phone number as (xxx) xxx-xxxx
    const formatPhoneNumber = (value: string) => {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');

        // Format according to (xxx) xxx-xxxx
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

        if (!match) return value;

        const [, area, prefix, line] = match;
        if (line) return `(${area}) ${prefix}-${line}`;
        if (prefix) return `(${area}) ${prefix}`;
        if (area) return `(${area}`;
        return '';
    };

    // Validate email address
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(contactEmail)) {
            setIsEmailValid(false);
            return;
        }

        const descriptionIsValid = validateDescription(description);
        setIsDescriptionValid(descriptionIsValid);

        if (!descriptionIsValid) {
            return; // Prevent submission
        }

        // Submit the form...
    };

    // Checking whether a skill is valid
    const isSkillValid = (skill: string) => {
        const cleaned = skill.toLowerCase().replace(/[^a-z]/g, '');
        return !bannedWords.some(banned =>
            levenshteinDistance(cleaned, banned) <= 2
        );
    };

    // Adding skills to list
    const addSkill = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedSkill = skillInput.trim();

        // Check if skill is accepted
        if (
            cleanedSkill &&
            skills.length < 5 &&
            isSkillValid(cleanedSkill)
        ) {
            setSkills([...skills, cleanedSkill]);
            setSkillInput('');
        }

        // Check if skill is rejected
        if (!isSkillValid(cleanedSkill)) {
            setIsSkillRejected(true);
            return;
        }
        setIsSkillRejected(false);
    };

    // Removing skills from list
    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    // Adding benefits to list
    const addBenefit = (e: React.FormEvent) => {
        e.preventDefault();
        if (benefitInput.trim()) {
            setBenefits([...benefits, benefitInput.trim()]);
            setBenefitInput('');
        }
    };

    // Remove benefit from list
    const removeBenefit = (benefitToRemove: string) => {
        setBenefits(benefits.filter((b) => b !== benefitToRemove));
    };

    // Levenshtein Distance function to detect similar words
    const levenshteinDistance = (a: string, b: string) => {
        const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]).map((row, i) =>
            row.concat(Array.from({ length: a.length }, (_, j) => j === 0 ? i : 0))
        );

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] = b[i - 1] === a[j - 1]
                    ? matrix[i - 1][j - 1]
                    : Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
            }
        }

        return matrix[b.length][a.length];
    };

    // Validate job description against banned words
    const validateDescription = (desc: string): boolean => {
        // Normalize: remove symbols, make lowercase, and remove extra spaces
        const cleaned = desc.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
        const words = cleaned.split(' ');

        return !words.some(word =>
            bannedWords.some(banned =>
                levenshteinDistance(word, banned) <= 2 // allow for small typos
            )
        );
    };

    // Calculate expiration date (1 month from today)
    const today = new Date();
    const expirationDate = new Date(today.setMonth(today.getMonth() + 1));
    const formattedExpiration = expirationDate.toISOString().split('T')[0];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Post a Job</h1>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Posting Guidelines</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside">
                                    <li>Must be truly entry-level (no experience required)</li>
                                    <li>Clear job description and responsibilities</li>
                                    <li>Transparent salary range</li>
                                    <li>Maximum 5 desired skills</li>
                                    <li>Listing expires in 30 days</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Junior Software Developer"
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="company"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="City, State or Remote"
                                />
                            </div>

                            <div>
                                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                                    Salary Range <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="salary"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., $40,000 - $50,000"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                                    maxLength={14}
                                    required
                                    placeholder="(123) 456-7890"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="extension" className="block text-sm font-medium text-gray-700 mb-2">
                                    Extension (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="extension"
                                    name="extension"
                                    placeholder="e.g., 101"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* CONTACT EMAIL */}
                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={contactEmail}
                                onChange={(e) => {
                                    setContactEmail(e.target.value);
                                    setIsEmailValid(validateEmail(e.target.value));
                                }}
                                required
                                placeholder="hr@example.com"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isEmailValid
                                    ? 'border-gray-300 focus:ring-indigo-500'
                                    : 'border-red-500 focus:ring-red-500'
                                    }`}
                            />
                            {!isEmailValid && (
                                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Desired Skills (Maximum 5) <span className="text-red-500">*</span>
                            </label>
                            <div className="mb-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="ml-1 hover:text-indigo-900"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                                {isSkillRejected && (
                                    <p className="text-red-500 text-sm mt-1">
                                        That skill is not allowed for an entry-level position.
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSkill(e);
                                        }
                                    }}
                                    disabled={skills.length >= 5}
                                    placeholder={
                                        skills.length >= 5 ? 'Maximum skills reached' : 'Add a skill...'
                                    }
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    disabled={skills.length >= 5 || !skillInput.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Benefits (No Limit) <span className="text-red-500">*</span>
                            </label>

                            {/* BENEFIT TAGS */}
                            <div className="mb-2">
                                {benefits.map((benefit) => (
                                    <span
                                        key={benefit}
                                        className="inline-flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                                    >
                                        {benefit}
                                        <button
                                            type="button"
                                            onClick={() => removeBenefit(benefit)}
                                            className="ml-1 hover:text-indigo-900"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {/* BENEFIT INPUT + ADD BUTTON */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={benefitInput}
                                    onChange={(e) => setBenefitInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addBenefit(e);
                                        }
                                    }}
                                    placeholder="Add a benefit..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={addBenefit}
                                    disabled={!benefitInput.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                rows={6}
                                value={description}
                                onChange={(e) => {
                                    const text = e.target.value;
                                    setDescription(text);
                                    setIsDescriptionValid(validateDescription(text));
                                }}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDescriptionValid
                                    ? 'border-gray-300 focus:ring-indigo-500'
                                    : 'border-red-500 focus:ring-red-500'
                                    }`}
                                placeholder="Describe the role, responsibilities, and what makes it suitable for entry-level candidates..."
                            ></textarea>
                            {!isDescriptionValid && (
                                <p className="text-red-500 text-sm mt-1">
                                    Please remove any reference to experience requirements — this must be truly entry-level.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiration Date
                            </label>
                            <input
                                type="date"
                                value={formattedExpiration}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Job listings automatically expire 30 days after posting
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={!isDescriptionValid || description.trim() === ''}
                            className={`w-full px-6 py-3 rounded-lg transition-colors text-white ${isDescriptionValid
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-gray-300 cursor-not-allowed'
                                }`}
                        >
                            Post Job
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};