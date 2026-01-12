export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }) {
    return (
        <div
            className={`${height} ${width} bg-gray-100 rounded animate-pulse ${className}`}
            role="status"
            aria-label="Loading content"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}