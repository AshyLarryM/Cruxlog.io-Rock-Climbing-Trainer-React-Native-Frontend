import { GradientButton } from '@/components/buttons/GradientButton';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, Pressable, Text, Image, View, Dimensions, Animated, Easing } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('window');

export default function Login() {
    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const slideAnim = useRef(new Animated.Value(height)).current;
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, []);


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
                    <Image source={require('@/assets/images/Cruxlog1.jpeg')} style={styles.logo} />
                    <Text style={styles.pageHeader}>Sign In</Text>

                </View>

                <Animated.View style={[styles.registerContainer, { transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.headerDetails}>Welcome back! Sign In to access your account & climbing sessions</Text>
                    <View style={styles.form}>
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

                        {/* <Text style={styles.label}>Password</Text> */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                style={styles.inputFieldWithIcon}
                                placeholderTextColor="#888"
                            />
                            <Ionicons name="lock-closed-outline" size={22} color="#ccc" style={styles.iconRight} />
                        </View>

                        <GradientButton onPress={onSigninPress} text='Log In' loading={loading} />


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
                </Animated.View>
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
        marginTop: 8,
        justifyContent: 'center',
    },
    registerContainer: {
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 24,
        flexGrow: 1,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        resizeMode: 'contain',
        borderRadius: 100,
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
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 8,
        color: '#6c47ff',
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
        borderRadius: 30,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 30,
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
        fontSize: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 2,
        color: '#333',
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
