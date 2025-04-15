import {
	Image,
	StyleSheet,
	Text,
	TouchableNativeFeedback,
	View,
	StatusBar as SB,
	Linking,
	TouchableOpacity,
	Alert,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CalendarDays,
	ChevronLeft,
	MapPinHouse,
	Stars,
} from "lucide-react-native";

export default function viewAgent() {
	async function contactAgent(agentNumber: string) {
		const supported = await Linking.canOpenURL(agentNumber);
		if (supported) {
			// Opening the dialer with the phone number
			await Linking.openURL(agentNumber);
		} else {
			Alert.alert("Error", "Your device does not support this feature.");
		}
	}

	return (
		<View className="flex flex-col">
			<View className="w-full h-1/2">
				<Image
					source={{ uri: "https://picsum.photos/1000/500" }}
					className="h-full w-full object-cover"
				/>
				<SafeAreaView className="absolute px-3 flex-row justify-between items-center w-full">
					<TouchableOpacity
						onPress={() => router.back()}
						className="flex flex-row gap-2 bg-white rounded-full p-2"
					>
						<ChevronLeft color={"black"} size={30} />
					</TouchableOpacity>
				</SafeAreaView>
			</View>

			<View className="w-full h-1/2 ">
				<View className="m-[2em]">
					<Text className="text-4xl font-bold">Meet Alexis Hoffman</Text>
					<View className="flex flex-row gap-x-4 items-center mt-4">
						<MapPinHouse size={20} color={"black"} />
						<Text className="text-xl">Los Angeles, CA</Text>
					</View>
					<View className="flex flex-row gap-x-4 items-center mt-2">
						<CalendarDays size={20} color={"black"} />
						<Text className="text-xl">11 years of housing experience</Text>
					</View>
					<View className="flex flex-row gap-x-4 items-center mt-2">
						<Stars size={20} color={"black"} />
						<Text className="text-xl">Has a rating of 4.9</Text>
					</View>
				</View>
				{/* <Link href={`tel:+123456789`}> */}
				<View className="bg-white hover:bg-gray-200 p-4 mt-[2em] mx-[1em] rounded-2xl flex flex-row items-center justify-center border">
					<TouchableOpacity onPress={() => contactAgent("tel:914-242-2095")}>
						<Text className="text-3xl">Contact Agent</Text>
					</TouchableOpacity>
				</View>
				{/* </Link> */}
			</View>
		</View>
	);
}
