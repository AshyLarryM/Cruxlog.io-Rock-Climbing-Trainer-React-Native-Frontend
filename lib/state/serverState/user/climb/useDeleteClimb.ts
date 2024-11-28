import { baseUrl } from "@/constants/apiRepository";
import { Climb } from "@/lib/utils/models/climbModels";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    deletedClimb: Climb,
}

async function deleteClimb(token: string, userId: string, climbId: string): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/user/${userId}/climbs/${climbId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    })

    if (!response.ok) throw new Error("Failed to Delete Climb!");
    return response.json();
}

export function useDeleteClimb(climbId: string) {
    const { getToken, userId } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(climbId: string) => {
            const token = await getToken();

            if (!token) {
                console.warn("No Token");
                throw new Error("Token not available");
            }
            if (!userId) {
                throw new Error("User is not authenticated");
            }
            if (!climbId) {
                throw new Error("No climb id");
            }

            return deleteClimb(token, userId ?? '', climbId)
            
        },
        onSuccess: (data, climbId) => {
            if (userId) {
                queryClient.invalidateQueries({
                    queryKey: ['climbs', userId],
                });
            } else {
                console.error("Cannot invalidate queries because userId is undefined or null.");
            }
        },
        onError: (error) => {
            console.error("Error deleting climb:", error);
        },
    })
    
}