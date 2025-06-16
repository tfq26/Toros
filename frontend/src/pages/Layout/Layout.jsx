import React from "react";
import { Outlet } from "react-router-dom"; // ✨ NEW: Import Outlet
import { NavbarEnhanced  } from "@/components/Navbar/NavbarUpdated.jsx";
import PropTypes from "prop-types";
import { mainNavigation, siteLogo } from "@/Routing/Navigation.js"; // ✨ NEW: Import siteLogo
import Footer from "./Footer.jsx";

export default function Layout() { // ✨ REMOVED: `children` prop is no longer needed
    return (
        <div className="h-screen w-full overflow-x-hidden flex flex-col">
            <header className="sticky top-0 z-50 bg-transparent px-2 pt-2">
                {/* ✨ FIXED: Pass both the menu and logo props */}
                <NavbarEnhanced menu={mainNavigation} logo={siteLogo} />
            </header>

            {/* ✨ FIXED: Added `overflow-y-auto` to allow this section to scroll independently */}
            <main className="flex-grow overflow-y-auto">
                {/* ✨ This Outlet component tells the router where to render the nested pages */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

// ✨ REMOVED: The propTypes for children are no longer needed.
// Layout.propTypes = {
//     children: PropTypes.node.isRequired,
// };
