import { Stack } from "expo-router";
import "../global.css";

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="home/index" />
			<Stack.Screen name="auth/index" />
			<Stack.Screen
				name="agent/[agentId]/index"
				options={{ presentation: "formSheet" }}
			/>
			<Stack.Screen name="property/create/index" />
			<Stack.Screen
				name="property/[propertyId]/index"
				options={{ presentation: "formSheet" }}
			/>
		</Stack>
	);
}
