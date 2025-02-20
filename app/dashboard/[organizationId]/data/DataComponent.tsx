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

const DataComponent = ({ Id }): JSX.Element => {
    const { data, loading, error } = useQuery(GET_ORGANIZATION_DATA, { organizationId });
    const addData = useMutation(ADD_ORGANIZATION_DATA);
    const [newDataKey, setNewDataKey] = useState<string>("");
    const [newDataValue, setNewDataValue] = useState<string>("");

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

            await addData({
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
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error('Error adding data:', error);
            toast({
                title: "Error adding data", 
                description: errorMessage,
                variant: "destructive",
            });
        }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
