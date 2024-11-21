import { Stack } from "expo-router";

export default function PublicLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#6c47ff"
                },
                headerTintColor: "#fff",
                headerBackTitle: "Back"
            }}>
            <Stack.Screen
                name="login"
                options={{
                    headerTitle: "CruxLog",
                }}>
            </Stack.Screen>
            <Stack.Screen
                name="register"
                options={{
                    headerTitle: "CruxLog",
                }}>
            </Stack.Screen>
            <Stack.Screen
                name="reset"
                options={{
                    headerTitle: "Reset Password",
                }}>
            </Stack.Screen>
        </Stack>
    )
}