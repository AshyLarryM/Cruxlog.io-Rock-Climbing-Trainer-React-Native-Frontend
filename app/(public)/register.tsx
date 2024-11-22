import { TextInput, View, StyleSheet, Pressable, Text, Image, Dimensions, Animated, Easing } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useEffect, useRef, useState } from 'react';
import { Link, Stack } from 'expo-router';
import { useCreateUser } from '@/lib/state/serverState/user/useCreateUser';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Register() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const createUser = useCreateUser();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [pendingVerification, setPendingVerification] = useState<boolean>(false);
    const [code, setCode] = useState("");
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
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={110}
            enableAutomaticScroll={true}
        >
            <View style={styles.container}>
                <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
                <Spinner visible={loading} />
                <View style={styles.header}>
                    <Image source={require('@/assets/images/cruxlogIcon.png')} style={styles.logo} />
                    <Text style={styles.pageHeader}>Create Account</Text>
                </View>

                <Animated.View style={[styles.registerContainer, { transform: [{ translateY: slideAnim }] }]}>
                {/* <View style={styles.registerContainer}> */}

                    <Text style={styles.headerDetails}>Create an account to begin logging your climbing sessions.</Text>

                    {!pendingVerification && (
                        <>
                            {/* <Text style={styles.label}>Email Address</Text> */}
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


                            <Pressable onPress={onSignUpPress} style={styles.registerButton}>
                                <Text style={styles.registerButtonText}>Create Account</Text>
                            </Pressable>
                            <View style={styles.inlineTextContainer}>
                                <Text style={styles.inlineText}>Already have an account?</Text>
                                <Link href="/login" asChild>
                                    <Pressable onPress={() => {/* Navigate to Login screen */ }}>
                                        <Text style={styles.signInLink}> Sign In</Text>
                                    </Pressable>
                                </Link>
                            </View>
                        </>
                    )}
                {/* </View> */}
                </Animated.View>

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
        padding: 16,
        marginTop: 24,
        justifyContent: 'flex-start',
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
        width: width * 0.3,
        height: width * 0.3,
        resizeMode: 'contain',
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
        marginBottom: 16,
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
    registerButton: {
        marginVertical: 16,
        alignItems: 'center',
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        borderRadius: 30,
    },
    registerButtonText: {
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
        marginBottom: 0,
        color: '#333',
    },
    inlineTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    inlineText: {
        fontSize: 16,
        color: '#9e9e9e',
    },
    signInLink: {
        fontSize: 16,
        color: '#6c47ff',
        fontWeight: '400',
        marginLeft: 4,
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