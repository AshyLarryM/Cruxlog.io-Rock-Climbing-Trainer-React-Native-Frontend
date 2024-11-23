import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { Climb, ClimbStyleEnum, ClimbTypeEnum, boulderGradeMapping, routeGradeMapping } from '@/lib/utils/models/climbModels';
import { useRouter } from 'expo-router';
import UUID from 'react-native-uuid';
import { useCreateClimb } from '@/lib/state/serverState/user/session/useCreateClimb';
import Toast from 'react-native-toast-message';
import { useGenerateClimbPresignedUrl } from '@/lib/state/serverState/user/climb/useGenerateClimbPresignedUrl';
import { useUploadImage } from '@/lib/state/serverState/user/useUploadImage';
import { GradientButton } from '@/components/buttons/GradientButton';

export default function NewClimb() {

    const { data } = useMeUser();
    const createClimbMutation = useCreateClimb();
    const router = useRouter();
    const { mutate: generateClimbPresignedUrl } = useGenerateClimbPresignedUrl();
    const { mutateAsync: uploadImage } = useUploadImage();

    const initGradingSystem = data?.user?.gradingPreference === false ? 'VScale' : 'French';
    const isFrenchGrading = initGradingSystem === 'French';

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<ClimbTypeEnum>(Object.values(ClimbTypeEnum)[1]);
    const [style, setStyle] = useState<ClimbStyleEnum>(Object.values(ClimbStyleEnum)[1]);
    const [grade, setGrade] = useState('V0');
    const [attempts, setAttempts] = useState<number>(1);
    const [send, setSend] = useState<boolean>(false);
    const [climbImage, setClimbImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    function convertGradeForSaving(selectedGrade: string): string {
        if (type === ClimbTypeEnum.BOULDER) {
            return isFrenchGrading ? Object.keys(boulderGradeMapping).find(key => boulderGradeMapping[key] === selectedGrade) || selectedGrade : selectedGrade;
        } else if (type === ClimbTypeEnum.LEAD || ClimbTypeEnum.TOP_ROPE) {
            return isFrenchGrading ? Object.keys(routeGradeMapping).find(key => routeGradeMapping[key] === selectedGrade) || selectedGrade : selectedGrade;
        }
        return selectedGrade;
    }

    function incrementAttempts() {
        setAttempts(prev => prev + 1);
    }

    function decrementAttempts() {
        setAttempts(prev => Math.max(1, prev - 1))
    }

    async function handleSave() {
        if (!name.trim()) {
            Alert.alert("Validation Error", "Please enter a climb name");
            return;
        }

        setLoading(true);

        const standardizedGrade = convertGradeForSaving(grade);

        const climbData: Climb = {
            id: UUID.v4() as string,
            name,
            type,
            style,
            grade: standardizedGrade,
            attempts,
            send,
        };

        if (climbImage) {
            generateClimbPresignedUrl(climbData.id, {
                onSuccess: (presignedUrlResponse) => {
                    uploadImage(
                        { url: presignedUrlResponse.url, imageUri: climbImage },

                        {
                            onSuccess: () => {
                                const updatedClimbData = {
                                    ...climbData,
                                    climbImage: `https://rock-climbing-app.s3.us-west-1.amazonaws.com/${presignedUrlResponse.key}`
                                };

                                createClimbMutation.mutate(updatedClimbData, {
                                    onSuccess: () => {
                                        setLoading(false);
                                        Toast.show({
                                            type: "success",
                                            text1: "Saved Climb",
                                            swipeable: true,
                                        });
                                        router.back();
                                    },
                                    onError: (error) => {
                                        setLoading(false);
                                        console.error("Error saving climb:", error);
                                        Toast.show({
                                            type: "error",
                                            text1: "Failed to Save Climb",
                                            swipeable: true,
                                        });
                                    },
                                });
                            },
                            onError: (error) => {
                                setLoading(false);
                                console.error("Image upload failed:", error);
                                Toast.show({
                                    type: "error",
                                    text1: "Failed to Upload Climb Image",
                                    swipeable: true,
                                });
                            },
                        }
                    );
                },
                onError: (error) => {
                    setLoading(false);
                    console.error("Failed to generate presigned URL:", error);
                    Toast.show({
                        type: "error",
                        text1: "Failed to generate presigned URL",
                        swipeable: true,
                    });
                },
            });
        } else {
            // Save the climb data without an image
            createClimbMutation.mutate(climbData, {
                onSuccess: () => {
                    setLoading(false);
                    Toast.show({
                        type: "success",
                        text1: "Saved Climb",
                        swipeable: true,
                    });
                    router.back();
                },
                onError: (error) => {
                    setLoading(false);
                    console.error("Error saving climb:", error);
                    Toast.show({
                        type: "error",
                        text1: "Failed to Save Climb",
                        swipeable: true,
                    });
                },
            });
        }
    }


    async function requestPermissions() {
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libraryPermission.granted) {
            Alert.alert(
                "Permission Required",
                "CruxLog needs access to your photo library to upload images for climbs. Please enable permissions in Settings.",
                [{ text: "OK" }]
            );
            return false;
        }

        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
            Alert.alert(
                "Permission Required",
                "CruxLog needs access to your camera to take photos for climbs. Please enable permissions in Settings.",
                [{ text: "OK" }]
            );
            return false;
        }
        return true;
    }


    async function chooseImage() {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        Alert.alert(
            "Upload or Take Photo",
            "Choose how you'd like to add a photo",
            [
                {
                    text: "Take Photo",
                    onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.3,
                        });

                        if (!result.canceled && result.assets && result.assets.length > 0) {
                            setClimbImage(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: "Upload from Library",
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.5,
                        });

                        if (!result.canceled && result.assets && result.assets.length > 0) {
                            setClimbImage(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    }



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter Climb Name..."
                placeholderTextColor="#888"
                keyboardType="default"
            />

            <View style={styles.inlineContainer}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Type</Text>
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue) => setType(itemValue as ClimbTypeEnum)}
                        style={styles.picker}
                    >
                        {Object.values(ClimbTypeEnum).map((climbType) => (
                            <Picker.Item key={climbType} label={climbType} value={climbType} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Style</Text>
                    <Picker
                        selectedValue={style}
                        onValueChange={(itemValue) => setStyle(itemValue as ClimbStyleEnum)}
                        style={styles.picker}
                    >
                        {Object.values(ClimbStyleEnum).map((climbStyle) => (
                            <Picker.Item key={climbStyle} label={climbStyle} value={climbStyle} />
                        ))}
                    </Picker>
                </View>
            </View>

            <Text style={styles.label}>Grade</Text>
            <Picker
                selectedValue={grade}
                onValueChange={(itemValue) => setGrade(itemValue)}
                style={styles.picker}
            >
                {Object.entries(type === ClimbTypeEnum.BOULDER ? boulderGradeMapping : routeGradeMapping).map(([vScale, frenchScale]) => (
                    <Picker.Item
                        key={vScale}
                        label={isFrenchGrading ? frenchScale : vScale}
                        value={isFrenchGrading ? frenchScale : vScale}
                    />
                ))}
            </Picker>

            <View style={styles.attemptsContainer}>
                <View style={styles.attemptWrapper}>
                    <Text style={styles.attemptsLabel}>Attempts</Text>
                    <View style={styles.attemptsControls}>
                        <TouchableOpacity
                            onPress={decrementAttempts}
                            disabled={attempts === 1}
                            style={[styles.attemptButton, attempts === 1 && styles.disabledButton]}
                        >
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.attemptsText}>{attempts}</Text>
                        <TouchableOpacity onPress={incrementAttempts} style={styles.attemptButton}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sendWrapper}>
                    <Text style={styles.label}>Send?</Text>
                    <View style={styles.switchContainer}>
                        <Switch
                            value={send}
                            onValueChange={setSend}
                            style={styles.switch}
                            trackColor={{ false: "#fff", true: "#6c47ff" }}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={chooseImage}>
                <View style={styles.imageContainer}>
                    {climbImage ? (
                        <Image source={{ uri: climbImage }} style={styles.climbImage} />
                    ) : (
                        <Text style={styles.imagePlaceholder}>Upload Climb Image</Text>
                    )}
                </View>
            </TouchableOpacity>

            <GradientButton onPress={handleSave} loading={loading} text='Add Climb' /> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding:20,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
    },
    label: {
        textAlign: 'center',
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
    picker: {
        marginTop: -20,
        marginBottom: -30,
    },
    input: {
        height: 40,
        borderWidth: 1.5,
        borderColor: '#6c47ff',
        fontSize: 16,
        marginVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        textAlign: 'center',
    },
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    pickerContainer: {
        flex: 1,
        marginHorizontal: 4,
    },
    
    attemptsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        marginVertical: 8,
    },
    attemptWrapper: {
        alignItems: 'center',
    },
    attemptsControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sendWrapper: {
        alignItems: 'center',
    },
    switchContainer: {
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    },
    switch: {
        marginVertical: 16,
        color: '#6c47ff',
    },
    attemptsLabel: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
        color: '#555',
        fontWeight: 'bold',
    },
    attemptsText: {
        fontSize: 24,
        marginHorizontal: 16,
    },
    attemptButton: {
        width: 50,
        height: 50,
        backgroundColor: '#6c47ff',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 32,
    },
    addButton: {
        marginTop: 12,
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
    },
    climbImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    imagePlaceholder: {
        color: '#6c47ff',
        fontSize: 16,
        padding: 10,
    },
});
