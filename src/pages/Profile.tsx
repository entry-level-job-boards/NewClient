import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Calendar, DollarSign, ChevronDown, ChevronUp, BadgeCheck, Settings, Bell, ChevronRight, Briefcase, FileText, X, Plus } from 'lucide-react';

export const Profile = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'settings'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [formData, setFormData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Recent graduate passionate about technology and innovation.',
        skills: ['JavaScript', 'React', 'Node.js'],
        education: 'B.S. Computer Science - Stanford University',
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
    });

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim()) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
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

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Here you would typically make an API call to delete the user's account
            console.log('Deleting account...');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
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
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                <button
                                    onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
                                    className="text-indigo-600 hover:text-indigo-700"
                                >
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 rounded-full p-3">
                                        <User className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold">{formData.name}</h3>
                                        <p className="text-gray-600">{formData.education}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="flex items-center text-gray-900">
                                            <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            ) : (
                                                formData.email
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <div className="flex items-center text-gray-900">
                                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                            {isEditing && (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <div className="flex items-center text-gray-900">
                                            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            ) : (
                                                formData.location
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
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

                                <div>
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
                                            <form onSubmit={handleAddSkill} className="flex">
                                                <input
                                                    type="text"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    placeholder="Add a skill..."
                                                    className="px-3 py-1 border border-gray-300 rounded-l-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 bg-indigo-600 text-white rounded-r-full text-sm hover:bg-indigo-700"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </form>
                                        )}
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
            </div>
        </div>
    );
}
