import { View, Text } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useFetchApiMessage } from '@/lib/state/serverState/test';

export default function Home() {
    const { user } = useUser();
    const { data, error, isLoading } = useFetchApiMessage();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {isLoading && <Text>Loading...</Text>}
            {error && <Text>Error: {error.message}</Text>}
            {!isLoading && !error && (
                <>
                    <Text>Welcome, {user?.emailAddresses[0]?.emailAddress}</Text>
                    <Text>Data: {data?.message}</Text>
                </>
            )}
        </View>
    );
}
