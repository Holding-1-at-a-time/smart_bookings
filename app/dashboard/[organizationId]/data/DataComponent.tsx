/**
 * @description      : This component displays the organization data and allows the user to add new data.
 * @author           : rrome
 * @group            : 
 * @created          : 19/02/2025 - 21:15:11
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 19/02/2025
 * - Author          : rrome
 * - Modification    : 
 */
"use client"

import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "convex/react";
import { JSX, useState, ChangeEvent } from "react";




/**
 * DataComponent
 * 
 * This component displays the organization data and allows the user to add new data.
 * 
 * @param {string} organizationId - The ID of the organization
 * @returns {JSX.Element} A JSX element
 */

const GET_ORGANIZATION_DATA = api.organizations.getOrganizationDataByKey;
const ADD_ORGANIZATION_DATA = api.organizations.upsertOrganizationData;

const DataComponent = ({ organizationId }: { organizationId: Id }): JSX.Element => {
    const addData = useMutation(ADD_ORGANIZATION_DATA);
    const [newDataKey, setNewDataKey] = useState<string>("");
    const [newDataValue, setNewDataValue] = useState<string>("");
    const { data, loading, error } = useQuery(GET_ORGANIZATION_DATA, { organizationId });

    /**
     * handleAddData
     * 
     * Adds a new data entry for the organization. If the key already exists, it will be updated.
     * If the input is invalid (e.g. empty key or value), displays an error message.
     * If the data is successfully added, displays a success message with the added key and value.
     * If an error occurs during the mutation, displays an error message with the error details.
     * @returns {Promise<void>}
     */
    const handleAddData = async (): Promise<void> => {
        if (!newDataKey.trim() || !newDataValue.trim()) {
            toast({
                title: "Invalid input",
                description: "Both key and value must be non-empty",
                variant: "destructive",
            });
            return;
        }
        try {
            const addedKey = newDataKey;
            const addedValue = newDataValue;

            const result = await addData({
                _id: organizationId,
                dataKey: newDataKey,
                dataValue: newDataValue,
            });

            setNewDataKey("");
            setNewDataValue("");

            toast({
                title: "Data added",
                description: `Data added: ${addedKey} = ${addedValue}`,
                variant: "default",
            });

            return result; // Return the result of addData if needed.
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error instanceof Error) {
                errorMessage = error.message;

                // Check for specific error types or messages
                if (error.message.includes("duplicate key")) {
                    errorMessage = "A data entry with this key already exists.";
                } else if (error.message.includes("validation failed")) {
                    errorMessage = "Invalid data format. Please check your input.";
                } // Add more specific error checks as needed.
            } else if (typeof error === "string") {
                errorMessage = error;
            }

            toast({
                title: "Error adding data",
                description: errorMessage,
                variant: "destructive",
            });

            // Consider re-throwing the error or logging it for debugging
            console.error("Error adding data:", error);
            throw error; // Uncomment if you want to re-throw the error.
        }
    };

    if (LoadingSpinner) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Organization Data</h2>
                {data ? (
                    data.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No data available</p>
                    ) : (
                        <ul className="space-y-2">
                            {data.map((item) => (
                                <li key={item._id} className="flex justify-between items-center">
                                    <span className="font-medium">{item.data.key}:</span>
                                    <span>{item.data.value}</span>
                                </li>
                            ))}
                        </ul>
                    )
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
            <div className="space-y-4">
                <Input
                    type="text"
                    value={newDataKey}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDataKey(e.target.value)}
                    placeholder="Enter new data key"
                    className="w-full"
                />
                <Input
                    type="text"
                    value={newDataValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDataValue(e.target.value)}
                    placeholder="Enter new data value"
                    className="w-full"
                />
                <Button onClick={handleAddData} disabled={loading} className="w-full">
                    Add Data
                </Button>
            </div>
        </div>
    );
};
export default DataComponent;
