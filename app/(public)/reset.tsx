import { useSignIn } from "@clerk/clerk-expo";
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
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        fontSize: 14,
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
        fontSize: 14,
        marginBottom: 0,
        color: '#333',
    },
    pageHeader: {
        fontSize: 42,
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
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 16,
        color: '#000',
    },
});
