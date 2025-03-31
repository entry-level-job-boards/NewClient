import { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordRequirements } from '../components/Requirements';

import { encryptData } from '../utils/encrypt.ts';

export const SignUp = () => {
    const [step, setStep] = useState(0);
    const totalSteps = 5;

    const backendURL = import.meta.env.VITE_LINK; // Access Vite environment variables
    if (!backendURL) {
        console.error('Vite environment variables are not available.');
    }

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        password: '',
        month: '',
        day: '',
        year: '',
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);

    const passwordInputRef = useRef<HTMLInputElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phone_number') {
            const cleaned = value.replace(/\D/g, '');
            let formatted = cleaned;
            if (cleaned.length > 3 && cleaned.length <= 6) {
                formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
            } else if (cleaned.length > 6) {
                formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
            }
            setFormData((prev) => ({ ...prev, [name]: formatted }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(!emailRegex.test(e.target.value) ? 'Please enter a valid email address.' : '');
    };

    useEffect(() => {
        setPasswordsMatch(formData.password === confirmPassword || confirmPassword.length === 0);
    }, [formData.password, confirmPassword]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                passwordInputRef.current &&
                !passwordInputRef.current.contains(e.target as Node) &&
                tooltipRef.current &&
                !tooltipRef.current.contains(e.target as Node)
            ) {
                setShowRequirements(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const next = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
    const back = () => setStep((prev) => Math.max(prev - 1, 0));

    const handleSubmit = async () => {
        if (
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.password ||
            !formData.month ||
            !formData.day ||
            !formData.year ||
            formData.password !== confirmPassword
        ) {
            alert("Please fill out all fields, including date of birth, and make sure passwords match.");
            return;
        }

        const submissionData = {
            ...formData,
        };

        const encrypted = encryptData(submissionData);

        try {
            const response = await fetch(`${backendURL}api/create-applicant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payload: encrypted }), // send encrypted data as "payload"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create account');
            }

            localStorage.setItem('isLoggedIn', 'true');// Check if user is logged in

            const result = await response.json();
            console.log('Account created!', result);
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
            }
            alert('Account created successfully!');
            navigate('/skills') // Redirect to Skill Selection page after successful signup
            window.location.reload();
        } catch (error: any) {
            console.log(formData); // Log formData for debugging
            console.error('Signup error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="relative flex flex-col md:flex-row items-start gap-6 overflow-visible">
                <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-lg overflow-visible">
                    <h2 className="text-center text-3xl font-bold text-gray-900">Create your account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>

                    <form autoComplete="off" className="mt-8">
                        <div className="overflow-hidden w-full relative">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${step * 380}px)`, width: `${totalSteps * 380}px` }}
                            >
                                <div className="w-[380px] flex-shrink-0 px-1 space-y-4">
                                    <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="w-full p-3 border border-gray-300 rounded-lg" />
                                    <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="w-full p-3 border border-gray-300 rounded-lg" />
                                </div>

                                <div className="w-[380px] flex-shrink-0 px-1 space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border border-gray-300 rounded-lg" />
                                </div>

                                <div className="w-[380px] flex-shrink-0 px-1 space-y-4">
                                    <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className="w-full p-3 border border-gray-300 rounded-lg" />
                                    <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-3 border border-gray-300 rounded-lg" />
                                    <div className="flex space-x-2">
                                        <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                                        <input name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder="Zip" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                                    </div>
                                </div>

                                <div className="w-[380px] flex-shrink-0 px-1 space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            name="month"
                                            value={formData.month}
                                            onChange={handleChange}
                                            placeholder="MM"
                                            maxLength={2}
                                            className="w-1/3 p-3 border border-gray-300 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            name="day"
                                            value={formData.day}
                                            onChange={handleChange}
                                            placeholder="DD"
                                            maxLength={2}
                                            className="w-1/3 p-3 border border-gray-300 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            placeholder="YYYY"
                                            maxLength={4}
                                            className="w-1/3 p-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="w-[380px] flex-shrink-0 px-1 py-2 space-y-4 relative overflow-visible">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setShowRequirements(true);
                                            }}
                                            onFocus={() => setShowRequirements(true)}
                                            ref={passwordInputRef}
                                            className="pl-10 pr-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10 pr-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="••••••••"
                                        />
                                        {!passwordsMatch && (
                                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={back}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200"
                                >
                                    Back
                                </button>
                            )}
                            {step < totalSteps - 1 ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Create Account
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Desktop tooltip */}
                {showRequirements && (
                    <div
                        ref={tooltipRef}
                        className="hidden md:block absolute left-full top-12 ml-4 z-50"
                    >
                        <PasswordRequirements
                            password={formData.password}
                            show={showRequirements}
                            tooltipRef={tooltipRef}
                        />
                    </div>
                )}

                {/* Mobile tooltip */}
                {showRequirements && (
                    <div className="block md:hidden fixed bottom-[75px] left-[-15px] w-full px-4 pb-4 z-50">
                        <div className="bg-white rounded-t-lg p-4 max-w-md mx-auto">
                            <PasswordRequirements
                                password={formData.password}
                                show={showRequirements}
                                tooltipRef={tooltipRef}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};