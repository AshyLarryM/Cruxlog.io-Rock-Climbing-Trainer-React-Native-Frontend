import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LogoutButton } from './_layout'
import { useMeUser } from '@/lib/state/serverState/user/useMeUser'
import { useAuth } from '@clerk/clerk-expo';

export default function Profile() {

    const { userId } = useAuth();
    const { data, error, isLoading } = useMeUser(userId);
    
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error loading profile data.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email: {data?.user?.email || 'No email provided'}</Text>
            <Text style={styles.label}>Full Name: {data?.user?.fullName || 'No full name provided'}</Text>
            <Text style={styles.label}>Age: {data?.user?.age || 'No age provided'}</Text>
            <Text style={styles.label}>Height: {data?.user?.height || 'No Height Provided'}</Text>
            <Text style={styles.label}>Weight: {data?.user?.weight || 'No Weight Provided'}</Text>
            <Text style={styles.label}>Ape Index: {data?.user?.apeIndex || 'No Ape Index Provided'}</Text>
            <Text style={styles.label}>
                Grading Preference: {data?.user?.gradingPreference ? 'French' : 'YDS/V Scale'}
            </Text>
            <Text style={styles.label}>
                Measurement System: {data?.user?.measurementSystem ? 'Metric' : 'Imperial'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 16,
    }
});