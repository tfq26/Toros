import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NoTournamentsFound({ viewType, onRefresh }) {
    const navigate = useNavigate();

    const messages = {
        mine: {
            title: "You haven’t created any tournaments yet.",
            description: "Get started by setting up your first one!",
        },
        all: {
            title: "No tournaments available.",
            description: "Check back later or create one yourself.",
        },
    };

    const { title, description } = messages[viewType] || messages.all;

    return (
        <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground mt-2">{description}</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button variant="outline" onClick={onRefresh} className="w-full sm:w-auto">
                    Refresh List
                </Button>
                <Button onClick={() => navigate("/tournament/setup")} className="w-full sm:w-auto">
                    Setup a Tournament
                </Button>
            </div>
        </div>
    );
}