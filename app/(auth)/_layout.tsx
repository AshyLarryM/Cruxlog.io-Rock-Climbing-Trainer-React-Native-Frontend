import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, TouchableOpacity, StyleSheet, View, Text } from "react-native";



export default function TabsPage() {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    function toggleSessionModal() {
        setModalVisible(!isModalVisible);
    }

    function navigateToSession() {
        toggleSessionModal();
        router.push('/(auth)/session');
    }

    return (
        <>
            <Tabs
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#6c47ff',
                    },
                    tabBarActiveTintColor: '#6c47ff',
                    headerTintColor: '#fff',
                }}>
                <Tabs.Screen
                    name="history"
                    options={{
                        headerTitle: 'My Session History',
                        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                        tabBarLabel: 'History',
                        headerShown: false,
                    }}
                    redirect={!isSignedIn}
                />

                <Tabs.Screen
                    name="session"
                    listeners={{
                        tabPress: e => {
                            if (pathname === '/session') {
                                e.preventDefault();
                            } else {
                                e.preventDefault();
                                toggleSessionModal();
                            }
                        },
                    }}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="add-circle-outline" size={size} color={pathname === "/session" ? "#6c47ff" : color} />
                        ),
                        tabBarLabel: 'New Session',
                        headerShown: false,
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                        tabBarLabel: 'My Profile',
                        
                    }}
                    redirect={!isSignedIn}
                />
            </Tabs>
            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={toggleSessionModal}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={toggleSessionModal}>
                    <View style={styles.modalContent}>
                        <View style={styles.indicator} />
                        <TouchableOpacity style={styles.optionButton} onPress={navigateToSession}>
                            <Ionicons name="document-text-outline" size={24} color="black" />
                            <Text style={styles.optionText}>Start a Session</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    modalContent: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#6c47ff',
        alignSelf: 'center',
        borderRadius: 2,
        marginBottom: 15,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
    },
})