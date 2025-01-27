import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [images, setImages] = useState([]);

    // Dynamically import images
    useEffect(() => {
        const importImages = () => {
            const importedImages = [
                "/img_1.jpg",
                "/img_2.jpg",
                "/img_3.jpg",
                "/img_4", // Ensure the image has the correct extension, like .jpg or .png
            ];
            setImages(importedImages);
        };
        importImages();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-hero_gradient text-gray-800">
            <h1 className="text-9xl font-bold text-center mb-4 text-amber-100">
                Welcome to Taurus, the Pickleball App!
            </h1>

            {/* Image Row */}
            <div className="flex space-x-4 overflow-x-auto w-full max-w-[100rem] mb-10">
                {images.map((image, index) => (
                    <div key={index} className="flex justify-center">
                        <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-96 h-auto rounded-lg" // Increase the width to make the images larger
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
