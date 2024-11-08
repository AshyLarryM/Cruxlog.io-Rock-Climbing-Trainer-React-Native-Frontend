import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Climb } from '@/lib/utils/types';
import { Ionicons } from '@expo/vector-icons';


export default function Session() {
    const router = useRouter();
    const [climbs, setClimbs] = useState<Climb[]>([]);

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
            console.log("stored climbs: ", storedClimbs);
            console.log("parsed Climbs: ", parsedClimbs);
    
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

    async function deleteClimb(climbId: string) {
        try {
            const updatedClimbs = climbs.filter(climb => climb.id !== climbId);
            setClimbs(updatedClimbs);
            await AsyncStorage.setItem('climbs', JSON.stringify(updatedClimbs));
            console.log(`Climb with id ${climbId} deleted!`);
        } catch (error) {
            console.error("Error deleting climb: ", error);
        }
    }

    // function editClimb(climb: Climb) {
    //     router.push({
    //         pathname: '/(auth)/session/newclimb',
    //         params: { climbData: JSON.stringify(climb)}
    //     })
    // }

    // Render each climb as a card
    const renderClimb = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{item.name|| 'Unnamed'}</Text>
            <Text style={styles.cardText}>{item.type}</Text>
            <Text style={styles.cardText}>{item.style}</Text>
            <Text style={styles.cardText}>{item.grade}</Text>
            <Text style={styles.cardText}>Attempts: {item.attempts}</Text>
            <TouchableOpacity onPress={() => deleteClimb(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-bin" size={24} color="red" />
            </TouchableOpacity>
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
