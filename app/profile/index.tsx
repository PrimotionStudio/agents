import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Image,
	TextInput,
	GestureResponderEvent,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { ChevronLeft, MapPinHouse, CalendarDays } from "lucide-react-native";
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInMonths,
	differenceInYears,
} from "date-fns";
import * as SecureStore from "expo-secure-store";

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

export default function ProfilePage() {
	const [fullName, setFullName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [jwtToken, setJwtToken] = useState<string>("");
	const [isFetching, setIsFetching] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			setJwtToken(await SecureStore.getItemAsync("jwtToken"));
		})();
	}, []);
	async function editProfile(event: GestureResponderEvent) {
		event.preventDefault();
		try {
			if (!jwtToken || !fullName || !phoneNumber) return;

			const res = await fetch(`http://192.168.177.139:9999/api/user/update`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ fullName, phoneNumber }),
			});
		} catch (error) {}
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
					<Text className="text-4xl font-bold">Edit Profile</Text>
					<View className="flex flex-row gap-x-4 items-center mt-4">
						<TextInput
							placeholder="Full Name"
							value={fullName}
							onChange={(e) => setFullName(e.nativeEvent.text)}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Phone Number"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.nativeEvent.text)}
							className="p-2 text-xl border rounded-xl w-full"
						/>
					</View>
					<View className="flex flex-row gap-x-4 items-center mt-2">
						<CalendarDays size={20} color={"black"} />
						<Text className="text-xl">Joined {timeago(new Date())} ago</Text>
					</View>
					{/* <View className="flex flex-row gap-x-4 items-center mt-2">
						<Stars size={20} color={"black"} />
						<Text className="text-xl">Has a rating of 4.9</Text>
					</View> */}
				</View>

				<View className="bg-white hover:bg-gray-200 p-4 mt-[2em] mx-[1em] rounded-2xl flex flex-row items-center justify-center border">
					<TouchableOpacity onPress={editProfile}>
						<Text className="text-3xl">Update</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
