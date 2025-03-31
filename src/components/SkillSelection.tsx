import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { softSkills } from '../utils/softSkills';

export const SkillSelection = () => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [skills, setSkills] = useState<(string | null)[]>([]); // Track per slot

    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

    useEffect(() => {
        const shuffled = [...softSkills].sort(() => Math.random() - 0.5).slice(0, 14);
        setSkills(shuffled);
    }, []);

    const handleSkillChange = async (index: number, skill: string) => {
        if (!userId) return;

        // Update local UI state
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );

        setSkills(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });

        // Replace with new skill after short delay
        setTimeout(() => {
            setSkills(prev => {
                const updated = [...prev];
                const existing = new Set([...updated.filter(Boolean), ...selectedSkills]);
                const remaining = softSkills.filter(s => !existing.has(s));
                const newSkill = remaining[Math.floor(Math.random() * remaining.length)];
                updated[index] = newSkill || '💥';
                return updated;
            });
        }, 250);

        try {
            // 👇 GET current skills (optional if you’re tracking it in state)
            const response = await fetch(`${import.meta.env.VITE_LINK}api/user/${userId}`);
            const userData = await response.json();
            const currentSkills = userData.my_skills || [];

            // 👇 Prevent duplicates
            if (!selectedSkills.includes(skill)) {
                const newSkills = [...selectedSkills, skill];

                await fetch(`${import.meta.env.VITE_LINK}api/user/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ my_skills: newSkills }),
                });

                setSelectedSkills(newSkills);
            }
        } catch (err) {
            console.error('❌ Failed to update skills:', err);
        }
    };

    // Rendering function for each row of skills
    const renderRow = (row: (string | null)[], startIndex: number, rowClass: string) => (
        <>
            <div className={rowClass}>
                {row.map((skill, i) => (
                    <AnimatePresence key={`${startIndex + i}-${skill}`} mode="popLayout">
                        {skill && (
                            <motion.div
                                key={skill}
                                onClick={() => handleSkillChange(startIndex + i, skill)}
                                className="px-2 py-3 h-[45px] w-[150px] rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium cursor-pointer hover:bg-indigo-200 transition-all text-center flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{
                                    opacity: 0,
                                    scale: [1, 1.3, 0],
                                    rotate: [0, 10, -10, 0],
                                    transition: {
                                        duration: 0.25,
                                        ease: 'easeInOut',
                                    },
                                }}
                                transition={{
                                    duration: 0.35,
                                    delay: i * 0.08, // 🔥 Original staggered fade-in effect
                                    ease: [0.25, 0.1, 0.25, 1],
                                    type: 'tween',
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    transition: { type: 'spring', stiffness: 300, damping: 15 },
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { type: 'spring', stiffness: 200, damping: 10 },
                                }}
                            >
                                {skill}
                            </motion.div>
                        )}
                    </AnimatePresence>
                ))}
            </div>
        </>
    );

    const row1 = skills.slice(0, 5);
    const row2 = skills.slice(5, 9);
    const row3 = skills.slice(9, 14);

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-md shadow-md">
            <div className="absolute top-[30%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center">
                <h3 className="text-center mb-4">Select your skills:</h3>
                <p className="text-xs text-gray-500 mb-4">Please choose 5. You can add up to 10 from here</p>
                {renderRow(row1, 0, 'grid grid-cols-5 gap-3 justify-center mb-6')}
                {renderRow(row2, 5, 'grid grid-cols-4 gap-2 justify-center')}
                {renderRow(row3, 9, 'grid grid-cols-5 gap-3 justify-center mt-6')}
            </div>
        </div>
    );
};