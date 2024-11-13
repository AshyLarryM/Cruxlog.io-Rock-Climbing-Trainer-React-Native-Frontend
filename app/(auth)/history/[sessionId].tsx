import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFetchClimbsBySession } from '@/lib/state/serverState/user/session/useFetchClimbsBySession';
import { ClimbCard } from '@/components/cards/ClimbCard';

export default function SessionDetails() {
    const { sessionId, sessionName } = useLocalSearchParams();
    const { data, isLoading, error } = useFetchClimbsBySession(Number(sessionId));
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: sessionName || `Session ${sessionId} Details`,
        });
    }, [navigation, sessionName, sessionId]);

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error loading session climbs</Text>;

    return (
        <View style={styles.container}>
            {data?.climbs?.length ? (
                <FlatList
                    data={data.climbs}
                    renderItem={({ item }) => <ClimbCard climb={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.climbList}
                />
            ) : (
                <Text>No climbs for this session yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    climbList: {
        width: '100%',
        paddingHorizontal: 16,
    },
});
