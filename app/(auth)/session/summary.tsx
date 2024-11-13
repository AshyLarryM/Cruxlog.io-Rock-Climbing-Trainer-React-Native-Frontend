import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Button, Pressable } from 'react-native';
import { useFetchSession } from '@/lib/state/serverState/user/session/useFetchSession';
import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { useUpdateSession } from '@/lib/state/serverState/user/session/useUpdateSession';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function Summary() {
    const { data: climbingSession, isLoading, isError } = useFetchSession();
    const { mutate: updateSession } = useUpdateSession();
    const navigation = useNavigation();
    const [sessionName, setSessionName] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [notes, setNotes] = useState('');

    if (isLoading) return <ActivityIndicator />;
    if (isError) return <Text>Error loading session summary</Text>;

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={submitSessionUpdate}>
                    <Ionicons name="checkmark" size={24} color={'#42f587'} />
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
                        text1: "Session Saved",
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
            <Text style={styles.label}>Session Name</Text>
            <TextInput
                style={styles.sessionTextInput}
                placeholder="Enter session name"
                placeholderTextColor='#888'
                value={sessionName}
                onChangeText={setSessionName}
            />

            <Text style={styles.date}>Date: {formatDate(climbingSession?.session?.createdAt)}</Text>

            {/* Intensity Slider */}
            <Text style={styles.label}>How did it feel?</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={intensity}
                onValueChange={(value: number) => setIntensity(value)}
                minimumTrackTintColor="#6c47ff"
                maximumTrackTintColor="#6c47ff"
            />
            <Text style={styles.intensity}>Selected Intensity: {intensity}</Text>

            {/* Notes Field */}
            <Text style={styles.label}>Add Notes</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Add notes..."
                value={notes}
                onChangeText={setNotes}
                multiline
                blurOnSubmit={true}
            />

            {/* List of Climbs */}
            {climbingSession?.climbs?.length ? (
                climbingSession.climbs.map((climb) => (
                    <Text key={climb.id?.toString()}>{climb.name} - Grade: {climb.grade}</Text>
                ))
            ) : (
                <Text>No climbs available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,

    },
    headerButton: {
        color: '#6c47ff',
        fontSize: 16,
        marginRight: 10,
    },
    date: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        marginVertical: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    intensity: {
        fontSize: 16,
        marginBottom: 20,
    },
    textInput: {
        height: 100,
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
});

