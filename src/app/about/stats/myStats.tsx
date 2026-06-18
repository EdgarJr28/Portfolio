'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = 100;

interface SkillRingProps {
    label: string;
    value: number;
    color: string;
    delay?: number;
}

const SkillRing = ({ label, value, color, delay = 0 }: SkillRingProps) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: '-40px' });
    const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;

    return (
        <div ref={ref} className="flex flex-col items-center gap-1">
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
                <circle
                    cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                    fill="none" stroke="#cbd5e1" strokeWidth={8}
                />
                <motion.circle
                    cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                    fill="none" stroke={color} strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    initial={{ strokeDashoffset: CIRCUMFERENCE }}
                    animate={{ strokeDashoffset: inView ? offset : CIRCUMFERENCE }}
                    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
                />
                <text
                    x={SIZE / 2} y={SIZE / 2 + 5}
                    textAnchor="middle"
                    className="rotate-90"
                    style={{ transform: `rotate(90deg) translate(0px, -${SIZE}px)`, fontSize: 13, fontWeight: 700, fill: color }}
                >
                    {inView ? `${value}%` : ''}
                </text>
            </svg>
            <span className="text-xs font-semibold text-center">{label}</span>
        </div>
    );
};

const frontendSkills = [
    { label: 'JavaScript', value: 90, color: '#037db8' },
    { label: 'TypeScript', value: 80, color: '#037db8' },
    { label: 'HTML', value: 80, color: '#037db8' },
    { label: 'CSS', value: 70, color: '#037db8' },
];

const backendSkills = [
    { label: 'REST', value: 100, color: '#32d583' },
    { label: 'SQL', value: 80, color: '#32d583' },
    { label: 'NoSQL', value: 70, color: '#32d583' },
    { label: 'JWT', value: 90, color: '#32d583' },
];

const StatsCard = () => {
    return (
        <div className="flex flex-col rounded-lg md:flex-row gap-4 max-w-[80%] py-12 md:max-w-[40%] mx-auto text-black dark:text-white">
            <div className="bg-transparent dark:text-white p-4 w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-6 text-center">Frontend Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    {frontendSkills.map((s, i) => (
                        <SkillRing key={s.label} label={s.label} value={s.value} color={s.color} delay={i * 0.15} />
                    ))}
                </div>
            </div>
            <div className="bg-transparent dark:text-white p-4 w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-6 text-center">Backend Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    {backendSkills.map((s, i) => (
                        <SkillRing key={s.label} label={s.label} value={s.value} color={s.color} delay={i * 0.15} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
