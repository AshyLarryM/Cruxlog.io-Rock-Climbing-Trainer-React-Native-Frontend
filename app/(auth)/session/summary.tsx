import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Image, Modal } from 'react-native';
import { useFetchSession } from '@/lib/state/serverState/user/session/useFetchSession';
import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { useUpdateSession } from '@/lib/state/serverState/user/session/useUpdateSession';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';

export default function Summary() {
    const { data: climbingSession, isLoading, isError } = useFetchSession();
    const { mutate: updateSession, isPending } = useUpdateSession();
    const navigation = useNavigation();
    const [sessionName, setSessionName] = useState<string>('');
    const [intensity, setIntensity] = useState<number>(5);
    const [notes, setNotes] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const boulderClimbs = climbingSession?.climbs?.filter(climb => climb.type === 'Boulder' && climb.send === true) || [];
    const routeClimbs = climbingSession?.climbs?.filter(climb => climb.type === 'Top Rope' && climb.send === true || climb.type === 'Lead' && climb.send === true) || [];

    if (isLoading) return <ActivityIndicator />;
    if (isError) return <Text>Error loading session summary</Text>;

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="checkmark" size={24} color={'#89DE43'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, sessionName, intensity, notes]);

    function formatDate(dateString?: string) {
        if (!dateString) return "Date not available";
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    function submitSessionUpdate() {
        updateSession(
            {
                sessionName,
                intensity,
                notes,
                completed: true,
            },
            {
                onSuccess: () => {
                    Toast.show({
                        type: "success",
                        text1: "Session Completed!",
                    });
                    router.push('/(auth)/history');
                },
                onError: () => {
                    Toast.show({
                        type: "error",
                        text1: "Session Failed to Save",
                    });
                },
            }
        );
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={isSubmitting}
                textContent="Saving Session..."
                textStyle={{ color: '#fff' }}
                overlayColor="rgba(0, 0, 0, 0.7)"
            />
            <Text style={styles.sessionLabel}>Session Name</Text>
            <TextInput
                style={styles.sessionTextInput}
                placeholder="Enter session name"
                placeholderTextColor='#888'
                value={sessionName}
                onChangeText={setSessionName}
            />

            <Text style={styles.date}>{formatDate(climbingSession?.session?.createdAt)}</Text>

            {/* Intensity Slider */}
            <Text style={styles.label}>How did it feel?</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={intensity}
                onValueChange={(value: number) => setIntensity(value)}
                minimumTrackTintColor="#DE4372"
                maximumTrackTintColor="#DE4372"
            />
            <Text style={styles.intensity}>Selected Intensity: {intensity}</Text>

            {/* Notes Field */}
            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Add notes..."
                value={notes}
                onChangeText={setNotes}
                multiline
                blurOnSubmit={true}
            />

            {/* Boulders Section */}
            <Text style={styles.label}>Boulder Sends</Text>
            {boulderClimbs.length ? (
                <FlatList
                    data={boulderClimbs}
                    keyExtractor={(climb) => climb.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.horizontalCard}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}>Style: {item.style}</Text>
                            <Text style={styles.cardText}>Grade: <Text style={styles.boulderGradeText}>{item.grade}</Text></Text>
                        </View>
                        
                    )}
                    
                    contentContainerStyle={styles.horizontalCardContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <Text>No Boulder climbs available</Text>
            )}

            {/* Routes Section */}
            <Text style={styles.label}>Route Sends</Text>
            {routeClimbs.length ? (
                <FlatList
                    data={routeClimbs}
                    keyExtractor={(climb) => climb.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.horizontalCard}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}>Style: {item.style}</Text>
                            <Text style={styles.cardText}>Grade: <Text style={styles.routeGradeText}>{item.grade}</Text></Text>
                        </View>
                    )}
                    contentContainerStyle={styles.horizontalCardContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <Text>No Routes available</Text>
            )}

            {/* Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Publish Climbing Session?</Text>
                        <Text style={styles.modalSubText}>Climbs cannot be changed once published.</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    submitSessionUpdate();
                                }}
                            >
                                {isPending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit</Text>
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
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    sessionLabel: {
        textAlign: 'center',
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginVertical: 2,
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    intensity: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
        fontWeight: '500',
    },
    textInput: {
        height: 75,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginBottom: 20,
        backgroundColor: "#fff"
    },
    sessionTextInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 18,
        marginVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        textAlign: 'center',
        backgroundColor: '#fff'
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
        backgroundColor: '#6c47ff',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    cardContainer: {
        paddingVertical: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    boulderGradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
        color: "#6c47ff",
    },
    routeGradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
        color: '#DE8A43',
    },
    horizontalCardContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    horizontalCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        width: 200,
        height: 100,
    },
});
