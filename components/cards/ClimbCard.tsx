import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Climb } from '@/lib/utils/models/climbModels';
import { useRouter, usePathname } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setCurrentClimb } from '@/redux/climbSlice';

interface ClimbCardProps {
    climb: Climb;
}

export function ClimbCard({ climb }: ClimbCardProps) {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const isHistoryRoute = pathname.startsWith('/history');

    function handleEdit() {
        dispatch(setCurrentClimb(climb));
        router.push('/(auth)/session/edit');
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{climb.name || 'Unnamed'}</Text>
            </View>
            <View style={styles.typeContainer}>
                <Text style={styles.typeLabel}>Type: </Text>
                <Text style={styles.typeValue}>{climb.style} {climb.type}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.content}>
                <View style={styles.gradeContainer}>
                    <Text style={styles.gradeText}>Grade: {climb.grade}</Text>
                </View>
                <View style={styles.attemptsContainer}>
                    <Text style={styles.attemptsLabel}>Attempts: </Text>
                    <Text style={styles.attemptsCount}>{climb.attempts}</Text>
                </View>
            </View>

            {climb.climbImage && (
                <>
                    <TouchableOpacity
                        style={styles.climbImageContainer}
                        onPress={() => setModalVisible(true)}
                    >
                        {imageLoading && (
                            <ActivityIndicator size="large" color="#ccc" style={styles.loader} />
                        )}
                        <Image
                            source={{ uri: climb.climbImage }}
                            style={styles.climbImage}
                            resizeMode="cover"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                        />
                    </TouchableOpacity>

                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <Pressable
                            style={styles.modalContainer}
                            onPress={() => setModalVisible(false)}
                        >
                            <Image
                                source={{ uri: climb.climbImage }}
                                style={styles.fullscreenImage}
                                resizeMode="contain"
                            />
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={32} color="#fff" />
                            </Pressable>
                        </Pressable>
                    </Modal>
                </>
            )}

            {climb.attempts === 1 && climb.send && (
                <View style={styles.flashContainer}>
                    <Ionicons name="flash" size={20} color="#ffcc00" />
                    <Text style={styles.flashText}>Flash!</Text>
                </View>
            )}

            <View
                style={[
                    styles.footer,
                    {
                        backgroundColor: climb.send ? "#ffcf4d" : '#fff',
                        justifyContent: isHistoryRoute ? 'center' : 'space-around',
                    }
                ]}
            >
                <Text style={styles.sentStatus}>{climb.send ? 'Sent: Yes' : 'Sent: No'}</Text>
                {!isHistoryRoute && (
                    <TouchableOpacity onPress={handleEdit} style={styles.editIcon}>
                        <Text style={styles.editText}>Edit</Text>
                        <Ionicons name="pencil" size={16} color="#333" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        backgroundColor: '#6c47ff',
        paddingVertical: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginVertical: 8,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    typeContainer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    typeValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    gradeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    attemptsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    gradeText: {
        color: '#4caf50',
        fontWeight: 'bold',
        fontSize: 20,
    },
    attemptsLabel: {
        fontSize: 20,
        fontWeight: "500",
        color: '#555',
        marginRight: 8,
    },
    attemptsCount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    climbImageContainer: {
        paddingHorizontal: 16,
        paddingTop: 4,
        alignItems: 'center',
        position: 'relative',
    },
    climbImage: {
        padding: 4,
        width: 275,
        height: 200,
        borderRadius: 12,
        marginVertical: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    sentStatus: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    flashContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 8,
    },
    flashText: {
        marginLeft: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
    editIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    editText: {
        marginHorizontal: 8,
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
        padding: 8,
    },
});