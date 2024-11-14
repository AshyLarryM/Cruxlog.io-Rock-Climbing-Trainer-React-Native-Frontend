import { baseUrl } from "@/constants/apiRepository";
import { Climb } from "@/lib/utils/models/climbModels";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    climb?: Partial<Climb>,
}

async function updateClimb(token: string, userId: string, climbId: string, climbData: Partial<Climb>): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/climbs/${climbId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(climbData),
    });

    if (!response.ok) throw new Error('Failed to Update climb data!');
    return response.json();
}

export function useUpdateClimb(climbId: string): UseMutationResult<ApiResponse, Error, Partial<Climb>> {
    const { getToken, userId } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, Partial<Climb>>({
        mutationFn: async (climbData: Partial<Climb>) => {
            const token = await getToken();
            if (!token) {
                console.warn("No Token");
                throw new Error("Token not available");
            }
            return updateClimb(token, userId ?? '', climbId, climbData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:['user', userId, 'climb', climbId]});
        }
    });
}