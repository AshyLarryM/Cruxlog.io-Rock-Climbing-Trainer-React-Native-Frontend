import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export function FinishSessionButton() {
    const router = useRouter();
    function reviewSession() {
        router.push('/(auth)/session/summary')
    }
    return (
        <Pressable onPress={reviewSession} style={{ marginRight: 10 }}>
            <Ionicons name="checkmark" size={24} color={'#fff'} />
        </Pressable>
    )
}

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
                    headerRight: () => <FinishSessionButton />
                }}
            />
            <Stack.Screen
                name="newclimb"
                options={{
                    title: "New Climb",
                }}
            />
            <Stack.Screen
                name="summary"
                options={{
                    title: "Summary",
                }}
            />
        </Stack>
    );
}
