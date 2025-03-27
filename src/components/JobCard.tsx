import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Building,
    Calendar,
    DollarSign,
    ChevronDown,
    ChevronUp,
    BadgeCheck,
} from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
    job: Job;
    isExpanded: boolean;
    onToggle: (jobId: string) => void;
}

export const JobCard = ({ job, isExpanded, onToggle }: JobCardProps) => {

    return (
        <motion.div
            layout
            className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div
                className="p-6 cursor-pointer"
                onClick={() => onToggle(job.id)}
            >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex flex-wrap items-center mt-2 text-gray-600 gap-x-4 gap-y-2">
                            <div className="flex items-center">
                                <Building className="h-4 w-4 mr-2" />
                                <span>{job.company}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{job.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-start sm:justify-end">
                        <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                            <BadgeCheck className="h-4 w-4 mr-1" />
                            No Experience Required
                        </span>
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 ml-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-5 w-5 ml-4 text-gray-500" />
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="text-gray-600 mb-4">{job.description}</p>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Desired Skills:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>Apply by {job.deadline}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Benefits:</h4>
                                <ul className="list-disc list-inside text-gray-600">
                                    {job.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Required Degree:</h4>
                                <p className="text-gray-600">{job.degree}</p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/apply/${job.id}`;
                                }}
                                className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Apply Now
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};