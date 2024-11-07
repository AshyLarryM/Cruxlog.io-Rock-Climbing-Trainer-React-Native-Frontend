import { Stack } from "expo-router";

export default function SessionLayout() {
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
                    title: "Session",
                }}
            />
            <Stack.Screen
                name="newclimb"
                options={{
                    title: "New Climb",
                }}
            />
        </Stack>
    );
}
