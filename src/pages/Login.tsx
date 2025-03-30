import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { secureFetch } from '../utils/secureFetch';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userData, setUserData] = useState<any>(null); // Store user data after login

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await secureFetch('http://localhost:3002/api/login', 'POST', {
                email,
                password,
            });

            console.log('Login successful:', data);
            setUserData(data.user); // Store user data in state
            // ✅ Check if user data is returned
            if (!data || !data.user) {
                throw new Error('Login failed: No user data returned');
            }

            // ✅ Save login state
            localStorage.setItem('isLoggedIn', 'true'); // OR: sessionStorage.setItem('isLoggedIn', 'true');

            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/jobs');
        } catch (err: any) {
            localStorage.removeItem('isLoggedIn');
            alert(`Login failed: ${err.message}`);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">Welcome back</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-10 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};