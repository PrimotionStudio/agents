import { Stack } from "expo-router";
import "../global.css";

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="home/index" />
			<Stack.Screen
				name="viewProperty/index"
				options={{ presentation: "formSheet" }}
			/>
			<Stack.Screen
				name="viewAgent/index"
				options={{ presentation: "formSheet" }}
			/>
		</Stack>
	);
}
