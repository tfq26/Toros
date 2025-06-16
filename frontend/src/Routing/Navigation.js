// src/data/navigation.js

/**
 * The configuration object for the site logo.
 * The Navbar component uses this to display the logo correctly in light and dark modes.
 */
export const siteLogo = {
    url: "/",
    src: "/svgs/bull-svgrepo-com_black.svg", // Path to your light mode logo
    darkSrc: "/svgs/bull-svgrepo-com.svg",     // Path to your dark mode logo
    alt: "Site Logo",                         // Alt text for accessibility
    title: "Toros",                           // Title displayed in the mobile menu
};

/**
 * The main navigation structure for the website menu.
 * `hasDropdown: true` indicates a dropdown menu.
 * `items` contains the links within a dropdown.
 * Make sure each item has a `title` and a `url`.
 * The 'description' property is optional but recommended for dropdown items for better UI.
 */
export const mainNavigation = [
    {
        title: "Tournaments",
        hasDropdown: true,
        items: [
            {
                title: "My Tournaments",
                url: "/tournament/my",
                description: "View and manage the tournaments you have joined or created."
            },
            {
                title: "Create Tournament",
                url: "/tournament/setup",
                description: "Set up a new tournament from scratch."
            },
            {
                title: "Manage Players",
                url: "/players",
                description: "View and manage your list of registered players."
            },
            // ✨ NEW: Added a link to the live tournament window view.
            {
                title: "Live Window View",
                url: "/tournament/live", // This route should lead to a page that finds and displays the active tournament window.
                description: "View currently live tournament matches on a public display."
            }
        ],
    },

    // Example of another direct link:
    // {
    //     title: "About Us",
    //     url: "/about",
    //     hasDropdown: false,
    // }
];
