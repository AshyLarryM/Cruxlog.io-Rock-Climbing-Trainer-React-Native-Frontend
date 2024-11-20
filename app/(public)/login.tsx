import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, Text, Image, View, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('window');

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
            alert(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={150}
            enableAutomaticScroll={true}
        >
            <View style={styles.container}>
                <Spinner visible={loading} />
                <View style={styles.header}>
                    <Image source={require('@/assets/images/cruxlogIcon.png')} style={styles.logo} />
                    <Text style={styles.pageHeader}>Sign in to your account.</Text>
                    <Text style={styles.headerDetails}>Sign in to log your climbing sessions.</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        autoCapitalize="none"
                        placeholder="example@gmail.com"
                        placeholderTextColor="#888"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        style={styles.inputField}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder="password"
                        placeholderTextColor="#888"
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

                    <Link href="/reset" asChild>
                        <Pressable style={styles.button}>
                            <Text style={styles.linkText}>Forgot Password?</Text>
                        </Pressable>
                    </Link>

                    <Link href="/register" asChild>
                        <Pressable style={styles.button}>
                            <Text style={styles.linkText}>Create Account</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        marginTop: 24,
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.3,
        height: width * 0.3,
        resizeMode: 'contain',
    },
    pageHeader: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#6c47ff',
        marginTop: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 1,
    },
    headerDetails: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 16,
        color: '#555',
    },
    form: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 16,
    },
    inputField: {
        marginVertical: 10,
        height: 44,
        borderWidth: 1.5,
        borderColor: '#6c47ff',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        fontSize: 14,
    },
    loginButton: {
        marginVertical: 16,
        alignItems: 'center',
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        marginVertical: 8,
        alignItems: 'center',
    },
    linkText: {
        color: '#6c47ff',
        fontSize: 14,
    },
    label: {
        fontSize: 14,
        marginBottom: 2,
        color: '#333',
    },
});
