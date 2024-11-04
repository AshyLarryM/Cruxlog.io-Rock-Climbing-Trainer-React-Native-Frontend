import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import React, { useState } from 'react';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function EditProfile() {
    const { userId } = useAuth();
    const { data } = useMeUser(userId);

    const [fullName, setFullName] = useState(data?.user?.fullName || '');
    const [age, setAge] = useState(data?.user?.age || null);
    const [height, setHeight] = useState(data?.user?.height || null);
    const [weight, setWeight] = useState(data?.user?.weight || null);
    const [apeIndex, setApeIndex] = useState(data?.user?.apeIndex || null);
    const [gradingPreference, setGradingPreference] = useState(data?.user?.gradingPreference || false);
    const [measurementSystem, setMeasurementSystem] = useState(data?.user?.measurementSystem || false);

    async function handleSave() {
        // // Replace with your API call to save the updated profile data
        // try {
        //     await updateUserProfile({
        //         userId,
        //         fullName,
        //         age,
        //         height,
        //         weight,
        //         apeIndex,
        //         gradingPreference,
        //         measurementSystem
        //     });
        //     router.back();
        // } catch (error) {
        //     console.error('Failed to update profile:', error);
        // }
    }

    return (
        <View style={styles.container}>
            <Text>Edit Profile</Text>

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
                value={age !== null ? age.toString() : ''}
                onChangeText={(text) => setAge(text ? Number(text) : null)}
            />

            <TextInput
                style={styles.input}
                placeholder="Height"
                keyboardType="numeric"
                value={height !== null ? height.toString() : ''}
                onChangeText={(text) => setHeight(text ? Number(text) : null)}
            />

            <TextInput
                style={styles.input}
                placeholder="Weight"
                keyboardType="numeric"
                value={weight !== null ? weight.toString() : ''}
                onChangeText={(text) => setWeight(text ? Number(text) : null)}
            />

            <TextInput
                style={styles.input}
                placeholder="Ape Index"
                keyboardType="numeric"
                value={apeIndex !== null ? apeIndex.toString() : ''}
                onChangeText={(text) => setApeIndex(text ? Number(text) : null)}
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

            <Button title="Save" onPress={handleSave} />
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
});
