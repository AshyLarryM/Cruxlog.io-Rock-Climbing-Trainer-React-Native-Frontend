import { StyleSheet, Text, View, Image, Button, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import { useMeUser } from '@/lib/state/serverState/user/useMeUser'
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserPr } from '@/lib/state/serverState/user/stats/useUserPr';
import { LinearGradient } from 'expo-linear-gradient';
import HardestGrades from '@/components/profile/HardestGrades';

export default function Profile() {

    const { userId } = useAuth();
    const { data, error, isLoading } = useMeUser();
    const { data: userPr } = useUserPr();


    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error loading profile data.</Text>;
    }

    function handleEditProfile() {
        router.push('/(auth)/profile/edit')
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerCard}>
                {/* Circular Profile Picture */}
                <LinearGradient
                    colors={['#6c47ff', '#ff6cd9']}
                    style={styles.gradientBorder}
                >
                    <View style={styles.profilePictureContainer}>
                        <Image
                            source={
                                data?.user?.profileImage
                                    ? { uri: data.user.profileImage }
                                    : require('@/assets/images/cruxlogIcon.png')
                            }
                            style={styles.profilePicture}
                        />
                    </View>
                </LinearGradient>
                {/* Name and Age Row */}
                <View style={styles.row}>
                    <Text style={styles.label}>Name: <Text style={styles.text}>{data?.user?.fullName || 'Add'}</Text></Text>
                </View>

                <View style={styles.separator} />
                <Text style={styles.label}>Age: <Text style={styles.text}>{data?.user?.age ? `${data.user.age} years old` : 'Add'}</Text></Text>
                <View style={styles.separator} />

                {/* Height and Weight Row */}
                {/* <View style={styles.row}>
                    <Text style={styles.label}>Height: <Text style={styles.text}>{data?.user?.height || 'Add'}</Text></Text>
                    <View style={styles.verticalSeparator} />
                    <Text style={styles.label}>Weight: <Text style={styles.text}>{data?.user?.weight || 'Add'}</Text></Text>
                </View> */}



                {/* Other Profile Details */}
                {/* <Text style={styles.label}>Ape Index: <Text style={styles.text}>{data?.user?.apeIndex || 'Add'}</Text></Text> */}
                {/* <View style={styles.separator} /> */}
                <Text style={styles.label}>
                    Grading Preference: <Text style={styles.text}>{data?.user?.gradingPreference ? 'French' : 'YDS/V Scale'}</Text>
                </Text>
                <View style={styles.separator} />
                <Text style={styles.label}>
                    Measurement System: <Text style={styles.text}>{data?.user?.measurementSystem ? 'Metric' : 'Imperial'}</Text>
                </Text>
                <View style={styles.separator} />

                <TouchableOpacity style={styles.customButton} onPress={handleEditProfile}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                        <Ionicons name="arrow-forward" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>
            </View>
            <HardestGrades userPr={userPr} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        paddingHorizontal: 16
    },
    containerCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    gradientBorder: {
        width: 150,
        height: 150,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePictureContainer: {
        width: 140,
        height: 140,
        borderRadius: 100,
        overflow: 'hidden',
    },
    profilePicture: {
        width: '100%',
        height: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    label: {
        fontSize: 18,
        marginHorizontal: 8,
        marginVertical: 8,
        color: "#555",
        fontWeight: "600",
    },
    text: {
        fontSize: 18,
        marginHorizontal: 8,
        marginVertical: 8,
        color: "#000",
        fontWeight: "bold",
    },
    verticalSeparator: {
        width: 1,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
        alignSelf: "stretch",
    },
    separator: {
        marginVertical: 4,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        width: "100%",
    },
    customButton: {
        marginTop: 8,
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginRight: 8,
    },
    icon: {
        color: '#fff',
    },
});

