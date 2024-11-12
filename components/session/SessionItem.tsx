import { Session } from "@/lib/utils/models/sessionModels";
import { useRouter } from "expo-router";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface SessionItemProps {
    session: Session;
}

export function SessionItem({ session }: SessionItemProps) {
    const router = useRouter();

    function navigateToSession() {
        router.push({
            pathname: '/(auth)/history/[sessionId]',
            params: { sessionId: session.id.toString() },
        });
    };

    return (
        <TouchableOpacity onPress={navigateToSession}>
            <View style={styles.sessionContainer}>
                <Text style={styles.sessionName}>{session.sessionName || 'Unnamed Session'}</Text>
                <Text style={styles.sessionDate}>
                    {new Date(session.createdAt).toLocaleDateString()}
                </Text>
                <Text>Intensity: {session.intensity}</Text>
                <Text>Notes: {session.notes || 'No notes provided.'}</Text>

                <View style={styles.statsContainer}>
                    <Text style={styles.statsHeader}>Session Stats:</Text>
                    {session.sessionStats.highestBoulderGrade !== null && (
                        <Text>Highest Boulder Grade: {session.sessionStats.highestBoulderGrade}</Text>
                    )}

                    {session.sessionStats.highestRouteGrade !== null && (
                        <Text>Highest Route Grade: {session.sessionStats.highestRouteGrade}</Text>
                    )}
                    <Text>Total Climbs: {session.sessionStats.totalClimbs}</Text>
                    <Text>Total Attempts: {session.sessionStats.totalAttempts}</Text>
                    <Text>Completed Boulders: {session.sessionStats.completedBoulders}</Text>
                    <Text>Completed Routes: {session.sessionStats.completedRoutes}</Text>
                    <Text>Total Sends: {session.sessionStats.totalSends}</Text>
                    <Text>Total Flashes: {session.sessionStats.totalFlashes}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
})
