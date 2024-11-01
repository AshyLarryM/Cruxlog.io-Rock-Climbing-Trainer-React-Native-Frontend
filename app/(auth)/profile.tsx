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
            <Text style={styles.header}>Profile</Text>
            <Text style={styles.label}>Email: {data?.user?.email || 'No email provided'}</Text>
            <Text style={styles.label}>Full Name: {data?.user?.fullName || 'No full name provided'}</Text>
            <LogoutButton />
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
    label: {
        fontSize: 18,
        marginBottom: 5,
    }
});