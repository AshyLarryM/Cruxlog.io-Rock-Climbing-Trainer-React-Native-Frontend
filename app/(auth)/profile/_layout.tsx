import { LogoutButton } from "@/components/buttons/LogoutButton";
import { Stack } from "expo-router";

export default function ProfileLayout() {
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
                    title: "My Profile",
                    headerRight: () => <LogoutButton />,
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: "Edit Profile",
                }}
            />
        </Stack>
    );
}
