// src/components/TournamentItem.jsx
import PropTypes from "prop-types";
import { convertDate } from "@/utils/functions/dataUtils.js";
import { Button } from "@/components/ui/button.jsx";

export default function TournamentItem({
                                           tournament,
                                           actions,
                                           className = "",
                                       }) {
    return (
        <li
            className={`border p-4 rounded-lg transition dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 ${className}`}
        >
            <div
                className="cursor-pointer"
                onClick={() => {
                    // Optional: auto-invoke any “view” action on header click
                    const view = actions.find((a) => a.type === "view");
                    view?.onClick(tournament.id);
                }}
            >
                <p className="text-lg font-semibold">{tournament.name}</p>
                <p className="text-gray-600 dark:text-gray-300">ID: {tournament.id}</p>
                <p className="text-gray-600 dark:text-gray-300">
                    Started: {convertDate(tournament.startTime, navigator.language)}
                </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {actions.map((act, i) => (
                    <Button
                        key={i}
                        onClick={() => act.onClick(tournament, tournament.id)}
                        disabled={act.disabled}
                        title={act.title}
                        className={
                            act.className ||
                            "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        }
                    >
                        {act.label}
                    </Button>
                ))}
            </div>
        </li>
    );
}

TournamentItem.propTypes = {
    tournament: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
    }).isRequired,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            disabled: PropTypes.bool,
            title: PropTypes.string,
            className: PropTypes.string,
            type: PropTypes.string, // e.g. "register", "view", "contact"
        })
    ).isRequired,
    className: PropTypes.string,
};

TournamentItem.defaultProps = {
    className: "",
};
