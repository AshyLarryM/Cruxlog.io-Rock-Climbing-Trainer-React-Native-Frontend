import { View, Text, TextInput, Button, StyleSheet, Switch, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { useUpdateUser } from '@/lib/state/serverState/user/useUpdateUser';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useGeneratePresignedUrl } from '@/lib/state/serverState/user/useGeneratePresignedUrl';
import { useUploadImage } from '@/lib/state/serverState/user/useUploadImage';

export default function EditProfile() {
    const { data } = useMeUser();

    const [fullName, setFullName] = useState(data?.user?.fullName || '');
    const [age, setAge] = useState<number | undefined>(data?.user?.age);
    const [height, setHeight] = useState<number | undefined>(data?.user?.height);
    const [weight, setWeight] = useState<number | undefined>(data?.user?.weight);
    const [apeIndex, setApeIndex] = useState<number | undefined>(data?.user?.apeIndex);
    const [gradingPreference, setGradingPreference] = useState(data?.user?.gradingPreference || false);
    const [measurementSystem, setMeasurementSystem] = useState(data?.user?.measurementSystem || false);
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

    const { mutate: updateUser, isPending } = useUpdateUser();
    const { mutateAsync: generatePresignedUrl } = useGeneratePresignedUrl();
    const { mutateAsync: uploadImage } = useUploadImage();

    async function handleSave() {
        try {
            let profileImageUrl = profileImage;

            if (profileImage) {
                const { url, key } = await generatePresignedUrl();
                try {
                    await uploadImage({ url, imageUri: profileImage });
                    profileImageUrl = `https://rock-climbing-app.s3.us-west-1.amazonaws.com/${key}`;
                } catch (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Image upload failed!",
                    });
                    return;
                }
            }

            updateUser(
                {
                    fullName,
                    age,
                    height,
                    weight,
                    apeIndex,
                    gradingPreference,
                    measurementSystem,
                    profileImage: profileImageUrl,
                },
                {
                    onSuccess: () => {
                        router.back();
                        Toast.show({
                            type: "success",
                            text1: "Updated",
                            text2: "User Profile Updated!"
                        });
                    },
                    onError: (error) => {
                        console.error("Failed to update profile:", error);
                        Toast.show({
                            type: "error",
                            text1: "Error",
                            text2: "Failed to Update Profile!"
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error during profile update:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to Update Profile!"
            })
        }
    }


    async function chooseImage() {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }

    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={chooseImage}>
                <View style={styles.imageContainer}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <Text style={styles.imagePlaceholder}>Upload Profile Image</Text>
                    )}
                </View>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />

            <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={age !== undefined ? age.toString() : ''}
                onChangeText={(text) => setAge(text ? Number(text) : undefined)}
            />

            <TextInput
                style={styles.input}
                placeholder="Height"
                keyboardType="numeric"
                value={height !== undefined ? height.toString() : ''}
                onChangeText={(text) => setHeight(text ? Number(text) : undefined)}
            />

            <TextInput
                style={styles.input}
                placeholder="Weight"
                keyboardType="numeric"
                value={weight !== undefined ? weight.toString() : ''}
                onChangeText={(text) => setWeight(text ? Number(text) : undefined)}
            />

            <TextInput
                style={styles.input}
                placeholder="Ape Index"
                keyboardType="numeric"
                value={apeIndex !== undefined ? apeIndex.toString() : ''}
                onChangeText={(text) => setApeIndex(text ? Number(text) : undefined)}
            />

            {/* Grading Preference Switch */}
            <View style={styles.switchContainer}>
                <Text>Grading Preference (French / YDS-V Scale)</Text>
                <Switch
                    value={gradingPreference}
                    onValueChange={setGradingPreference}
                />
            </View>

            {/* Measurement System Switch */}
            <View style={styles.switchContainer}>
                <Text>Measurement System (Metric / Imperial)</Text>
                <Switch
                    value={measurementSystem}
                    onValueChange={setMeasurementSystem}
                />
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.updateButton}>
                {isPending ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    imagePlaceholder: {
        color: '#6c47ff',
        fontSize: 16,
        padding: 10,
    },
    updateButton: {
        marginTop: 12,
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
