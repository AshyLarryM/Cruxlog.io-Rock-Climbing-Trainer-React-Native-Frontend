import { StyleSheet, Text, View, Image, Button, Modal, ActivityIndicator } from 'react-native'
import React from 'react'
import { useMeUser } from '@/lib/state/serverState/user/useMeUser'
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function Profile() {

    const { userId } = useAuth();
    const { data, error, isLoading } = useMeUser(userId);


    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Error loading profile data.</Text>;
    }

    function handleEditProfile() {
        router.push('/(auth)/profile/edit')
    }

    return (
        <View style={styles.container}>

            {/* Circular Profile Picture */}
            <View style={styles.profilePictureContainer}>
                <Image
                    source={{ uri: 'https://picsum.photos/200/300' }}
                    style={styles.profilePicture}
                />
            </View>

            {/* Name and Age Row */}
            <View style={styles.row}>
                <Text style={styles.label}>{data?.user?.fullName || 'Add'}</Text>
                <Text style={styles.label}> | </Text>
                <Text style={styles.label}>{data?.user?.age ? `${data.user.age} years` : 'Add'}</Text>
            </View>

            {/* Height and Weight Row */}
            <View style={styles.row}>
                <Text style={styles.label}>Height: {data?.user?.height || 'Add'}</Text>
                <Text style={styles.label}> | </Text>
                <Text style={styles.label}>Weight: {data?.user?.weight || 'Add'}</Text>
            </View>

            {/* Other Profile Details */}
            <Text style={styles.label}>Ape Index: {data?.user?.apeIndex || 'Add'}</Text>
            <Text style={styles.label}>
                Grading Preference: {data?.user?.gradingPreference ? 'French' : 'YDS/V Scale'}
            </Text>
            <Text style={styles.label}>
                Measurement System: {data?.user?.measurementSystem ? 'Metric' : 'Imperial'}
            </Text>

            <Button title='Edit Profile' onPress={handleEditProfile} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    profilePictureContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 16,
    },
    profilePicture: {
        width: '100%',
        height: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 18,
        marginHorizontal: 4,
    },
});

