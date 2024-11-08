import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Climb } from '@/lib/utils/types';
import { Ionicons } from '@expo/vector-icons';
import { useFetchSession } from '@/lib/state/serverState/user/session/useFetchSession';


export default function Session() {
    const router = useRouter();
    const [climbs, setClimbs] = useState<Climb[]>([]);

    const climbingSession = useFetchSession();

    console.log("Climbing session: ", climbingSession.data?.climbs)
    


    // Render each climb as a card
    const renderClimb = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{item.name|| 'Unnamed'}</Text>
            <Text style={styles.cardText}>{item.type}</Text>
            <Text style={styles.cardText}>{item.style}</Text>
            <Text style={styles.cardText}>{item.grade}</Text>
            <Text style={styles.cardText}>Attempts: {item.attempts}</Text>
            
        </View>
    );

    return (
        <View style={styles.container}>
            <Link href='/(auth)/session/newclimb' asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonClimbText}>New Climb</Text>
                </TouchableOpacity>
            </Link>

            {climbingSession.isLoading ? (
                <ActivityIndicator />
            ) : climbingSession.isError ? (
                <Text>Error loading climbs</Text>
            ) : climbingSession.data?.climbs?.length ? (
                <FlatList
                    data={climbingSession.data.climbs}
                    renderItem={renderClimb}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.climbList}
                />
            ) : (
                <Text>No climbs added yet. Start by adding a new climb!</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonClimbText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    climbList: {
        width: '100%',
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#eee',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
    },
    cardText: {
        fontSize: 18,
        color: '#333',
    },
    clearButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    deleteButton: {
        padding: 8,
    },
});
