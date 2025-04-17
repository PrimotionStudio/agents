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
import React, { useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CalendarDays,
	ChevronLeft,
	MapPinHouse,
	Phone,
	Stars,
} from "lucide-react-native";
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInMonths,
	differenceInYears,
} from "date-fns";
import * as SecureStore from "expo-secure-store";

interface Agent {
	_id: string;
	fullName: string;
	phoneNumber: string;
	role: "agent";
	rating: number;
	ratingNumber: number;
	createdAt: Date;
}

function timeago(date: Date): string {
	const now = new Date();

	const years = differenceInYears(now, date);
	if (years >= 1) return `${years} years`;

	const months = differenceInMonths(now, date);
	if (months >= 1) return `${months} months`;

	const days = differenceInDays(now, date);
	if (days >= 1) return `${days} days`;

	const hours = differenceInHours(now, date);
	if (hours >= 1) return `${hours} hours`;

	const minutes = differenceInMinutes(now, date);
	return `${minutes} minutes`;
}

export default function viewAgent() {
	const { agentId } = useLocalSearchParams<{ agentId: string }>();
	const [jwtToken, setJwtToken] = useState<string>("");
	const [isFetching, setIsFetching] = useState<boolean>(true);
	const [agent, setAgent] = useState<Agent>({
		_id: "",
		fullName: "",
		phoneNumber: "",
		role: "agent",
		rating: 0,
		ratingNumber: 0,
		createdAt: new Date(),
	});

	useEffect(() => {
		(async () => {
			setJwtToken(await SecureStore.getItemAsync("jwtToken"));
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				if (!jwtToken || !agentId) return;

				const headers = {
					Authorization: `Bearer ${jwtToken}`,
				};
				const res = await fetch(
					`http://192.168.232.139:9999/api/agent/${agentId}`,
					{
						headers,
					}
				);

				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.message);
				}

				setAgent(data.agent);
			} catch (error) {
				console.error("Failed to load user:", error);
			} finally {
				setIsFetching(false);
			}
		})();
	}, [jwtToken, agentId]);

	async function contactAgent(agentNumber: string) {
		const supported = await Linking.canOpenURL(agentNumber);
		if (supported) {
			await Linking.openURL(agentNumber);
		} else {
			Alert.alert("Error", "Your device does not support this feature.");
		}
	}

	if (isFetching) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<View className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></View>
			</View>
		);
	}

	return (
		<View className="flex h-full">
			<View className="w-full h-1/2">
				<Image
					source={{ uri: "https://picsum.photos/1000/500" }}
					className="h-full w-full object-cover"
				/>
				<SafeAreaView
					className="absolute px-3 flex-row justify-between items-center w-full"
					style={{ marginTop: SB.currentHeight }}
				>
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
					<Text className="text-4xl font-bold">Meet {agent.fullName}</Text>
					<View className="flex flex-row gap-x-4 items-center mt-4">
						<Phone size={20} color={"black"} />
						<Text className="text-xl">{agent.phoneNumber}</Text>
					</View>
					<View className="flex flex-row gap-x-4 items-center mt-2">
						<CalendarDays size={20} color={"black"} />
						<Text className="text-xl">
							{timeago(new Date(agent.createdAt))} of housing experience
						</Text>
					</View>
					<View className="flex flex-row gap-x-4 items-center mt-2">
						<Stars size={20} color={"black"} />
						<Text className="text-xl">
							Has a rating of {agent.rating} stars ({agent.ratingNumber}{" "}
							reviews)
						</Text>
					</View>
				</View>

				<View className="bg-white hover:bg-gray-200 p-4 mt-[2em] mx-[1em] rounded-2xl flex flex-row items-center justify-center border">
					<TouchableOpacity onPress={() => contactAgent("tel:914-242-2095")}>
						<Text className="text-3xl">Contact Agent</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
