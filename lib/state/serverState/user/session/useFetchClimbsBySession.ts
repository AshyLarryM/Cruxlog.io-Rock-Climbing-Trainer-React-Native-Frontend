import { baseUrl } from "@/constants/apiRepository";
import { Climb } from "@/lib/utils/models/climbModels";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    climbs: Climb[],
}

async function fetchClimbsBySession(token: string, userId: string | null | undefined, sessionId: number): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/session/${sessionId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error(`Failed to fetch climbs from session: ${sessionId}`);
    return response.json();
}

export function useFetchClimbsBySession(sessionId: number) {
    const { getToken, userId } = useAuth();

    return useQuery<ApiResponse>({
        queryKey: ['sessionClimbs', userId, sessionId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                console.log("No Token");
                throw new Error("Token not available");
            }
            if (!userId) {
                console.log("No User ID");
                throw new Error("User ID is missing");
            }

            return fetchClimbsBySession(token, userId, sessionId);
        },
        refetchOnWindowFocus: false,
    })
}