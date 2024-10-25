import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Text, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default function Login() {
    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function onSigninPress() {
        if (!isLoaded) {
            return;
        }
        setLoading(true);
        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });

            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            alert(err.errors[0].message)
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <Spinner visible={loading} />

            <Text style={styles.label}>Email Address</Text>
            <TextInput autoCapitalize='none'
                placeholder='example@gmail.com'
                placeholderTextColor={'#888'}
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={styles.inputField} />

            <Text style={styles.label}>Password</Text>
            <TextInput
                placeholder='password'
                placeholderTextColor={'#888'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputField}
            />

            <Pressable onPress={onSigninPress} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Link href={'/reset'} asChild>
                <Pressable style={styles.button}>
                    <Text>Forgot Password?</Text>
                </Pressable>
            </Link>

            <Link href={'/register'} asChild>
                <Pressable style={styles.button}>
                    <Text>Create Account</Text>
                </Pressable>

            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    inputField: {
        marginVertical: 8,
        height: 50,
        borderWidth: 1,
        borderColor: '#6c47ff',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
    button: {
        margin: 8,
        alignItems: 'center',
    },
    loginButton: {
        margin: 8,
        alignItems: 'center',
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6347ff'
    },
    loginButtonText: {
        color: "#fff",
        fontWeight: 'bold'
    },
    label: {
        fontSize: 16,
        marginBottom: 1,
        color: '#333',
    },
});
