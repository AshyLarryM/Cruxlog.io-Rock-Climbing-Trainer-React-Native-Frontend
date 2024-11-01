import { useMutation } from "@tanstack/react-query";
import { baseUrl, createUserApi } from "@/constants/apiRepository";
import { useAuth } from "@clerk/clerk-expo";

interface CreateUserPayload {
    userId: string;
    email: string;
    fullName?: string;
}

interface ApiResponse {
    message: string;
}

async function createUser(token: string, payload: CreateUserPayload): Promise<ApiResponse> {

    console.log("Received request to create user");

    const response = await fetch(`${baseUrl}${createUserApi}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
}

export function useCreateUser() {
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (payload: CreateUserPayload) => {
            const token = await getToken();
            if (!token) {
                console.log("No Token");
                throw new Error("Token not available");
            }
            return createUser(token, payload);
        },
        onSuccess: (data) => {
            console.log("Mutation succeeded with response:", data);
        },
        onError: (error) => {
            console.error("Mutation error:", error);
        },
    });
}
