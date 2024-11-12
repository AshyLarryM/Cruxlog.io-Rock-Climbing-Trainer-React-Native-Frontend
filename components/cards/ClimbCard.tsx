import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Climb } from '@/lib/utils/models/climbModels';

interface ClimbCardProps {
    climb: Climb;
}

export function ClimbCard({ climb }: ClimbCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{climb.name || 'Unnamed'}</Text>
                <Text style={styles.title}>{climb.style || 'Unnamed'}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.gradeContainer}>
                    <Text style={styles.gradeText}>Grade: {climb.grade}</Text>
                </View>
                <View style={styles.attemptsContainer}>
                    <Text style={styles.attemptsLabel}>Attempts</Text>
                    <Text style={styles.attemptsCount}>{climb.attempts}</Text>
                </View>
            </View>

            {climb.attempts === 1 && climb.send && (
                <View style={styles.flashContainer}>
                    <Ionicons name="flash" size={20} color="#ffcc00" />
                    <Text style={styles.flashText}>Flash!</Text>
                </View>
            )}

            <View
                style={[
                    styles.footer,
                    { backgroundColor: climb.send ? "#ffcf4d" : '#fff' }
                ]}
            >
                <Text style={styles.sentStatus}>{climb.send ? 'Sent: Yes' : 'Sent: No'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        backgroundColor: '#6c47ff',
        paddingVertical: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 28,
    },
    gradeContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 4,
        borderRadius: 12,
    },
    gradeText: {
        color: '#4caf50',
        fontWeight: 'bold',
        fontSize: 18,
    },
    attemptsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    attemptsLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 8,
    },
    attemptsCount: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },
    footer: {
        backgroundColor: '#a5d6a7',
        paddingVertical: 10,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    sentStatus: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
    },
    flashContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 8,
    },
    flashText: {
        marginLeft: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
