// src/data/navigation.js

export const siteLogo = {
    url: "/",
    src: "/svgs/bull-svgrepo-com_black.svg",
    darkSrc: "/svgs/bull-svgrepo-com.svg",
    alt: "Site Logo",
    title: "Toros",
};

export const mainNavigation = [
    {
        title: "Tournaments",
        hasDropdown: true,
        items: [
            {
                title: "My Tournaments",
                url: "/tournament/my",
                description: "View and manage tournaments you’ve joined or created.",
            },
            {
                title: "Create Tournament",
                url: "/tournament/setup",
                description: "Set up a new tournament from scratch.",
            },
            {
                title: "Manage Players",
                url: "/players",
                description: "View and manage your registered players.",
            },
            {
                title: "Live Window View",
                url: "/tournament/live",
                description: "View ongoing tournament matches on a public display.",
            },
            {
                title: "Test Page",
                url: "/test",
                description: "A temporary page for layout and routing tests.",
            },
        ],
    },
];
