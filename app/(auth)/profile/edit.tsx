import { View, Text, TextInput, Button, StyleSheet, Switch, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { useUpdateUser } from '@/lib/state/serverState/user/useUpdateUser';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useGenerateProfilePresignedUrl } from '@/lib/state/serverState/user/useGeneratePresignedUrl';
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
    const { mutateAsync: generateProfilePresignedUrl } = useGenerateProfilePresignedUrl();
    const { mutateAsync: uploadImage } = useUploadImage();

    async function handleSave() {
        try {
            let profileImageUrl = profileImage;

            if (profileImage) {
                const { url, key } = await generateProfilePresignedUrl();
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

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                    value={age !== undefined ? age.toString() : ''}
                    onChangeText={(text) => setAge(text ? Number(text) : undefined)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your height"
                    keyboardType="numeric"
                    value={height !== undefined ? height.toString() : ''}
                    onChangeText={(text) => setHeight(text ? Number(text) : undefined)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your weight"
                    keyboardType="numeric"
                    value={weight !== undefined ? weight.toString() : ''}
                    onChangeText={(text) => setWeight(text ? Number(text) : undefined)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Ape Index</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your ape index"
                    keyboardType="numeric"
                    value={apeIndex !== undefined ? apeIndex.toString() : ''}
                    onChangeText={(text) => setApeIndex(text ? Number(text) : undefined)}
                />
            </View>
            {/* Grading Preference Switch */}
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Grading Preference (YDS - V Scale / French)</Text>
                <Switch
                    value={gradingPreference}
                    onValueChange={setGradingPreference}
                />
            </View>

            {/* Measurement System Switch */}
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Measurement System (Metric / Imperial)</Text>
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
    inputGroup: {
        marginBottom: 15,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 40,
        width: 200,
        borderColor: '#6c47ff',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
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
