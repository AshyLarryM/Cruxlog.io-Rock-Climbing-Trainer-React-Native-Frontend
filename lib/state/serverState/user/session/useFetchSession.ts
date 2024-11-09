import { baseUrl } from "@/constants/apiRepository";
import { Climb } from "@/lib/utils/types";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    session?: {
        id: number;
        userId: string;
        intensity: number;
        notes: string;
        completed: boolean;
        createdAt: string;
    };
    climbs?: Climb[];
}

async function fetchSessionAndClimbs(token: string, userId: string | null | undefined): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/session`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Failed to fetch session and climbs!');
    return response.json();
}

export function useFetchSession() {
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

            return fetchSessionAndClimbs(token, userId);
        },
        refetchOnWindowFocus: false,
    });
}
