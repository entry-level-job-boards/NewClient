import React from 'react';
import { Shield, Users, Target, Heart } from 'lucide-react';

export const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We're transforming the entry-level job market by creating a platform that truly puts
                    first-time job seekers first. No experience required, no deceptive listings—just
                    honest opportunities to start your career.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center p-6">
                    <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Trust & Transparency</h3>
                    <p className="text-gray-600">Every job listing is verified to ensure it's truly entry-level friendly.</p>
                </div>
                <div className="text-center p-6">
                    <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Community First</h3>
                    <p className="text-gray-600">We support both job seekers and employers in creating meaningful connections.</p>
                </div>
                <div className="text-center p-6">
                    <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Focused Purpose</h3>
                    <p className="text-gray-600">Dedicated exclusively to entry-level positions and first-time job seekers.</p>
                </div>
                <div className="text-center p-6">
                    <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Support & Guidance</h3>
                    <p className="text-gray-600">Comprehensive resources and support for your job search journey.</p>
                </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-8 mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
                        <div className="text-gray-600">Successful Placements</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-600 mb-2">1,000+</div>
                        <div className="text-gray-600">Partner Companies</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
                        <div className="text-gray-600">Satisfaction Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
};