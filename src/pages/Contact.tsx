import { Mail, MessageSquare, Phone } from 'lucide-react';

export const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Get in Touch</h1>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                        <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-gray-600">support@entrypoint.com</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                            <Phone className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Phone</h3>
                        <p className="text-gray-600">1-800-ENTRY-PT</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Live Chat</h3>
                        <p className="text-gray-600">Available 24/7</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};