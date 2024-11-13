import { useAuth } from "@clerk/clerk-expo";
import { baseUrl } from "@/constants/apiRepository";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/utils/types";

interface ApiResponse {
    message: string;
    user?: Partial<User>;
}

async function getUser(token: string, userId: string | null | undefined): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Failed to get user data!');
    const data = await response.json();
    return data;
}

export function useMeUser() {
    const { getToken, userId } = useAuth();

    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                console.warn("No Token")
                throw new Error("Token not available");
            }
            return getUser(token, userId);
        },
    });
}