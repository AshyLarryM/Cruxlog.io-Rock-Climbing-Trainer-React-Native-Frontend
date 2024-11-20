import { TextInput, View, StyleSheet, Pressable, Text, Image, Dimensions } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';
import { Link, Stack } from 'expo-router';
import { useCreateUser } from '@/lib/state/serverState/user/useCreateUser';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

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
                    <Text style={styles.pageHeader}>Create an account </Text>
                    <Text style={styles.headerDetails}>Create an account to begin logging your climbing sessions</Text>
                </View>

                {!pendingVerification && (
                    <>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            autoCapitalize='none'
                            placeholder='example@gmail.com'
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
        padding: 20,
        marginTop: 24,
        justifyContent: 'flex-start',
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
        color: '#000',
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
        borderRadius: 8,
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
        fontSize: 14,
        color: '#333',
    },
    signInLink: {
        fontSize: 14,
        color: '#6c47ff',
        fontWeight: '400',
        marginLeft: 4,
    },
});