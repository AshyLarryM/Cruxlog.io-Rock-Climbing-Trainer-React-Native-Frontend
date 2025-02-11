import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useFetchSession } from '@/lib/state/serverState/user/session/useFetchSession';
import { useFocusEffect } from '@react-navigation/native';
import { Climb } from '@/lib/utils/models/climbModels';
import { ClimbCard } from '@/components/cards/ClimbCard';


export default function Session() {
    const climbingSession = useFetchSession();

    useFocusEffect(
        React.useCallback(() => {
            climbingSession.refetch();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Link href='/(auth)/session/newclimb' asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonClimbText}>New Climb</Text>
                </TouchableOpacity>
            </Link>
            
                {climbingSession.isLoading || climbingSession.isFetching ? (
                    <View><Text style={styles.statusText}>Fetching Previous Session...</Text><ActivityIndicator size={'large'} /></View>
                ) : climbingSession.isError ? (
                    <Text>Error loading climbs</Text>
                ) : climbingSession.data?.climbs?.length ? (
                    <FlatList
                        data={climbingSession.data.climbs}
                        renderItem={({ item }) => <ClimbCard climb={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.climbList}
                    />
                ) : (
                    <Text style={styles.statusText}>No climbs added yet. Start by adding a new climb!</Text>
                )}
            
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginBottom: 16,
        alignSelf: 'center',
    },
    buttonClimbText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    climbList: {
        width: '100%',
        paddingHorizontal: 24,
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
    attemptsButton: {
        fontSize: 20,
        color: '#333',
        paddingHorizontal: 8,
    },
    attemptsCount: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },
    deleteButton: {
        color: 'red',
        fontSize: 20,
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
    statusText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 8,
        padding: 20,
    }
});
