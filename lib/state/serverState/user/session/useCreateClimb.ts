import { baseUrl } from "@/constants/apiRepository";
import { Climb } from "@/lib/utils/models/climbModels";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    climb?: Climb,
}

async function createClimb(token: string, userId: string | null | undefined, payload: Climb): Promise<ApiResponse> {

    const response = await fetch(`${baseUrl}/api/user/${userId}/session`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error ('Failed To Save Climb!');
    return response.json();
}

export function useCreateClimb() {
    const { getToken, userId } = useAuth();

    return useMutation({
        mutationFn: async (payload: Climb) => {
            const token = await getToken();
            if (!token) {
                console.log("No Token");
                throw new Error("Token not available");
            } 
            if (!userId) {
                console.log("No User ID");
                throw new Error("User ID is missing");
            }

            return createClimb(token, userId, payload);
        },
        onError: (error: Error) => {
            console.error("Error creating climb:", error);
        },
        onSuccess: (data) => {
            console.log("Climb created successfully:", data);
        },
    });
}