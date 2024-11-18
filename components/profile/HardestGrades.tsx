import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface HardestGradesGridProps {
    userPr?: {
        userHardestGrades: {
            boulder?: {
                grade: string;
            };
            route?: {
                grade: string;
            };
        };
    };
}


export default function HardestGrades({ userPr }: HardestGradesGridProps) {
    return (
        <View style={styles.gridContainer}>
            <View style={styles.column}>
                <Text style={styles.gridHeader}>Hardest Boulder</Text>
                <Text style={styles.gridBoulderText}>
                    {userPr?.userHardestGrades?.boulder?.grade || 'N/A'}
                </Text>
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.column}>
                <Text style={styles.gridHeader}>Hardest Route</Text>
                <Text style={styles.gridRouteText}>
                    {userPr?.userHardestGrades?.route?.grade || 'N/A'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    column: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    gridHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    gridBoulderText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6c47ff',
    },
    gridRouteText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#DE8A43',
    },
    verticalSeparator: {
        width: 1,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
        alignSelf: "stretch",
    },
});