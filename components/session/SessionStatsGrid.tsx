import { SessionStats } from "@/lib/utils/models/sessionModels";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

interface SessionStatsGridProps {
    sessionStats?: SessionStats;
}

export function SessionStatsGrid({ sessionStats }: SessionStatsGridProps) {
    const totalSends = sessionStats?.totalSends;
    const totalAttempts = sessionStats?.totalAttempts;
    const highestBoulderGrade = sessionStats?.highestBoulderGrade || null;
    const highestRouteGrade = sessionStats?.highestRouteGrade || null;
    const totalFlashes = sessionStats?.totalFlashes;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                
                <View style={styles.gridItem}>
                    <Text style={styles.gridValue}>
                        {totalSends}/{totalAttempts}
                    </Text>
                    <Text style={styles.gridLabel}>Sends/Attempts</Text>
                </View>

                {/* Flashes */}
                <View style={styles.gridItem}>
                    <Text style={styles.gridValue}>{totalFlashes}</Text>
                    <Text style={styles.gridLabel}>
                        Flashes
                        <View style={styles.flashContainer}>
                            <Ionicons name="flash" size={20} color="#ffcc00" />
                        </View>
                    </Text>
                </View>

                {highestBoulderGrade && (
                    <View style={styles.gridItem}>
                        <Text style={styles.gridValue}>{highestBoulderGrade}</Text>
                        <Text style={styles.gridLabel}>Hardest Boulder</Text>
                    </View>
                )}
                {highestRouteGrade && (
                    <View style={styles.gridItem}>
                        <Text style={styles.gridValue}>{highestRouteGrade}</Text>
                        <Text style={styles.gridLabel}>Hardest Route</Text>
                    </View>
                )}

                {!highestBoulderGrade && !highestRouteGrade && (
                    <View style={[styles.gridItem, styles.fullWidth]}>
                        <Text style={styles.gridValue}>N/A</Text>
                        <Text style={styles.gridLabel}>No Grade Recorded</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        borderRadius: 20,
        overflow: "hidden",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    gridItem: {
        flexBasis: "50%",
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.2,
        borderColor: "#ddd",
    },
    fullWidth: {
        flexBasis: "100%",
    },
    gridValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#6c47ff",
        marginBottom: 5,
    },
    gridLabel: {
        fontSize: 14,
        color: "#888",
    },
    flashContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
    },
});
