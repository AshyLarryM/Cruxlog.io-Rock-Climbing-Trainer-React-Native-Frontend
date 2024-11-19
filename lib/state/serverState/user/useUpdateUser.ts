import { useAuth } from "@clerk/clerk-expo";
import { baseUrl } from "@/constants/apiRepository";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/utils/types";
import Toast from "react-native-toast-message";

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

export function useUpdateUser(): UseMutationResult<ApiResponse, Error, Partial<User>> {
    const { getToken, userId } = useAuth();
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, Partial<User>>({
        mutationFn: async (userData: Partial<User>) => {
            const token = await getToken();
            if (!token) {
                console.warn("No Token");
                throw new Error("Token not available");
            }
            return updateUser(token, userId ?? '', userData);
        },
        onSuccess: () => {
            Toast.show({
				type: "success",
                text1: "Updated Profile",
				text2: "User Profile Successfully Updated",
				swipeable: true,
			});
            queryClient.invalidateQueries({ queryKey: ['user', userId ?? 'unknown'] });
        },
        onError: () => {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "User Updated Failed",
            });
        },
    });
}