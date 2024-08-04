const SkeletonLoader = () => (
    <div className="rounded-lg w-80 p-6 animate-pulse">
        <div className="text-center">
            <h1 className="text-green-600 text-center p-2">Loading...</h1>
        </div>
        <div className="flex w-full items-center justify-center rounded-lg">
            <div className="w-full">
                <div className="w-full h-64 bg-gray-300 rounded-b-lg shadow-lg dark:shadow-dark-200"></div>
                <div className="w-full text-center text-gray-300 pt-1">
                    <div className="w-full overflow-hidden relative">
                        <div className="overflow-hidden whitespace-nowrap relative">
                            <h2 className="text-sm text-black dark:text-white font-semibold inline-block">Loading...</h2>
                        </div>
                    </div>
                    <p className="text-xs text-baseGray dark:text-gray-400">Loading...</p>
                </div>
            </div>
        </div>
    </div>
);

export default SkeletonLoader;
