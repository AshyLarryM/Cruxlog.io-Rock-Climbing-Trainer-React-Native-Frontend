import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFetchClimbsBySession } from '@/lib/state/serverState/user/session/useFetchClimbsBySession';

export default function SessionDetails() {
    const { sessionId } = useLocalSearchParams();

    const { data, isLoading, error } = useFetchClimbsBySession((Number(sessionId)))

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error loading session climbs</Text>;

    console.log(`climb data for sessionId: ${sessionId}`, data?.climbs);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Session Details</Text>
            <Text>Session ID: {sessionId}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
