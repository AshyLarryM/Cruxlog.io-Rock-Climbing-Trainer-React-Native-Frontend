import { baseUrl } from "@/constants/apiRepository";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface ApiResponse {
    message: string,
}

async function deleteUser(token: string, userId: string): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error(`Failed to delete user ${userId}`);
    return response.json()
}

export function useDeleteUser(): UseMutationResult<ApiResponse, Error, void, unknown> {
    const { getToken, userId } = useAuth();

    return useMutation<ApiResponse, Error, void, unknown>({
        mutationFn: async () => {
            const token = await getToken();
            if (!token || !userId) {
                console.warn("No Token or UserId");
                throw new Error("Token or UserId not available");
            }
            return deleteUser(token, userId);
        },
    });
}