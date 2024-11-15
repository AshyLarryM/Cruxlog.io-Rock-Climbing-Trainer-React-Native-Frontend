import { baseUrl } from "@/constants/apiRepository"
import { Session } from "@/lib/utils/models/sessionModels";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    userStats: {
        type: string,
        style: string,
        count: number,
    }[],
}

async function fetchUserStats(token: string, userId: string | null | undefined): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/stats`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Failed to fetch user stats');
    return response.json();
}

export function useUserStats() {
    const { getToken, userId } = useAuth();

    return useQuery<ApiResponse>({
        queryKey: ['userStats', userId],
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
            return fetchUserStats(token, userId);
        },
        refetchOnWindowFocus: false,
    });
}