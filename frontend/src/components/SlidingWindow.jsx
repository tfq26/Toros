import React, { useState } from "react";

const SlidingWindow = ({ isOpen, onClose, sections }) => {
    const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

    return (
        <div className={`fixed right-0 top-0 h-full transition-transform duration-300 ease-in-out z-50`}>
            <div
                className={`absolute top-0 right-0 h-full bg-white dark:bg-gray-700 shadow-lg transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform w-96 p-4 rounded-l-lg`}
            >
                {/* Close Button (Only visible when window is open) */}
                {isOpen && (
                    <button
                        onClick={onClose}
                        className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-l-md hover:bg-blue-600 transition"
                    >
                        ❌
                    </button>
                )}

                {/* Tab Buttons */}
                <div className="flex border-b dark:border-gray-500">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={`flex-1 p-2 text-center text-lg font-semibold ${
                                activeSection === section.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-600 dark:text-gray-300"
                            }`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Dynamic Content */}
                <div className="p-4 overflow-y-auto h-[90%]">
                    {sections.map(
                        (section) =>
                            activeSection === section.id && (
                                <div key={section.id} className="fade-in">
                                    {section.content}
                                </div>
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlidingWindow;
