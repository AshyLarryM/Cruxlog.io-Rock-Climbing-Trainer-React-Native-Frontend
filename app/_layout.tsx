import { Slot, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from '@/redux/store';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

const tokenCache = {
	async getToken(key: string) {
		try {
			return SecureStore.getItemAsync(key);
		}
		catch (err) {
			return;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (err) {
			return;
		}
	}
}

function InitalLayout() {
	const { isLoaded, isSignedIn } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (!isLoaded) return;

		const inTabsGroup = segments[0] === '(auth)';
		console.log("isSignedIn:", isSignedIn);

		if (isSignedIn && !inTabsGroup) {
			router.replace('/(auth)/history');
		} else if (!isSignedIn) {
			router.replace('/login');
		}

	}, [isSignedIn]);

	return <Slot />
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
						<InitalLayout />
						<Toast />
					</ClerkProvider>
				</QueryClientProvider>
			</Provider>
		</SafeAreaProvider>
	);
}
