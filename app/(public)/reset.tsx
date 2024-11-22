import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, TextInput, View, Text, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get('window');

export default function Reset() {
    const [emailAddress, setEmailAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [successfulCreation, setSuccessfulCreation] = useState<boolean>(false);
    const { signIn, setActive } = useSignIn();

    const onRequestReset = async () => {
        try {
            await signIn!.create({
                strategy: 'reset_password_email_code',
                identifier: emailAddress,
            });
            setSuccessfulCreation(true);
        } catch (err: any) {
            alert(err.errors[0].message);
        }
    };

    const onReset = async () => {
        try {
            const result = await signIn!.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            });
            console.log(result);
            alert('Password reset successfully');

            await setActive!({ session: result.createdSessionId });
        } catch (err: any) {
            alert(err.errors[0].message);
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={110}
            enableAutomaticScroll={true}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('@/assets/images/cruxlogIcon.png')} style={styles.logo} />
                    <Text style={styles.pageHeader}>Reset Password </Text>
                    <Text style={styles.headerDetails}>Enter your email address to reset password.</Text>
                </View>
                <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

                {!successfulCreation && (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                autoCapitalize="none"
                                placeholder="Email"
                                value={emailAddress}
                                onChangeText={setEmailAddress}
                                style={styles.inputFieldWithIcon}
                                placeholderTextColor="#888"
                            />
                            <Ionicons name="mail-outline" size={22} color="#ccc" style={styles.iconRight} />
                        </View>
                        <Pressable style={styles.resetButton} onPress={onRequestReset}><Text style={styles.resetButtonText}>Send Reset Email</Text></Pressable>
                    </>
                )}

                {successfulCreation && (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput value={code} placeholder="Code..." style={styles.inputFieldWithIcon} onChangeText={setCode} />

                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputFieldWithIcon} />
                            <Ionicons name="lock-closed-outline" size={22} color="#ccc" style={styles.iconRight} />
                        </View>
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={styles.resetButtonText}>Reset Password</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        marginTop: 24,
        padding: 20,
        justifyContent: 'flex-start',
    },
    logo: {
        width: width * 0.3,
        height: width * 0.3,
        resizeMode: 'contain',
    },
    inputField: {
        marginVertical: 10,
        height: 44,
        borderWidth: 1.5,
        borderColor: '#6c47ff',
        borderRadius: 24,
        padding: 10,
        backgroundColor: '#fff',
        fontSize: 14,
        paddingLeft: 10,
    },
    resetButton: {
        marginVertical: 16,
        alignItems: 'center',
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        borderRadius: 30,
    },
    resetButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
        marginBottom: 0,
        color: '#333',
    },
    pageHeader: {
        fontSize: 36,
        textAlign: 'center',
        fontWeight: '400',
        color: '#6c47ff',
        marginVertical: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 1,
    },
    headerDetails: {
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 16,
        color: '#6c47ff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#6c47ff',
        borderRadius: 24,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    iconRight: {
        paddingRight: 10,
    },
    inputFieldWithIcon: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingLeft: 10,
    },
});
