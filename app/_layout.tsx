import { Stack } from "expo-router";
import "../global.css";

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="home/index" />
			<Stack.Screen
				name="agent/index"
				options={{ presentation: "formSheet" }}
			/>
		</Stack>
	);
}
