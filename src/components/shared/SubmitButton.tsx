// components/ui/GradientButton.tsx
"use client";

import { ButtonHTMLAttributes, FC } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;           // Default button text
    isLoading?: boolean;     // Loading state
    loadingText?: string;    // Optional text when loading
}

const SubmitButton: FC<SubmitButtonProps> = ({
    title,
    isLoading = false,
    loadingText,
    disabled,
    ...props
}) => {
    return (
        <>

            <button
                disabled={isLoading || disabled}
                className="relative w-full h-11 rounded-lg overflow-hidden flex items-center justify-center font-semibold text-white transition-all duration-200 active:scale-[0.98] hover:text-white/90 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                    backgroundImage: "linear-gradient(90deg, #8f43ec, #8545d3, #4e1e8a)",
                    backgroundSize: "200% 200%",
                    animation: "gradientShift 4s ease infinite", // background gradient animation
                }}
                {...props}
            >
                {/* Button text */}
                <span className="relative z-10">{isLoading ? loadingText || title : title}</span>

                {/* SVG border animation */}
                <svg
                    className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                >
                    <rect
                        x="1"
                        y="1"
                        width="calc(100% - 2)"
                        height="calc(100% - 2)"
                        rx="0.5rem"
                        ry="0.5rem"
                        fill="none"
                        stroke="url(#borderGradient)"
                        strokeWidth="2"
                        strokeDasharray="400"
                        strokeDashoffset="400"
                        style={{
                            animation: "dash 4s linear infinite",
                        }}
                    />
                    <defs>
                        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#b487eb" />
                            <stop offset="50%" stopColor="#8545d3" />
                            <stop offset="100%" stopColor="#4e1e8a" />
                        </linearGradient>
                    </defs>
                </svg>

                <style jsx>{`
                                @keyframes gradientShift {
                                0%, 100% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                                }

                                @keyframes dash {
                                0% {
                                    stroke-dashoffset: 400;
                                }
                                100% {
                                    stroke-dashoffset: 0;
                                }
                                }
                            `}
                </style>
            </button>

        </>
    );
};

export default SubmitButton;
