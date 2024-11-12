import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function SessionDetails() {
    const { sessionId } = useLocalSearchParams();

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
