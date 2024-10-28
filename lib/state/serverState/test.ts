import { useQuery } from "@tanstack/react-query";
import { baseUrl, apiTestUrl } from "@/constants/apiRepository";
import { useAuth } from "@clerk/clerk-expo";

interface ApiResponse {
    message: string;
}

async function fetchApiMessage(token: string): Promise<ApiResponse> {
    const response = await fetch(`http://192.168.1.5:3000${apiTestUrl}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Failed to fetch API');
    return response.json();
}

export function useFetchApiMessage() {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['apiMessage'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                console.log("No Token");
                throw new Error("Token not available");
            }
            return fetchApiMessage(token);
        },
    });
}