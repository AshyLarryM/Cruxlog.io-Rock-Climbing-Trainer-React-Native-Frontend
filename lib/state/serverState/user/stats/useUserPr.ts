import { baseUrl } from "@/constants/apiRepository"
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
    userHardestGrades: {
        boulder: {
            grade: string,
            type: string,
        }
        route: {
            grade: string,
            type: string,
        }
    }
}

async function fetchUserPr(token: string, userId: string | null | undefined): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/stats`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error(`Failed to fetch user: ${userId} hardest climbs`);
    return response.json();
}

export function useUserPr() {
    const { getToken, userId } = useAuth();

    return useQuery<ApiResponse>({
        queryKey: ['userPr', userId],
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

            return fetchUserPr(token, userId);
        },
        refetchOnWindowFocus: false,
    })
}