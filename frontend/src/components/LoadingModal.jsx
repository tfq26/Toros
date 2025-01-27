const LoadingModal = ({ message = "Loading...", description = "Please wait while we fetch the latest data." }) => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center items-center max-w-sm w-full animate__animated animate__fadeIn">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">{message}</h2>
                <div className="animate-spin border-4 border-t-4 border-red-500 border-solid w-16 h-16 rounded-full mb-4"></div>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
};

export default LoadingModal;
