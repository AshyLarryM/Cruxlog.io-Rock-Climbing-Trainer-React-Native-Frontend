import { TextInput, View, StyleSheet, Pressable, Text } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';
import { Stack } from 'expo-router';
import { useCreateUser } from '@/lib/state/serverState/user/useCreateUser';

export default function Register() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const createUser = useCreateUser();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [pendingVerification, setPendingVerification] = useState<boolean>(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    async function onSignUpPress() {
        if (!isLoaded) {
            return;
        }
        setLoading(true);
        try {
            await signUp.create({
                emailAddress,
                password,
            });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            alert(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    }

    async function onPressVerifiy() {
        if (!isLoaded) {
            return;
        }
        setLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });

            if (!completeSignUp.createdUserId) {
                throw new Error("User id from clerk is undefined");
            }

            createUser.mutate({
                userId: completeSignUp.createdUserId,
                email: emailAddress,
            });
            
        } catch (err: any) {
            alert(err.errors[0].message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
            <Spinner visible={loading} />
            {!pendingVerification && (
                <>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        autoCapitalize='none'
                        placeholder='placeholder@gmail.com'
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        style={styles.inputField}
                        placeholderTextColor="#888"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder='password'
                        value={password}
                        onChangeText={setPassword}
                        style={styles.inputField}
                        placeholderTextColor="#888"
                    />

                    <Pressable onPress={onSignUpPress} style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </Pressable>
                </>
            )}

            {pendingVerification && (
                <>
                    <View>
                        <Text style={styles.label}>Verification Code</Text>
                        <TextInput value={code} placeholder='Code...' style={styles.inputField} onChangeText={setCode} placeholderTextColor={'#888'} />
                    </View>
                    <Pressable onPress={onPressVerifiy} style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Verify Email</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    inputField: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderColor: '#6c47ff',
        borderRadius: 12,
        padding: 10,
        backgroundColor: '#fff',
    },
    registerButton: {
        margin: 8,
        alignItems: 'center',
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6347ff'
    },
    registerButtonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        marginBottom: 1,
        color: '#333',
        fontWeight: '500',
        marginTop: 8,
    },
});