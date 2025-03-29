// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

// import { PasswordRequirements } from '../components/Requirements';

// export const SignUp = () => {

//     const [first_name, setFirstName] = useState('');
//     const [last_name, setLastName] = useState('');
//     const [phone_number, setPhoneNumber] = useState('');
//     const [address, setAddress] = useState('');
//     const [city, setCity] = useState('');
//     const [state, setState] = useState('');
//     const [zip_code, setZipCode] = useState('');
//     const [month, setMonth] = useState('');
//     const [day, setDay] = useState('');
//     const [year, setYear] = useState('');

//     const passwordInputRef = useRef<HTMLInputElement | null>(null);
//     const tooltipRef = useRef<HTMLDivElement | null>(null);

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const [email, setEmail] = useState('');
//     const [emailError, setEmailError] = useState('');

//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [passwordsMatch, setPasswordsMatch] = useState(true);

//     const [showRequirements, setShowRequirements] = useState(false);

//     const shouldHighlightMatch =
//         password.length > 0 &&
//         confirmPassword.length > 0 &&
//         password === confirmPassword;

//     useEffect(() => {
//         if (password !== confirmPassword && confirmPassword.length > 0 && password.length === confirmPassword.length) {
//             setPasswordsMatch(false);
//         } else {
//             setPasswordsMatch(true);
//         }
//     }, [password, confirmPassword]);

//     const handleSetShowRequirements = () => {
//         setShowRequirements(!showRequirements);
//     };

//     const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setEmail(value);

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(value)) {
//             setEmailError('Please enter a valid email address.');
//         } else {
//             setEmailError('');
//         }
//     };

//     useEffect(() => {
//         const handleClickOutside = (e: MouseEvent) => {
//             if (
//                 passwordInputRef.current &&
//                 !passwordInputRef.current.contains(e.target as Node) &&
//                 tooltipRef.current &&
//                 !tooltipRef.current.contains(e.target as Node)
//             ) {
//                 setShowRequirements(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
//             <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
//                 <div>
//                     <h2 className="text-center text-3xl font-bold text-gray-900">Create your account</h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//                             Sign in
//                         </Link>
//                     </p>
//                 </div>
//                 <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()} autoComplete='off'>
//                     {/* // =========================== NAME =========================== // */}
//                     <div className="space-y-4">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Full Name
//                             </label>
//                             <div className="mt-1 relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <User className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="name"
//                                     name="name"
//                                     type="text"
//                                     required
//                                     className="appearance-none block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     placeholder="John Doe"
//                                 />
//                             </div>
//                         </div>

//                         {/*  =========================== EMAIL =========================== */}
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Email address
//                             </label>
//                             <div className="mt-1 relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Mail className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="email"
//                                     name="email"
//                                     type="email"
//                                     autoComplete="new-email"
//                                     onChange={handleEmailChange}
//                                     required
//                                     className="appearance-none block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     placeholder="you@example.com"
//                                 />
//                                 {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
//                             </div>
//                         </div>

//                         {/* // =========================== PASSWORD =========================== // */}
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Password
//                             </label>
//                             <div className="mt-1 relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type={showPassword ? "text" : "password"}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     onFocus={handleSetShowRequirements}
//                                     ref={passwordInputRef}
//                                     required
//                                     className={`appearance-none block w-full pl-10 pr-10 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:border-indigo-500 ${shouldHighlightMatch
//                                         ? 'border-green-500 bg-green-50 focus:ring-green-500'
//                                         : 'border-gray-300 focus:ring-indigo-500'
//                                         }`}
//                                     placeholder="••••••••"
//                                 />
//                                 {showRequirements && (
//                                     <PasswordRequirements
//                                         password={password}
//                                         show={showRequirements}
//                                         tooltipRef={tooltipRef}
//                                     />
//                                 )}
//                                 <button
//                                     type="button"
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                 >
//                                     {showPassword ? (
//                                         <EyeOff className="h-5 w-5 text-gray-400" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-gray-400" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>


//                         {/* // =========================== CONFIRM PASSWORD =========================== // */}
//                         <div>
//                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Confirm Password
//                             </label>
//                             <div className="mt-1 relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     onChange={(e) => setConfirmPassword(e.target.value)}
//                                     required
//                                     className={`appearance-none block w-full pl-10 pr-10 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:border-indigo-500 ${shouldHighlightMatch
//                                         ? 'border-green-500 bg-green-50 focus:ring-green-500'
//                                         : 'border-gray-300 focus:ring-indigo-500'
//                                         }`}
//                                     placeholder="••••••••"
//                                 />
//                                 {!passwordsMatch && (
//                                     <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
//                                 )}
//                                 <button
//                                     type="button"
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 >
//                                     {showConfirmPassword ? (
//                                         <EyeOff className="h-5 w-5 text-gray-400" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-gray-400" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <button
//                             type="submit"
//                             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         >
//                             Create Account
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// Fully integrated and fixed version of your multi-step signup form with responsive tooltip positioning
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordRequirements } from '../components/Requirements';

export const SignUp = () => {
    const [step, setStep] = useState(0);
    const totalSteps = 4;

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
        setPasswordsMatch(
            formData.password === confirmPassword || confirmPassword.length === 0
        );
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = { ...formData }; // confirmPassword is not included
        console.log('Submitting:', submissionData);
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

                    <form onSubmit={handleSubmit} autoComplete="off" className="mt-8">
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
                                    type="submit"
                                    className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Create Account
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Desktop tooltip (unchanged) */}
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

                {/* Mobile tooltip (fixed at bottom but same look) */}
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
