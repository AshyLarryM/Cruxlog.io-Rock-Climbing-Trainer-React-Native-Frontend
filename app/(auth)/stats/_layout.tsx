import React from 'react'
import { Stack } from 'expo-router'

export default function StatsLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#6c47ff',
                },
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Stats",
                }}
            />
        </Stack>
    )
}