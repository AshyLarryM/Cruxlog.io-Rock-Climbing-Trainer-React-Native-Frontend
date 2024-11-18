import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFetchAllSessions } from '@/lib/state/serverState/user/session/useFetchAllSessions';
import { SessionItem } from '@/components/session/SessionItem';
import { useFocusEffect } from 'expo-router';


export default function History() {
    const { data, error, isFetching, isLoading, refetch } = useFetchAllSessions();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useFocusEffect(
        React.useCallback(() => {
            console.log("refresh history");
            refetch();
        }, [refetch]) // TODO: May trigger too many api calls?
    );

    async function onRefresh() {
        setRefreshing(true),
        await refetch();
        setRefreshing(false);
    }

    if (isLoading || isFetching && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
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
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
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
