import { baseUrl } from "@/constants/apiRepository";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";

interface UpdateSessionPayload {
    sessionName: string;
    intensity: number;
    notes: string;
    completed: boolean;
}

interface ApiResponse {
    message: string;
    session?: {
        id: number;
        sessionName: string;
        intensity: number;
        notes: string;
        completed: boolean;
    };
}

async function updateSession(
    token: string,
    userId: string | null | undefined,
    payload: UpdateSessionPayload
): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/session`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to update session');
    return response.json();
}

export function useUpdateSession() {
    const { getToken, userId } = useAuth();

    return useMutation({
        mutationFn: async (payload: UpdateSessionPayload) => {
            const token = await getToken();
            if (!token) {
                console.log("No Token");
                throw new Error("Token not available");
            }
            if (!userId) {
                console.log("No User ID");
                throw new Error("User ID is missing");
            }

            return updateSession(token, userId, payload);
        },
        onError: (error: Error) => {
            console.error("Error updating session:", error);
        },
        onSuccess: (data) => {
            console.log("Session updated successfully:", data);
        },
    });
}
