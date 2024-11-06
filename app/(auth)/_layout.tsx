import { useFetchApiMessage } from "@/lib/state/serverState/test";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { Pressable } from "react-native";

export function LogoutButton() {
    const { signOut } = useAuth();

    function doLogout() {
        signOut();
    }

    return (
        <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
            <Ionicons name="log-out-outline" size={24} color={'#fff'} />
        </Pressable>
    );
};

export default function TabsPage() {
    const { isSignedIn } = useAuth();

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#6c47ff',
                },
                headerTintColor: '#fff',
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    headerTitle: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                    tabBarLabel: 'Home',
                }}
                redirect={!isSignedIn}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                    tabBarLabel: 'My Profile',
                    headerRight: () => <LogoutButton />,
                }}
                redirect={!isSignedIn}
            />
        </Tabs>
    );
}
