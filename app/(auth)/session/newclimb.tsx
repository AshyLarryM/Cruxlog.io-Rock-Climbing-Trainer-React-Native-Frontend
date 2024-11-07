import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@clerk/clerk-expo';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';
import { ClimbStyleEnum, ClimbTypeEnum, boulderGradeMapping, routeGradeMapping } from '@/lib/utils/types';


export default function NewClimb() {

    const { userId } = useAuth();
    const { data } = useMeUser(userId);

    const initGradingSystem = data?.user?.gradingPreference === false ? 'VScale' : 'French';
    const isFrenchGrading = initGradingSystem === 'French';


    const [climbName, setClimbName] = useState<string>('');
    const [type, setType] = useState<ClimbTypeEnum | undefined>();
    const [style, setStyle] = useState<ClimbStyleEnum | undefined>();
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

    function handleSave() {

        const standarizedGrade = convertGradeForSaving(grade);

        console.log({
            type,
            style,
            grade: standarizedGrade,
            attempts: attempts,
            gradingSystem,
        });
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={climbName}
                onChangeText={setClimbName}
                placeholder="Climb Name"
                keyboardType="default"
            />

            <Text style={styles.label}>Climb Type</Text>
            <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue as ClimbTypeEnum)}
                style={styles.picker}
            >
                {Object.values(ClimbTypeEnum).map((climbType) => (
                    <Picker.Item key={climbType} label={climbType} value={climbType} />
                ))}
            </Picker>

            <Text style={styles.label}>Climb Style</Text>
            <Picker
                selectedValue={style}
                onValueChange={(itemValue) => setStyle(itemValue as ClimbStyleEnum)}
                style={styles.picker}
            >
                {Object.values(ClimbStyleEnum).map((climbStyle) => (
                    <Picker.Item key={climbStyle} label={climbStyle} value={climbStyle} />
                ))}
            </Picker>

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

            <Text style={styles.label}>Attempts</Text>
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


            <Button title="Add Climb" onPress={handleSave} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginVertical: 4,
        textAlign: 'center',
        borderRadius: 16,
    },
    picker: {
        marginVertical: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 24
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
        width: 64,
        height: 64,
        backgroundColor: '#6c47ff',
        borderRadius: 32,
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
});
