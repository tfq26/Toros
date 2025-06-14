// src/data/navigation.js
export const mainNavigation = [
    // {
    //     title: "News",
    //     url: "/news",
    //     hasDropdown: true, // Added hasDropdown property
    //     items: [
    //         { title: "Latest News", url: "/news" },
    //     ],
    // },
    {
        title: "Tournaments",
        hasDropdown: true, // Added hasDropdown property
        items: [
            { title: "My Tournaments", url: "/tournament/my" },
            // { title: "Find Tournaments", url: "/tournament/find" },
            { title: "Create Tournament", url: "/tournament/setup" },
        ],
    },
    // { title: "Explore", url: "/explore", hasDropdown: false }, // Added hasDropdown property
];
