import { useSignIn } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { useState } from "react";
import { Button, Pressable, StyleSheet, TextInput, View, Text } from "react-native";

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
        <View style={styles.container}>
            <Text style={styles.pageHeader}>Reset Password </Text>
            <Text style={styles.headerDetails}>Enter your email address to reset password</Text>
            <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

            {!successfulCreation && (
                <>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput autoCapitalize="none" placeholder="youremail@email.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} placeholderTextColor={'#888'} />
                    <Pressable style={styles.resetButton} onPress={onRequestReset}><Text style={styles.resetButtonText}>Send Reset Email</Text></Pressable>
                </>
            )}

            {successfulCreation && (
                <>
                    <View>
                        <TextInput value={code} placeholder="Code..." style={styles.inputField} onChangeText={setCode} />
                        <TextInput placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
                    </View>
                    <Pressable style={styles.resetButton} onPress={onReset}>
                        <Text>Reset Password</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    inputField: {
        marginVertical: 4,
        height: 50,
        borderWidth: 2,
        borderColor: '#6c47ff',
        borderRadius: 12,
        padding: 10,
        backgroundColor: '#fff',
    },
    resetButton: {
        margin: 8,
        alignItems: 'center',
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6347ff'
    },
    resetButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
        fontWeight: '500',
    },
    pageHeader: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#6c47ff',
    },
    headerDetails: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 24,
        color: '#000',
    },
});
