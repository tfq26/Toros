import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";

export default function DashboardTab({ tournament }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>A summary of your tournament.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold">{tournament?.teams?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Participants</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold">{tournament?.matches?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Matches</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold capitalize">{tournament?.status?.toLowerCase() || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Status</p>
                </div>
            </CardContent>
        </Card>
    );
}

DashboardTab.propTypes = {
    tournament: PropTypes.object.isRequired,
};