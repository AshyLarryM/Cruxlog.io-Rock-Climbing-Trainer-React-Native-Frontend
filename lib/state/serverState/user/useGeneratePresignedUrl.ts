import { useAuth } from "@clerk/clerk-expo";
import { baseUrl } from "@/constants/apiRepository";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface PresignedUrlResponse {
    url: string;
    key: string;
}

async function generatePresignedUrl(token: string, userId: string): Promise<PresignedUrlResponse> {
    const response = await fetch(`${baseUrl}/api/user/${userId}/presignedProfile`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Failed to generate pre-signed URL!');
    const data = await response.json();
    console.log('generate presignedUrl: ', data);
    return data;
}

export function useGeneratePresignedUrl(): UseMutationResult<PresignedUrlResponse, Error, void> {
    const { getToken, userId } = useAuth();

    return useMutation<PresignedUrlResponse, Error, void>({
        mutationFn: async () => {
            const token = await getToken();
            if (!token) {
                console.warn("No Token");
                throw new Error("Token not available");
            }
            return generatePresignedUrl(token, userId ?? '');
        },
    });
}
