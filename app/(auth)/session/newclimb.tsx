import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@clerk/clerk-expo';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { ClimbStyleEnum, ClimbTypeEnum, boulderGradeMapping, routeGradeMapping } from '@/lib/utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UUID from 'react-native-uuid';



export default function NewClimb() {

    const { userId } = useAuth();
    const { data } = useMeUser(userId);
    const router = useRouter();

    const initGradingSystem = data?.user?.gradingPreference === false ? 'VScale' : 'French';
    const isFrenchGrading = initGradingSystem === 'French';

    const [climbName, setClimbName] = useState<string>('');
    const [type, setType] = useState<ClimbTypeEnum | undefined>(Object.values(ClimbTypeEnum)[1]);
    const [style, setStyle] = useState<ClimbStyleEnum | undefined>(Object.values(ClimbStyleEnum)[1]);
    const [grade, setGrade] = useState('');
    const [attempts, setAttempts] = useState<number>(1);
    const [gradingSystem, setGradingSystem] = useState(initGradingSystem);


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

    async function handleSave() {
        const standardizedGrade = convertGradeForSaving(grade);
    
        const climbData = {
            id: UUID.v4(),
            climbName,
            type,
            style,
            grade: standardizedGrade,
            attempts,
            gradingSystem,
        };
    
        try {
            // Retrieve existing climbs or default to an empty array
            const storedClimbs = await AsyncStorage.getItem('climbs');
            const existingClimbs = storedClimbs ? JSON.parse(storedClimbs) : [];
    
            // Add the new climb
            existingClimbs.push(climbData);
    
            // Save updated climbs back to AsyncStorage
            await AsyncStorage.setItem('climbs', JSON.stringify(existingClimbs));
    
            // Optionally navigate back
            // router.back(); // or navigation.goBack();
            console.log("Climb Data: ", climbData);
            console.log("Stored Climbs: ", storedClimbs);
            router.back();
        } catch (error) {
            console.error("Error saving climb:", error);
        }
    }
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={climbName}
                onChangeText={setClimbName}
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

            <Text style={styles.attemptsLabel}>Attempts</Text>
            <View style={styles.attemptsContainer}>
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
            <TouchableOpacity onPress={handleSave}
                style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Climb</Text>
            </TouchableOpacity>
            {/* <Button title="Add Climb" onPress={handleSave} /> */}
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
    attemptsLabel: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    attemptsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    attemptsText: {
        fontSize: 24,
        marginHorizontal: 24,
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
