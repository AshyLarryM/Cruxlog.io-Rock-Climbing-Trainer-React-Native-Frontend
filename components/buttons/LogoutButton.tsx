import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";

export function LogoutButton() {
    const { signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    async function doLogout() {
        setIsLoading(true);
        try {
            await signOut();
            // Toast.show({
            //     type: 'success',
            //     text1: 'Signed Out',
            //     text2: 'You have been signed out successfully!',
            // });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to sign out. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
            <Spinner visible={isLoading} textContent={"Signing Out..."} textStyle={{ color: "#fff" }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#fff', marginRight: 6, fontSize: 12 }}>Logout</Text>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
            </View>
        </Pressable>
    );
};