import { useMutation } from "@tanstack/react-query";

async function uploadImageToS3(url: string, imageUri: string): Promise<void> {
    const response = await fetch(imageUri);
    if (!response.ok) {
        throw new Error("Failed to fetch image from local URI");
    }
    const blob = await response.blob();

    const uploadResponse = await fetch(url, {
        method: "PUT",
        body: blob,
        headers: {
            "Content-Type": "image/jpeg",
        },
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("S3 Upload Error Response:", errorText);
        throw new Error("Image upload failed!");
    }
}

export function useUploadImage() {
    return useMutation<void, Error, { url: string; imageUri: string }>({
        mutationFn: ({ url, imageUri }) => uploadImageToS3(url, imageUri),
    });
}