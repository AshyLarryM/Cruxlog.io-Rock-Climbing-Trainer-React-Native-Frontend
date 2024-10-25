import { Slot, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

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
			router.replace('/home');
		} else if (!isSignedIn) {
			router.replace('/login');
		}

	}, [isSignedIn]);

	return <Slot />
}

export default function RootLayout() {
	return (
		<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
			<InitalLayout />
		</ClerkProvider>
	);
}
