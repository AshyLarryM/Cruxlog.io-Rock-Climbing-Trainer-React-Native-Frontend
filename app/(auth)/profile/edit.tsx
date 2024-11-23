import { View, Text, TextInput, Button, StyleSheet, Switch, ActivityIndicator, TouchableOpacity, Image, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { useUpdateUser } from '@/lib/state/serverState/user/useUpdateUser';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useGenerateProfilePresignedUrl } from '@/lib/state/serverState/user/useGeneratePresignedUrl';
import { useUploadImage } from '@/lib/state/serverState/user/useUploadImage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDeleteUser } from '@/lib/state/serverState/user/useDeleteUser';
import { GradientButton } from '@/components/buttons/GradientButton';

export default function EditProfile() {
    const { data } = useMeUser();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    const [fullName, setFullName] = useState(data?.user?.fullName || '');
    const [age, setAge] = useState<number | null>(data?.user?.age ?? null);
    const [height, setHeight] = useState<number | null>(data?.user?.height ?? null);
    const [weight, setWeight] = useState<number | null>(data?.user?.weight ?? null);
    const [apeIndex, setApeIndex] = useState<number | null>(data?.user?.apeIndex ?? null);
    const [gradingPreference, setGradingPreference] = useState(data?.user?.gradingPreference || false);
    const [measurementSystem, setMeasurementSystem] = useState(data?.user?.measurementSystem || false);
    const [profileImage, setProfileImage] = useState<string | null>(data?.user?.profileImage ?? null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState<boolean>(false);



    const { mutate: updateUser, isPending } = useUpdateUser();
    const { mutateAsync: generateProfilePresignedUrl } = useGenerateProfilePresignedUrl();
    const { mutateAsync: uploadImage } = useUploadImage();

    async function handleSave() {
        setIsUpdating(true)
        try {
            let profileImageUrl = profileImage;

            const isProfileImageChanged = profileImage !== data?.user?.profileImage;

            if (isProfileImageChanged && profileImage) {
                const { url, key } = await generateProfilePresignedUrl();
                try {
                    setIsImageUploading(true),
                        await uploadImage({ url, imageUri: profileImage });
                    profileImageUrl = `https://rock-climbing-app.s3.us-west-1.amazonaws.com/${key}`;
                    setIsImageUploading(false);
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
                    profileImage: isProfileImageChanged ? profileImageUrl : undefined,
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
        finally {
            setIsUpdating(false);
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

    async function showDeleteModal() {
        setModalVisible(true);
    }

    const handleDeleteAccount = () => {
        deleteUser(undefined, {
            onSuccess: () => {
                Toast.show({
                    type: "success",
                    text1: "Account Deleted",
                    text2: "Your account has been successfully deleted.",
                });
                router.replace("/register");
            },
            onError: (error) => {
                console.error("Error deleting account:", error);
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to delete account.",
                });
            },
        });
    };


    return (
        <View style={styles.container}>
            <Spinner
                visible={isImageUploading || isUpdating}
                textContent={isImageUploading ? "Uploading Image..." : "Updating Profile..."}
                textStyle={{ color: '#fff' }}
                overlayColor="rgba(0, 0, 0, 0.7)"
            />
            <TouchableOpacity onPress={chooseImage}>
                <View style={styles.imageContainer}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <Text style={styles.imagePlaceholder}>Upload Profile Image</Text>
                    )}
                </View>
            </TouchableOpacity>

            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputFieldWithIcon}
                    placeholder="Enter your full name"
                    value={fullName !== null ? fullName.toString() : ''}
                    onChangeText={setFullName}
                />
            </View>

            <Text style={styles.label}>Age</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputFieldWithIcon}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                    value={age !== null ? age.toString() : ''}
                    onChangeText={(text) => setAge(text ? Number(text) : null)}
                />
            </View>

            {/* <View style={styles.inputGroup}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your height"
                    keyboardType="numeric"
                    value={height !== null ? height.toString() : ''}
                    onChangeText={(text) => setHeight(text ? Number(text) : null)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your weight"
                    keyboardType="numeric"
                    value={weight !== null ? weight.toString() : ''}
                    onChangeText={(text) => setWeight(text ? Number(text) : null)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Ape Index</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your ape index"
                    keyboardType="numeric"
                    value={apeIndex !== null ? apeIndex.toString() : ''}
                    onChangeText={(text) => setApeIndex(text ? Number(text) : null)}
                />
            </View> */}
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

            {/* <GradientButton onPress={handleSave} text='Update Profile' loading={isPending} /> */}

            <Pressable style={styles.button} onPress={showDeleteModal}>
                <Text style={styles.linkText}>Delete Account</Text>
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Delete your Account?</Text>
                        <Text style={styles.modalSubText}>Are you sure? All data and account information will be permanently deleted.</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    handleDeleteAccount();
                                }}
                            >
                                {isPending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>DELETE</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
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
        // marginBottom: ,
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
        borderRadius: 24,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        marginTop: 32,
        alignItems: 'center',
    },
    linkText: {
        color: '#ff0000',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 35,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6c47ff'
    },
    cancelButtonText: {
        color: '#6c47ff',
        fontSize: 16,

    },
    submitButton: {
        backgroundColor: '#ff0000',
        borderWidth: 1,
        borderColor: '#ff0000',
    },
    submitButtonText: {
        color: '#fff',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#6c47ff',
        borderRadius: 24,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    inputFieldWithIcon: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingLeft: 10,
    },
});
