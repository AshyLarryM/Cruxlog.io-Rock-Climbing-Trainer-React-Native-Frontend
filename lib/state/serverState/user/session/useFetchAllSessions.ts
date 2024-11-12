import { baseUrl } from "@/constants/apiRepository"
import { Climb } from "@/lib/utils/types"
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    sessions: [
        {
            id: number,
            userId: string,
            sessionName: string,
            intensity: number,
            notes: string,
            createdAt: Date,
            completed: boolean,
            sessionStats: {
                highestBoulderGrade: string | null,
                highestRouteGrade: string | null,
                totalClimbs: number,
                totalAttempts: number,
                completedBoulders: number,
                completedRoutes: number,
                totalSends: number,
                totalFlashes: number,
            },
        },
    ],
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