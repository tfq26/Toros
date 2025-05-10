import React from "react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet.jsx"; // Adjust the import paths as needed
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs.jsx";
import {Button} from "@/components/ui/button.jsx";
import PropTypes from "prop-types"; // Adjust the import paths as needed

const PlayerSidebar = ({ sections }) => {
    return (
        <Sheet>
            {/* The SheetTrigger can be styled or wrapped in a button */}
            <SheetTrigger asChild>
                <Button className="fixed right-4 top-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-md">
                    Open
                </Button>
            </SheetTrigger>
            {/* SheetContent defines the sliding panel */}
            <SheetContent side="right" className="w-96 p-4">
                <SheetHeader>
                    <SheetTitle>Sections</SheetTitle>
                    <SheetDescription>
                        Select a section to view its content.
                    </SheetDescription>
                </SheetHeader>

                {/* Tabs for section navigation */}
                <Tabs defaultValue={sections[0]?.id} className="w-full">
                    <TabsList className="mb-4">
                        {sections.map((section) => (
                            <TabsTrigger key={section.id} value={section.id}>
                                {section.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {sections.map((section) => (
                        <TabsContent key={section.id} value={section.id}>
                            {section.content}
                        </TabsContent>
                    ))}
                </Tabs>
            </SheetContent>
        </Sheet>
    );
};

PlayerSidebar.propTypes = {
    sections: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            content: PropTypes.node.isRequired,
        })
    ).isRequired,
};

export default PlayerSidebar;
