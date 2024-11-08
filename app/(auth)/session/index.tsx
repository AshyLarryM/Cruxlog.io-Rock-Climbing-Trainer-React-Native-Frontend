import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Climb } from '@/lib/utils/types';


export default function Session() {
    const [climbs, setClimbs] = useState([]);

    useEffect(() => {
        async function loadClimbs() {
            try {
                const storedClimbs = await AsyncStorage.getItem('climbs');
                const parsedClimbs = storedClimbs ? JSON.parse(storedClimbs) : [];
                setClimbs(parsedClimbs);
            } catch (error) {
                console.error("Error loading climbs:", error);
            }
        }
        loadClimbs();
    }, [climbs]);

    async function sendClimbsToAPI() {
        try {
            const storedClimbs = await AsyncStorage.getItem('climbs');
            const parsedClimbs = storedClimbs ? JSON.parse(storedClimbs) : [];
    
            // validate climbs
            const validClimbs: Climb[] = parsedClimbs.map((climb: Climb) => ({
                id: climb.id,
                name: climb.name,
                sessionId: climb.sessionId,
                type: climb.type,
                style: climb.style,
                grade: climb.grade,
                attempts: climb.attempts,
            }));
    
            console.log('Climbs sent successfully');
            console.log('valid climbs: ', validClimbs)
        } catch (error) {
            console.error("Error sending climbs to API:", error);
        }
    }

    async function clearStorage() {
        try {
            await AsyncStorage.clear();
            console.log("Device storage cleared.");
        } catch (error) {
            console.error("Error clearing device storage:", error);
        }
    }

    // Render each climb as a card
    const renderClimb = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>Name: {item.climbName || 'Unnamed'}</Text>
            <Text style={styles.cardText}>Type: {item.type}</Text>
            <Text style={styles.cardText}>Style: {item.style}</Text>
            <Text style={styles.cardText}>Grade: {item.grade}</Text>
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

            <FlatList
                data={climbs}
                renderItem={renderClimb}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.climbList}
            />

            <TouchableOpacity onPress={clearStorage} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear Storage</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={sendClimbsToAPI} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Send Climbs to API</Text>
            </TouchableOpacity>
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
        fontSize: 14,
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
});
