"use client"
export default function CustomLoader() {
    return (
        <div className="flex justify-center items-center">
            <svg
                height="48"
                width="64"
                className="animate-pulse"
            >
                <polyline
                    points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                    className="fill-none stroke-[var(--accent)] stroke-[3px] stroke-linecap-round stroke-linejoin-round"
                />
                <polyline
                    points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                    className="polyline-front fill-none stroke-[var(--secondary)] stroke-[3px] stroke-linecap-round stroke-linejoin-round"
                />
            </svg>
        </div>
    );
}