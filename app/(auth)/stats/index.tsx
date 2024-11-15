import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useUserStats } from '@/lib/state/serverState/user/stats/useUserStats';
import { BarChart } from 'react-native-gifted-charts';

export default function Stats() {
    const { data, isLoading, isError } = useUserStats();

    // Define getColorForStyle function before it's used in the component
    const getColorForStyle = (style: string) => {
        const colors: { [key: string]: string } = {
            Slab: '#fc6b03',
            Vertical: '#03fc52',
            Overhang: '#0362fc',
            Cave: '#fc033d'
        };
        return colors[style] || '#CCC'; // Default color if style not found
    };

    const styleOrder = ['Slab', 'Vertical', 'Overhang', 'Cave'];

    // Filter for "Boulder" type and map styles
    const barChartData = data?.userStats
        .filter(stat => stat.type === 'Boulder') // Only include "Boulder" type climbs
        .map(stat => ({
            value: stat.count, // Use count for bar height
            label: stat.style, // Style as the label on x-axis
            frontColor: getColorForStyle(stat.style)
        }))
        .sort((a, b) => styleOrder.indexOf(a.label) - styleOrder.indexOf(b.label)) || []; // Sort by style order


    return (
        <View style={styles.container}>
            <Text>Boulder Style Distribution</Text>
            {isLoading && <Text>Loading...</Text>}
            {isError && <Text>Error loading stats</Text>}
            {barChartData.length > 0 ? (
                <BarChart
                    data={barChartData}
                    height={250}
                    width={290}
                    barWidth={50}
                    minHeight={30}
                    xAxisLabelTextStyle={{ color: 'black', fontSize: 12 }}
                    yAxisTextStyle={{ color: 'black', fontSize: 12 }}
                    backgroundColor='#fff'
                    noOfSections={4}
                    isAnimated
                />
            ) : (
                <Text>Start Climbing To View Your Stats!</Text>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // justifyContent: 'center',
        paddingHorizontal: 4,
        backgroundColor: '#fff',
    },
})