import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { Climb, ClimbStyleEnum, ClimbTypeEnum, boulderGradeMapping, routeGradeMapping } from '@/lib/utils/models/climbModels';
import { useRouter } from 'expo-router';
import UUID from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useUpdateClimb } from '@/lib/state/serverState/user/climb/useUpdateClimb';

export default function EditClimb() {
    const { data } = useMeUser();
    const router = useRouter();
    const initGradingSystem = data?.user?.gradingPreference === false ? 'VScale' : 'French';
    const isFrenchGrading = initGradingSystem === 'French';

    const currentClimb = useSelector((state: RootState) => state.climb.currentClimb);
    const { mutate: updateClimb, isPending, isError, isSuccess } = useUpdateClimb(currentClimb!.id.toString());

    const [name, setName] = useState<string>(currentClimb?.name || '');
    const [type, setType] = useState<ClimbTypeEnum | ''>(currentClimb?.type || '');
    const [style, setStyle] = useState<ClimbStyleEnum | ''>(currentClimb?.style || '');
    const [grade, setGrade] = useState<string>(currentClimb?.grade || '');
    const [attempts, setAttempts] = useState<number>(currentClimb?.attempts || 1);
    const [send, setSend] = useState<boolean>(currentClimb?.send!);

    useEffect(() => {
        if (currentClimb) {
            setName(currentClimb.name);
            setStyle(currentClimb.style);
            setGrade(currentClimb.grade);
            setAttempts(currentClimb.attempts);
            setSend(currentClimb.send!);
        }
    }, [currentClimb]);


    function convertGradeForSaving(selectedGrade: string): string {
        if (type === ClimbTypeEnum.BOULDER) {
            return isFrenchGrading ? Object.keys(boulderGradeMapping).find(key => boulderGradeMapping[key] === selectedGrade) || selectedGrade : selectedGrade;
        } else if (type === ClimbTypeEnum.LEAD || ClimbTypeEnum.TOP_ROPE) {
            return isFrenchGrading ? Object.keys(routeGradeMapping).find(key => routeGradeMapping[key] === selectedGrade) || selectedGrade : selectedGrade;
        }
        return selectedGrade;
    }

    function incrementAttempts() {
        setAttempts(prev => prev + 1);
    }

    function decrementAttempts() {
        setAttempts(prev => Math.max(1, prev - 1))
    }

    async function handleUpdateClimb() {
        const standardizedGrade = convertGradeForSaving(grade);

        const climbData: Climb = {
            id: currentClimb?.id || UUID.v4(),
            name: name || '',
            sessionId: currentClimb?.sessionId,
            type: type as ClimbTypeEnum,
            style: type as ClimbStyleEnum,
            grade: standardizedGrade,
            attempts: attempts,
            send: send,
        };

        updateClimb(climbData, {
            onSuccess: () => {
                Toast.show({
                    type: "success",
                    text1: "Climb updated successfully",
                    swipeable: true,
                });
                router.back();
            },
            onError: (error) => {
                Toast.show({
                    type: "error",
                    text1: "Error updating climb",
                    text2: error.message,
                });
            },
        });


    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter Climb Name..."
                placeholderTextColor="#888"
                keyboardType="default"
            />

            <View style={styles.inlineContainer}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Type</Text>
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue) => setType(itemValue as ClimbTypeEnum)}
                        style={styles.picker}
                    >
                        {Object.values(ClimbTypeEnum).map((climbType) => (
                            <Picker.Item key={climbType} label={climbType} value={climbType} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Style</Text>
                    <Picker
                        selectedValue={style}
                        onValueChange={(itemValue) => setStyle(itemValue as ClimbStyleEnum)}
                        style={styles.picker}
                    >
                        {Object.values(ClimbStyleEnum).map((climbStyle) => (
                            <Picker.Item key={climbStyle} label={climbStyle} value={climbStyle} />
                        ))}
                    </Picker>
                </View>
            </View>

            <Text style={styles.label}>Grade</Text>
            <Picker
                selectedValue={grade}
                onValueChange={(itemValue) => setGrade(itemValue)}
                style={styles.picker}
            >
                {Object.entries(type === ClimbTypeEnum.BOULDER ? boulderGradeMapping : routeGradeMapping).map(([vScale, frenchScale]) => (
                    <Picker.Item
                        key={vScale}
                        label={isFrenchGrading ? frenchScale : vScale}
                        value={isFrenchGrading ? frenchScale : vScale}
                    />
                ))}
            </Picker>

            <View style={styles.attemptsContainer}>
                <View style={styles.attemptWrapper}>
                    <Text style={styles.attemptsLabel}>Attempts</Text>
                    <View style={styles.attemptsControls}>
                        <TouchableOpacity
                            onPress={decrementAttempts}
                            disabled={attempts === 1}
                            style={[styles.attemptButton, attempts === 1 && styles.disabledButton]}
                        >
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.attemptsText}>{attempts}</Text>
                        <TouchableOpacity onPress={incrementAttempts} style={styles.attemptButton}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sendWrapper}>
                    <Text style={styles.label}>Send?</Text>
                    <View style={styles.switchContainer}>
                        <Switch
                            value={send}
                            onValueChange={setSend}
                            style={styles.switch}
                            trackColor={{ false: "#fff", true: "#6c47ff" }}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={handleUpdateClimb} style={styles.addButton}>
                {isPending ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.addButtonText}>Update Climb</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginVertical: 0,
        textAlign: 'center',
    },
    picker: {
        marginTop: -20,
        marginBottom: -30,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 18,
        marginVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 24,
        textAlign: 'center',
    },
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    pickerContainer: {
        flex: 1,
        marginHorizontal: 4,
    },
    attemptsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        marginVertical: 8,
    },
    attemptWrapper: {
        alignItems: 'center',
    },
    attemptsControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sendWrapper: {
        alignItems: 'center',
    },
    switchContainer: {
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    },
    switch: {
        marginVertical: 16,
        color: '#6c47ff',
    },
    attemptsLabel: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    attemptsText: {
        fontSize: 24,
        marginHorizontal: 16,
    },
    attemptButton: {
        width: 50,
        height: 50,
        backgroundColor: '#6c47ff',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 32,
    },
    addButton: {
        marginTop: 12,
        backgroundColor: '#6c47ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
