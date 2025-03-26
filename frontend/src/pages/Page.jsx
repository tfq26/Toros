// Page.jsx
import React, { useEffect } from "react";

const Page = ({ title, children }) => {
    useEffect(() => {
        document.title = `Toros - ${title}`;
    }, [title]);

    return children;
};

export default Page;
