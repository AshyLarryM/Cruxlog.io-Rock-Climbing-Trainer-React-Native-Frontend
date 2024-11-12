import React, { memo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFetchAllSessions } from '@/lib/state/serverState/user/session/useFetchAllSessions';
import { Climb } from '@/lib/utils/types';

export default function Home() {
    const { data, error, isLoading } = useFetchAllSessions();

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading sessions...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    if (!data?.sessions) {
        return (
            <View style={styles.center}>
                <Text>No sessions found.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data.sessions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SessionItem session={item} />}
            contentContainerStyle={styles.list}
        />
    );
}

function SessionItem({ session }: any) {
    return (
        <View style={styles.sessionContainer}>
            <Text style={styles.sessionName}>{session.sessionName || 'Unnamed Session'}</Text>
            <Text style={styles.sessionDate}>
                {new Date(session.createdAt).toLocaleDateString()}
            </Text>
            <Text>Intensity: {session.intensity}</Text>
            <Text>Notes: {session.notes || 'No notes provided.'}</Text>

            <View style={styles.statsContainer}>
                <Text style={styles.statsHeader}>Session Stats:</Text>
                <Text>Highest Boulder Grade: {session.sessionStats.highestBoulderGrade || 'N/A'}</Text>
                <Text>Highest Route Grade: {session.sessionStats.highestRouteGrade || 'N/A'}</Text>
                <Text>Total Climbs: {session.sessionStats.totalClimbs}</Text>
                <Text>Total Attempts: {session.sessionStats.totalAttempts}</Text>
                <Text>Completed Boulders: {session.sessionStats.completedBoulders}</Text>
                <Text>Completed Routes: {session.sessionStats.completedRoutes}</Text>
                <Text>Total Sends: {session.sessionStats.totalSends}</Text>
                <Text>Total Flashes: {session.sessionStats.totalFlashes}</Text>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        padding: 16,
    },
    sessionContainer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    sessionName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sessionDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    statsContainer: {
        marginTop: 12,
    },
    statsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    climbsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 4,
    },
    climbContainer: {
        paddingLeft: 8,
        marginBottom: 8,
    },
});
