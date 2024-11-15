import React from "react";
import { View, StyleSheet } from "react-native";

interface IntensityBarProps {
    intensity: number;
}

export function IntensityBar({ intensity }: IntensityBarProps) {
    return (
        <View style={styles.barContainer}>
            {[...Array(10)].map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.segment,
                        index < intensity && styles.filledSegment,
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    barContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginVertical: 8,
    },
    segment: {
        flex: 1,
        height: 10,
        marginHorizontal: 2,
        backgroundColor: "#e0e0e0",
        borderRadius: 2,
    },
    filledSegment: {
        backgroundColor: "#DE4372",
    },
});
