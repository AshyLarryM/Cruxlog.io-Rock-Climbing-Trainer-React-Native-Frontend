import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@clerk/clerk-expo';
import { useMeUser } from '@/lib/state/serverState/user/useMeUser';

export const ClimbTypeEnum = {
    BOULDER: 'Boulder',
    TOP_ROPE: 'Top Rope',
    LEAD: 'Lead',
};

export const ClimbStyleEnum = {
    SLAB: 'Slab',
    VERTICAL: 'Vertical',
    OVERHANG: 'Overhang',
    CAVE: 'Cave',
};

export default function NewClimb() {
    const VScaleGrades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
    const FrenchGrades = ['5', '5a', '5b', '5c', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c', '9a', '9b', '9c'];

    const { userId } = useAuth();
    const { data } = useMeUser(userId);

    const initGradingSystem = data?.user?.gradingPreference === false ? 'VScale' : 'French';

   
    const [climbName, setClimbName] = useState<string>('');
    const [type, setType] = useState(Object.values(ClimbTypeEnum)[0]);
    const [style, setStyle] = useState(Object.values(ClimbStyleEnum)[0]);
    const [grade, setGrade] = useState('');
    const [attempts, setAttempts] = useState('1');
    const [gradingSystem, setGradingSystem] = useState(initGradingSystem);


    function handleSave() {
        console.log({
            type,
            style,
            grade,
            attempts: parseInt(attempts),
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
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.picker}
            >
                {Object.values(ClimbTypeEnum).map((climbType) => (
                    <Picker.Item key={climbType} label={climbType} value={climbType} />
                ))}
            </Picker>

            <Text style={styles.label}>Climb Style</Text>
            <Picker
                selectedValue={style}
                onValueChange={(itemValue) => setStyle(itemValue)}
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
                {(gradingSystem === 'VScale' ? VScaleGrades : FrenchGrades).map((gradeOption) => (
                    <Picker.Item key={gradeOption} label={gradeOption} value={gradeOption} />
                ))}
            </Picker>

            <Text style={styles.label}>Attempts</Text>
            <TextInput
                style={styles.input}
                value={attempts}
                onChangeText={setAttempts}
                placeholder="Enter Attempts"
                keyboardType="numeric"
            />

            <Button title="Save Climb" onPress={handleSave} />
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
    },
});
