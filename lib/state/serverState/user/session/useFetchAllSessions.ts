import { baseUrl } from "@/constants/apiRepository"
import { Session } from "@/lib/utils/models/sessionModels";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    sessions: Session[],
}

async function fetchAllSessionsAndClimbs(token: string, userId: string | null | undefined): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/session/getAll`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Failed to fetch ALL sessions and climbs');
    return response.json();
}

export function useFetchAllSessions() {
    const { getToken, userId } = useAuth();

    return useQuery<ApiResponse>({
        queryKey: ['sessionClimbs', userId],
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
            return fetchAllSessionsAndClimbs(token, userId);
        },
        refetchOnWindowFocus: false,
    });
}