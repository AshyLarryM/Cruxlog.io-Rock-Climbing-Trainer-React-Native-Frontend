import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export function ReviewSessionButton() {
    const router = useRouter();
    function reviewSession() {
        router.push('/(auth)/session/summary')
    }
    return (
        <Pressable onPress={reviewSession} style={{ marginRight: 10 }}>
            <View style={styles.iconBackground}>
                <Ionicons name="checkmark" size={24} color={'#fff'} />
            </View>
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
                    headerRight: () => <ReviewSessionButton />
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
                    title: "Session Summary",
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    iconBackground: {
        backgroundColor: "#7f5eff",
        borderRadius: 10,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
});