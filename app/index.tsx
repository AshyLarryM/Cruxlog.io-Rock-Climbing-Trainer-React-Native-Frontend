import { ActivityIndicator, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
