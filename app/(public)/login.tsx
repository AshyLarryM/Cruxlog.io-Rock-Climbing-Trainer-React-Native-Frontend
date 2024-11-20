import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image } from 'react-native';
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
            <Image source={require('@/assets/images/cruxlogIcon.png')} style={styles.logo} />
            <Text style={styles.pageHeader}>Sign in to your account </Text>
            <Text style={styles.headerDetails}>Sign in to log your climbing sessions.</Text>

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

            <Pressable onPress={loading ? null : onSigninPress} style={styles.loginButton}>
                {loading ? (
                    <Text style={styles.loginButtonText}>Loggin in...</Text>
                ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                )}
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
    logo: {
        alignSelf: 'center',
        marginBottom: 16,
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    inputField: {
        marginVertical: 8,
        height: 50,
        borderWidth: 2,
        borderColor: '#6c47ff',
        borderRadius: 12,
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
        fontWeight: '500',
        marginTop: 8,
    },
    pageHeader: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
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
