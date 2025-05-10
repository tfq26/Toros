import "react";
import { NavbarUpdated } from "@/components/Navbar/NavbarUpdated.jsx";
import PropTypes from "prop-types";
import { mainNavigation } from "@/Routing/Navigation.js";
import Footer from "./Footer.jsx";

export default function Layout({ children }) {
    return (
        <div className="h-screen overflow-x-hidden flex flex-col">
            <header className="sticky top-0 z-50 bg-transparent px-2 pt-2">
                <NavbarUpdated menu={mainNavigation} />
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};
