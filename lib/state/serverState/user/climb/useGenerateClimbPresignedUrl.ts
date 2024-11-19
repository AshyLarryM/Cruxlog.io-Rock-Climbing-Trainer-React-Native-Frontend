import { useAuth } from "@clerk/clerk-expo";
import { baseUrl } from "@/constants/apiRepository";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface PresignedUrlResponse {
    url: string;
    key: string;
}

async function generateClimbPresignedUrl(token: string, userId: string, climbId: string): Promise<PresignedUrlResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/climbs/${climbId}/presignedClimb`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Failed to generate pre-signed URL!');
    const data = await response.json();
    return data;
}

export function useGenerateClimbPresignedUrl(): UseMutationResult<PresignedUrlResponse, Error, string> {
    const { getToken, userId } = useAuth();

    return useMutation<PresignedUrlResponse, Error, string>({
        mutationFn: async (climbId: string) => {
            const token = await getToken();
            if (!token) {
                console.warn("No Token");
                throw new Error("Token not available");
            }
            return generateClimbPresignedUrl(token, userId ?? '', climbId);
        },
    });
}