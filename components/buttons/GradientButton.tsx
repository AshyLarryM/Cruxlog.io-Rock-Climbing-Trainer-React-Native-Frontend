import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

interface GradientButtonProps {
    onPress?: () => void;
    text: string;
    loading?: boolean,
}

export function GradientButton({ onPress, text, loading = false }: GradientButtonProps) {
    return (
        <Pressable onPress={!loading ? onPress : undefined} style={styles.container}>
            <LinearGradient
                colors={['#6c47ff', '#F96300', '#F5C900']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <Text style={styles.text}>{text}</Text>{loading && (
                        <ActivityIndicator size="small" color="#fff" style={styles.loader} />
                    )}
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        borderRadius: 30,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 30,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loader: {
        marginLeft: 8,
    },
});