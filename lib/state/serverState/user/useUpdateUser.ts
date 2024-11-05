import { useAuth } from "@clerk/clerk-expo";
import { baseUrl } from "@/constants/apiRepository";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/utils/types";

interface ApiResponse {
    message: string;
    user?: Partial<User>;
}
async function updateUser(token: string, userId: string | null | undefined, userData: Partial<User>): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) throw ('Failed to update user data!');
    const data = await response.json();
    return data;
}

export function useUpdateUser(userId: string | null | undefined): UseMutationResult<ApiResponse, Error, Partial<User>> {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, Partial<User>>({
        mutationFn: async (userData: Partial<User>) => {
            const token = await getToken();
            if (!token) {
                console.warn("No Token");
                throw new Error("Token not available");
            }
            // Use a fallback userId if undefined or null
            return updateUser(token, userId ?? '', userData);
        },
        onSuccess: () => {
            // Use an object with queryKey to explicitly specify the key for invalidateQueries
            queryClient.invalidateQueries({ queryKey: ['user', userId ?? 'unknown'] });
        },
    });
}