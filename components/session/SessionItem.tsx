import React, { useState } from "react";
import { Session } from "@/lib/utils/models/sessionModels";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";

interface SessionItemProps {
    session: Session;
}

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function SessionItem({ session }: SessionItemProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    function navigateToSession() {
        router.push({
            pathname: "/(auth)/history/[sessionId]",
            params: {
                sessionId: session.id.toString(),
                sessionName: session.sessionName || "Unnamed Session",
            },
        });
    }

    function toggleMoreStats() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded((prev) => !prev);
    }

    return (
        <TouchableOpacity onPress={navigateToSession}>
            <View style={styles.sessionContainer}>
                <Text style={styles.sessionName}>{session.sessionName || "Unnamed Session"}</Text>
                <Text style={styles.sessionDate}>
                    {new Date(session.createdAt).toLocaleDateString()}
                </Text>
                <View style={styles.intensityContainer}>
                    <View style={styles.separator} />
                    <Text>Intensity: {session.intensity}</Text>
                </View>

                {/* Highlights Container */}
                <View style={styles.highlightsContainer}>
                    {session.sessionStats.highestBoulderGrade !== null && (
                        <View style={styles.column}>
                            <Text style={styles.highlightHeader}>Hardest Boulder</Text>
                            <Text style={styles.hardestBoulderText}>
                                {session.sessionStats.highestBoulderGrade}
                            </Text>
                        </View>
                    )}
                    {session.sessionStats.highestBoulderGrade !== null &&
                        session.sessionStats.highestRouteGrade !== null && (
                            <Text style={styles.verticalSeparator}>|</Text>
                        )}

                    {session.sessionStats.highestRouteGrade !== null && (
                        <View style={styles.column}>
                            <Text style={styles.highlightHeader}>Hardest Route</Text>
                            <Text style={styles.hardestRouteText}>
                                {session.sessionStats.highestRouteGrade}
                            </Text>
                        </View>
                    )}

                    {(session.sessionStats.highestBoulderGrade !== null ||
                        session.sessionStats.highestRouteGrade !== null) && (
                            <View style={styles.verticalSeparator} />
                        )}

                    <View style={styles.column}>
                        <Text style={styles.highlightHeader}>Session Send Stats</Text>
                        <View>
                            <Text style={styles.highlightsText}>
                                Total: {session.sessionStats.totalSends || "0"}
                            </Text>
                            <Text style={styles.highlightsText}>
                                Flash: {session.sessionStats.totalFlashes || "0"}{" "}
                                <Ionicons name="flash" size={20} color="#ffcc00" />
                            </Text>
                        </View>
                    </View>
                </View>

                {/* More Button */}
                <TouchableOpacity onPress={toggleMoreStats} style={styles.moreButton}>
                    <Text style={styles.moreText}>
                        {isExpanded ? <Ionicons name="chevron-up" size={16} /> : <Ionicons name="chevron-down" size={16} />}
                    </Text>
                </TouchableOpacity>

                {/* Conditional Stats Section */}
                {isExpanded && (
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
                        {session.sessionStats.completedBoulders > 0 && (
                            <Text>Completed Boulders: {session.sessionStats.completedBoulders}</Text>
                        )}
                        {session.sessionStats.completedRoutes > 0 && (
                            <Text>Completed Routes: {session.sessionStats.completedRoutes}</Text>
                        )}
                        <Text>Total Sends: {session.sessionStats.totalSends}</Text>
                        <Text>Total Flashes: {session.sessionStats.totalFlashes}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    sessionContainer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sessionName: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    sessionDate: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        textAlign: "center",
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        width: "100%",
    },
    verticalSeparator: {
        width: 1,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
        alignSelf: "stretch",
    },
    intensityContainer: {
        padding: 8,
    },
    statsContainer: {
        marginTop: 12,
    },
    hardestBoulderText: {
        paddingTop: 4,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 28,
        color: "#6c47ff",
    },
    hardestRouteText: {
        paddingTop: 4,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 28,
        color: "#DE8A43",
    },
    statsHeader: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    highlightsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        width: "100%",
        shadowColor: "#000",
    },
    highlightsText: {
        textAlign: "left",
        fontWeight: "600",
        paddingTop: 2,
    },
    column: {
        flex: 1,
        alignItems: "center",
        padding: 8,
    },
    highlightHeader: {
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    moreButton: {
        marginTop: 12,
        alignSelf: "center",
        padding: 8,
        backgroundColor: "#ebebeb",
        borderRadius: 20
    },
    moreText: {
        fontSize: 16,
        color: "#6c47ff",
    },
});
