import { useState } from 'react';
import { Bell, Mail, Briefcase, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: number;
    type: 'message' | 'job' | 'info';
    content: string;
    date: string;
    isRead: boolean;
}

const sampleNotifications: Notification[] = [
    {
        id: 1,
        type: 'message',
        content: 'You have a new message from TechStart Solutions.',
        date: 'Mar 27, 2025',
        isRead: false,
    },
    {
        id: 2,
        type: 'job',
        content: 'Your application was viewed by GrowthBase.',
        date: 'Mar 26, 2025',
        isRead: true,
    },
    {
        id: 3,
        type: 'info',
        content: 'New job matches based on your profile are available.',
        date: 'Mar 25, 2025',
        isRead: false,
    },
];

const iconMap = {
    message: <Mail className="h-5 w-5 text-indigo-600" />,
    job: <Briefcase className="h-5 w-5 text-green-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
};

export const Notifications = () => {
    const [notifications, setNotifications] = useState(sampleNotifications);

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const clearNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between mb-6"
            >
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                {notifications.length > 0 && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            Mark all as read
                        </button>
                        <button
                            onClick={clearAll}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </motion.div>

            <AnimatePresence>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            className={`relative border rounded-lg p-4 shadow-sm flex items-start gap-4 transition-all mb-4 ${notification.isRead
                                    ? 'bg-gray-50 border-gray-200'
                                    : 'bg-indigo-50 border-indigo-200'
                                }`}
                        >
                            <div className="mt-1">{iconMap[notification.type]}</div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">{notification.content}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-auto">
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="text-xs text-indigo-600 hover:underline"
                                    >
                                        Mark as read
                                    </button>
                                )}
                                <button
                                    onClick={() => clearNotification(notification.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-500 text-center text-sm mt-12"
                    >
                        <Bell className="mx-auto mb-2 h-8 w-8" />
                        No notifications to show.
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};