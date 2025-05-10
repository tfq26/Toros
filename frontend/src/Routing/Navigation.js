// src/data/navigation.js
export const mainNavigation = [
    {
        title: "News",
        url: "/news",

        items: [
            { title: "Latest News", url: "/news" },
        ],
    },
    {
        title: "Tournaments",
        items: [
            { title: "My Tournaments", url: "/tournament/my" },
            { title: "Find Tournaments", url: "/tournament/find" },
            { title: "Create Tournament", url: "/tournament/setup" },
            // The live tournament route is dynamic (/tournament/live/:tournamentId),
            // so it's less suitable for a static main navigation.
            // You might link to a "Live" page that then displays active tournaments.
            // { title: "Live Tournament", url: "/tournament/live" },
        ],
    },
    { title: "Explore", url: "/explore" },
];