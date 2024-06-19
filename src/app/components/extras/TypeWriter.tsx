import { useEffect, useState } from 'react';
/* 100 - 1500 */
const Typewriter = ({ phrases, typingSpeed, pauseTime, className }: any) => {
    const [displayedText, setDisplayedText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                // Handle deletion
                if (charIndex > 0) {
                    setDisplayedText(currentPhrase.substring(0, charIndex - 1));
                    setCharIndex((prev) => prev - 1);
                } else {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            } else {
                // Handle typing
                if (charIndex < currentPhrase.length) {
                    setDisplayedText(currentPhrase.substring(0, charIndex + 1));
                    setCharIndex((prev) => prev + 1);
                } else {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            }
        };

        const typingTimeout = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(typingTimeout);
    }, [charIndex, isDeleting, phraseIndex, phrases, typingSpeed, pauseTime]);

    return (
        <div className={`typewriter ${className}`}>
            <span>{displayedText}</span>
            <span className="blinking-cursor">|</span>
        </div>
    );
};

export default Typewriter;
