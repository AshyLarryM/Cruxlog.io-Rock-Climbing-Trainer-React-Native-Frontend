import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";

export function LogoutButton() {
    const { signOut } = useAuth();

    function doLogout() {
        signOut();
    }

    return (
        <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#fff', marginRight: 6, fontSize: 12 }}>Logout</Text>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
            </View>
        </Pressable>
    );
};