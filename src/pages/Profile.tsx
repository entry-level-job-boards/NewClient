import React, { useState, useEffect } from 'react';
import { secureFetch } from '../utils/secureFetch';
import { User, Mail, Phone, MapPin, Settings, Bell, ChevronRight, Briefcase, FileText, X, Plus } from 'lucide-react';
import { LoadingSpinner } from '../components/Loading';
import { jobSkills } from '../utils/skills';
import { form } from 'framer-motion/client';

type FormData = {
    user_image: File | null;
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    skills: string[];
    education: string;
    day: string;
    month: string;
    year: string;
    city: string;
    state: string;
    hide_phone: boolean;
    my_portfolio: string;
    email_notifications: boolean;
    text_notifications: boolean;
};

export const Profile = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [tagError, setTagError] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'settings'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [loggedIn, setLoggedIn] = useState<boolean>(() => localStorage.getItem('isLoggedIn') === 'true');
    const [formData, setFormData] = useState<FormData>({
        user_image: null,
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        skills: [],
        education: '',
        day: '',
        month: '',
        year: '',
        city: '',
        state: '',
        hide_phone: false,
        my_portfolio: '',
        email_notifications: false,
        text_notifications: false,
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
    });

    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = userData?.id === loggedInUser?.id;

    const mockApplications = [
        {
            id: 1,
            company: 'TechStart Solutions',
            position: 'Junior Software Developer',
            status: 'Under Review',
            appliedDate: '2024-03-15',
        },
        {
            id: 2,
            company: 'GrowthBase',
            position: 'Customer Success Associate',
            status: 'Interview Scheduled',
            appliedDate: '2024-03-10',
        }
    ];

    // Getting user details
    const getUserDetails = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser.id;
            if (!userId) return;

            const response = await secureFetch(`http://localhost:3002/api/user/${userId}`, 'GET');

            setUserData(response);
            setFormData({
                user_image: response.user_image || null,
                name: `${response.first_name} ${response.last_name}`,
                email: response.email,
                phone: response.phone_number || '',
                location: `${response.city}, ${response.state}`,
                bio: response.about_me || '',
                skills: response.my_skills || [],
                education: response.education?.[0]?.degree || '',
                day: response.day,
                month: response.month,
                year: response.year,
                city: response.city,
                state: response.state,
                hide_phone: response.hide_phone || false,
                my_portfolio: response.my_portfolio || '',
                email_notifications: response.email_notifications || false,
                text_notifications: response.text_notifications || false,
            });

            setLoading(false); // ✅ Done loading
        } catch (err: any) {
            console.error('❌ Failed to fetch user data:', err.message);
            setLoading(false); // Still disable loading even if there's an error
        }
    };

    // Fetch user details when component mounts
    useEffect(() => {
        getUserDetails();
    }, []);

    // Handle Images Upload
    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('user_image', file);

        const response = await secureFetch(`http://localhost:3002/api/user/${userId}/`, 'PUT', formData);

        console.log('Image uploaded successfully:', response);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = async (e: React.FormEvent, overrideSkill?: string) => {
        e.preventDefault();

        const skillToAdd = (overrideSkill ?? newSkill).trim();
        if (!skillToAdd || formData.skills.includes(skillToAdd)) return;

        const updatedSkills = [...formData.skills, skillToAdd];

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const userId = JSON.parse(storedUser).id;
        if (!userId) return;

        try {
            const updates = { my_skills: updatedSkills };
            await secureFetch(`http://localhost:3002/api/user/${userId}`, 'PUT', updates);

            setFormData(prev => ({
                ...prev,
                skills: updatedSkills
            }));
            setNewSkill('');
            setSuggestions([]);
            setActiveSuggestionIndex(-1);
            setErrorMessage('');
            console.log('✅ Skill added and synced to backend');
        } catch (err: any) {
            console.error('❌ Failed to update skills:', err.message);
            setErrorMessage(err.message);
        }
    };

    const handleRemoveSkill = async (skillToRemove: string) => {
        const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);

        setFormData(prev => ({
            ...prev,
            skills: updatedSkills
        }));

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const userId = JSON.parse(storedUser).id;
        if (!userId) return;

        try {
            // Update the backend with the new skills array
            await secureFetch(`http://localhost:3002/api/user/${userId}`, 'PUT', { my_skills: updatedSkills });

            console.log('✅ Skill removed and synced to backend');
        } catch (err: any) {
            console.error('❌ Failed to update skills:', err.message);
        }
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = tagInput.trim();

        if (!trimmed) return;
        if (tags.includes(trimmed)) {
            setTagError('Tag already added');
            return;
        }

        setTags(prev => [...prev, trimmed]);
        setTagInput('');
        setTagError('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleSaveChanges = () => {
        // Here you would typically make an API call to update the user's profile
        console.log('Saving profile changes:', formData);
        setIsEditing(false);
    };

    const handleNotificationChange = (type: 'email' | 'push') => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handlePhoneToggle = async () => {
        setFormData(prev => ({
            ...prev,
            hide_phone: !prev.hide_phone
        }));

        try {
            const userData = await secureFetch(`http://localhost:3002/api/user/${userId}`, 'PUT', {
                hide_phone: !formData.hide_phone
            });
        }
        catch (err: any) {
            console.error('❌ Failed to update phone visibility:', err.message);
            alert('Failed to update phone visibility');
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Here you would typically make an API call to delete the user's account
            console.log('Deleting account...');
        }
    };

    useEffect(() => {
        if (newSkill.trim() === '') {
            setErrorMessage('');
        }
    }, [newSkill]);

    useEffect(() => {
        const handleStorageChange = () => {
            setLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        };

        // In case localStorage is changed from another tab
        window.addEventListener('storage', handleStorageChange);

        // Run once on mount
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (!loggedIn) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex items-center justify-center">
                <p className="text-gray-500">You must be logged in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative overflow-visible z-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        <User className="h-5 w-5 mr-3" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'applications'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        <Briefcase className="h-5 w-5 mr-3" />
                        Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'settings'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="flex-1">

                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-2xl shadow-lg">
                                    <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-500">
                                        <div className="absolute -bottom-16 left-6">
                                            <div className="bg-white p-4 rounded-2xl shadow-lg">
                                                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-3">
                                                    {formData.user_image ? (
                                                        <img
                                                            src={`http://localhost:3002${formData.user_image}`}
                                                            alt="Profile"
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-12 w-12 text-indigo-600" />
                                                    )}

                                                    {isOwner && isEditing && (
                                                        <>
                                                            <input
                                                                id="profile-image-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            user_image: file,
                                                                        }));
                                                                        setSelectedFile(file); // optional if you're uploading on submit
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />

                                                            <label
                                                                htmlFor="profile-image-upload"
                                                                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                                            >
                                                                Change Image
                                                            </label>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-20 px-6 pb-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                                                <p className="text-gray-600">{formData.education}</p>
                                            </div>
                                            {isOwner ? (
                                                <button
                                                    onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
                                                    className={`px-4 py-2 rounded-xl transition-all duration-200 ${isEditing
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        : 'text-indigo-600 hover:bg-indigo-50'
                                                        }`}
                                                >
                                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                                </button>
                                            ) :
                                                <button
                                                    onClick={() => setActiveTab('settings')}
                                                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                                                >
                                                    Message
                                                </button>
                                            }
                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            {/* Email Section */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                ) : (
                                                    <div className="flex items-center text-gray-900">
                                                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                                        <p>{formData.email}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Phone Section */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <div className="flex items-center text-gray-900">
                                                    {isEditing ? (
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center text-gray-900">
                                                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                                            {
                                                                formData.hide_phone
                                                                    ? <p>(***) ***-****</p>
                                                                    : <p>{formData.phone}</p>

                                                            }

                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Location Section */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <div className="flex items-center text-gray-900">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center text-gray-900">
                                                            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                            <p>{formData.location}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bio Section */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                                {isEditing ? (
                                                    <textarea
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        rows={4}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{formData.bio}</p>
                                                )}
                                            </div>

                                            {/* Skills Section */}
                                            {/* Only show in edit mode if there are skills to display */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                                        >
                                                            {skill}
                                                            {isEditing && (
                                                                <button
                                                                    onClick={() => handleRemoveSkill(skill)}
                                                                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </span>
                                                    ))}
                                                    {isEditing && (
                                                        <>
                                                            <div className="w-full relative overflow-visible z-10">

                                                                {/* Add Skill Section */}
                                                                <form onSubmit={handleAddSkill} className="flex">
                                                                    <div className="relative w-full">

                                                                        {/* Skills Input */}
                                                                        <input
                                                                            type="text"
                                                                            value={newSkill}
                                                                            onChange={(e) => {
                                                                                const input = e.target.value;
                                                                                setNewSkill(input);

                                                                                if (input.length > 0) {
                                                                                    const matches = jobSkills
                                                                                        .filter(skill =>
                                                                                            skill.toLowerCase().startsWith(input.toLowerCase())
                                                                                        )
                                                                                        .slice(0, 5);
                                                                                    setSuggestions(matches);
                                                                                } else {
                                                                                    setSuggestions([]);
                                                                                }
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'ArrowDown') {
                                                                                    e.preventDefault();
                                                                                    setActiveSuggestionIndex(prev => {
                                                                                        const next = prev < suggestions.length - 1 ? prev + 1 : 0;
                                                                                        setNewSkill(suggestions[next] || '');
                                                                                        return next;
                                                                                    });
                                                                                } else if (e.key === 'ArrowUp') {
                                                                                    e.preventDefault();
                                                                                    setActiveSuggestionIndex(prev => {
                                                                                        const next = prev > 0 ? prev - 1 : suggestions.length - 1;
                                                                                        setNewSkill(suggestions[next] || '');
                                                                                        return next;
                                                                                    });
                                                                                } else if (e.key === 'Enter') {
                                                                                    e.preventDefault();

                                                                                    // Use selected suggestion if available, else fall back to user input
                                                                                    const skillToAdd = activeSuggestionIndex >= 0
                                                                                        ? suggestions[activeSuggestionIndex]
                                                                                        : newSkill.trim();

                                                                                    if (skillToAdd) {
                                                                                        // Set input manually and let handleAddSkill use it
                                                                                        setNewSkill(skillToAdd);

                                                                                        // Submit the form to trigger handleAddSkill
                                                                                        const form = e.currentTarget.closest('form');
                                                                                        if (form) {
                                                                                            form.requestSubmit();
                                                                                        }
                                                                                    }

                                                                                    setSuggestions([]);
                                                                                    setActiveSuggestionIndex(-1);
                                                                                } else if (e.key === 'Escape') {
                                                                                    setSuggestions([]);
                                                                                    setActiveSuggestionIndex(-1);
                                                                                }
                                                                            }}
                                                                            onFocus={() => {
                                                                                if (newSkill.trim().length > 0) {
                                                                                    const matches = jobSkills
                                                                                        .filter(skill =>
                                                                                            skill.toLowerCase().startsWith(newSkill.toLowerCase())
                                                                                        )
                                                                                        .slice(0, 5);
                                                                                    setSuggestions(matches);
                                                                                }
                                                                            }}
                                                                            onBlur={() => {
                                                                                setTimeout(() => {
                                                                                    setSuggestions([]);
                                                                                }, 100);
                                                                            }}
                                                                            placeholder="Add a skill..."
                                                                            className="px-3 py-1 border border-gray-300 rounded-l-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                                                                        />

                                                                        {/* Suggestions Dropdown */}
                                                                        {suggestions.length > 0 && (
                                                                            <ul className="absolute left-0 top-full z-[999] bg-white border border-gray-300 rounded-lg mt-1 w-full shadow-lg max-h-60 overflow-y-auto">
                                                                                {suggestions.map((suggestion, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        onMouseDown={() => {
                                                                                            setFormData(prev => ({
                                                                                                ...prev,
                                                                                                skills: [...prev.skills, suggestion]
                                                                                            }));
                                                                                            setNewSkill('');
                                                                                            setSuggestions([]);
                                                                                            setActiveSuggestionIndex(-1);
                                                                                        }}
                                                                                        className={`px-4 py-2 cursor-pointer text-sm ${index === activeSuggestionIndex
                                                                                            ? 'bg-indigo-100 text-indigo-800'
                                                                                            : 'hover:bg-indigo-50'
                                                                                            }`}
                                                                                    >
                                                                                        {suggestion}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        type="submit"
                                                                        className="px-3 py-1 bg-indigo-600 text-white rounded-r-full text-sm hover:bg-indigo-700"
                                                                    >
                                                                        <Plus className="h-4 w-4" />
                                                                    </button>

                                                                </form>

                                                                {errorMessage && (
                                                                    <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
                                                                )}
                                                            </div>

                                                            {/* Tags Section */}
                                                            {/* Only show in edit mode */}
                                                            <div className="md:col-span-2 mt-4">
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                                                <div className="flex flex-wrap gap-2 mt-4">
                                                                    {tags.map((tag, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                                                                        >
                                                                            {tag}
                                                                            <button
                                                                                onClick={() => handleRemoveTag(tag)}
                                                                                className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        </span>
                                                                    ))}
                                                                </div>

                                                                {/* Tag Input */}
                                                                <form onSubmit={handleAddTag}>
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={tagInput}
                                                                            onChange={(e) => {
                                                                                setTagInput(e.target.value);
                                                                                if (e.target.value.trim() === '') setTagError('');
                                                                            }}
                                                                            placeholder="Add a tag..."
                                                                            className="flex-1 px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                        />
                                                                        <button
                                                                            type="submit"
                                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                                        >
                                                                            Add
                                                                        </button>
                                                                    </div>
                                                                    {tagError && <p className="text-red-500 mt-1 text-sm">{tagError}</p>}
                                                                </form>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'applications' && (
                                <div className="bg-white rounded-lg shadow-md">
                                    <div className="p-6 border-b">
                                        <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
                                    </div>
                                    <div className="divide-y">
                                        {mockApplications.map((application) => (
                                            <div key={application.id} className="p-6 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{application.position}</h3>
                                                        <p className="text-gray-600">{application.company}</p>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-sm">
                                                    <div className="flex items-center">
                                                        <FileText className="h-4 w-4 text-gray-400 mr-1" />
                                                        <span className="text-gray-500">Applied {application.appliedDate}</span>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${application.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${application.status === 'Interview Scheduled' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                                                        {application.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Bell className="h-5 w-5 text-gray-400 mr-2" />
                                                        <span>Email Notifications</span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.email}
                                                        onChange={() => handleNotificationChange('email')}
                                                        className="w-6 h-6 rounded-md border border-gray-300"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Bell className="h-5 w-5 text-gray-400 mr-2" />
                                                        <span>Push Notifications</span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.push}
                                                        onChange={() => handleNotificationChange('push')}
                                                        className="w-6 h-6 rounded-md border border-gray-300"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6" >
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span>Hide Phone</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.hide_phone}
                                                    onChange={() => handlePhoneToggle()}
                                                    className="w-6 h-6 rounded-md border border-gray-300"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6" >
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account</h3>
                                            <div className="flex items-center justify-between">
                                                <button className='w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'>
                                                    <p>Become an Employer</p>
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
                                            <p className="text-gray-600">Permanently delete your account and all associated data.</p>
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            )}
                        </div>
                    )}
                </div>
            </div >
        </div>
    );
}
