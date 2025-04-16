import {
	Text,
	View,
	ScrollView,
	TouchableNativeFeedback,
	TouchableOpacity,
	Alert,
} from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Search, Star, LogOut } from "lucide-react-native";
import { testProps } from "../../testProps";
import * as SecureStore from "expo-secure-store";
import { Image } from "expo-image";
import { Avatar } from "react-native-elements";

interface Property {
	_id: string;
	agent: {
		_id: string;
		fullName: string;
		phoneNumber: string;
	};
	category: string;
	houseDescription: string;
	houseName: string;
	location: string;
	mainImage: string;
	otherMedia: string[];
	rating: number;
	ratingNumber: number;
	startingPricePerYear: number;
}

interface User {
	_id: string;
	fullName: string;
	phoneNumber: string;
	role: "buyer" | "agent";
}

const HomePage = () => {
	const router = useRouter();
	const [currentUser, setCurrentUser] = React.useState<User>();
	const [leftProperties, setLeftProperties] = React.useState<Property[]>([]);
	const [rightProperties, setRightProperties] = React.useState<Property[]>([]);
	const [jwtToken, setJwtToken] = React.useState<string>("");
	const [isFetching, setIsFetching] = React.useState<boolean>(true);

	useEffect(() => {
		(async () => {
			setJwtToken(await SecureStore.getItemAsync("jwtToken"));
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				if (jwtToken) {
					const headers = {
						Authorization: `Bearer ${jwtToken}`,
					};

					// Fetch both user and property data in parallel
					const [userRes, propertyRes] = await Promise.all([
						fetch("http://192.168.177.139:9999/api/user/me", { headers }),
						fetch("http://192.168.177.139:9999/api/property", { headers }),
					]);

					const [userData, propertyData] = await Promise.all([
						userRes.json(),
						propertyRes.json(),
					]);

					// Handle response errors
					if (!userRes.ok) throw new Error(userData.message);
					if (!propertyRes.ok) throw new Error(propertyData.message);

					// Set user
					setCurrentUser(userData.user);

					// Map and randomize property data
					const mappedProps = propertyData.properties.map((property: any) => ({
						...property,
						mainImage: "https://picsum.photos/200/200",
						rating: property.rating ?? Math.floor(Math.random() * 5) + 1,
						ratingNumber:
							property.ratingNumber ?? Math.floor(Math.random() * 1000) + 1,
					}));

					// Optimized: Use the `mappedProps` directly for slicing left/right
					setLeftProperties(mappedProps.filter((_, index) => index % 2 === 0));
					setRightProperties(mappedProps.filter((_, index) => index % 2 !== 0));
				} else {
					const propertyRes = await fetch(
						"http://192.168.177.139:9999/api/property"
					);
					const propertyData = await propertyRes.json();

					// Map and randomize property data
					const mappedProps = propertyData.properties.map((property: any) => ({
						...property,
						mainImage: "https://picsum.photos/200/200",
						rating: property.rating ?? Math.floor(Math.random() * 5) + 1,
						ratingNumber:
							property.ratingNumber ?? Math.floor(Math.random() * 1000) + 1,
					}));

					// Optimized: Use the `mappedProps` directly for slicing left/right
					setLeftProperties(mappedProps.filter((_, index) => index % 2 === 0));
					setRightProperties(mappedProps.filter((_, index) => index % 2 !== 0));
				}
			} catch (error) {
				Alert.alert("Error", (error as Error).message);
			} finally {
				setIsFetching(false);
			}
		})();
	}, [jwtToken]);

	async function logout() {
		await SecureStore.deleteItemAsync("jwtToken");
	}

	return (
		<SafeAreaView className="py-1 bg-gray-50 flex-1">
			{/* Top Header */}
			<View
				id="header"
				className="flex flex-row justify-between items-center p-3"
			>
				{currentUser ? (
					<Link href="/profile" className="flex flex-row gap-2">
						<Avatar
							rounded
							size={"medium"}
							titleStyle={{ color: "black" }}
							title={currentUser.fullName.charAt(0).toLocaleUpperCase()}
						/>
					</Link>
				) : (
					<Link href="/auth" className="flex flex-row gap-2">
						<Avatar
							rounded
							size={"medium"}
							icon={{ name: "home", color: "black" }}
						/>
					</Link>
				)}
				<View className="w-2/3 border border-black rounded-3xl">
					<Text className="text-2xl font-bold text-center">Port-Harcourt</Text>
					<Text className="text-sm text-center">
						{new Date().toDateString()}
					</Text>
				</View>
				<Link href="/auth" className="flex flex-row gap-2" onPress={logout}>
					<LogOut color={"black"} size={30} />
				</Link>
			</View>

			{/* Property Listing */}
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="flex-row">
					{isFetching ? (
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<View className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></View>
						</View>
					) : (
						<>
							{/* Left Column */}
							<View className="flex-1">
								{leftProperties.map((item, i) => (
									<TouchableOpacity
										key={i}
										onPress={() => router.push(`/property/${item._id}`)}
									>
										<View key={i} className="mb-4 ">
											<Image
												source={{ uri: item.mainImage }}
												style={{ width: "100%", height: 200, borderRadius: 8 }}
											/>
											<Text className="mt-2">
												<Star color={"black"} fill={"black"} size={15} />
												{"  "}
												{item.rating}
												{""}({item.ratingNumber.toLocaleString()})
											</Text>
											<Text className="text-lg font-bold">
												{item.houseName}
											</Text>
											<Text className="text-sm text-gray-600 line-clamp-1">
												From ₦{item.startingPricePerYear}k / year
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>

							{/* Right Column */}
							<View className="flex-1 ml-2">
								{rightProperties.map((item, i) => (
									<TouchableOpacity
										key={i}
										onPress={() => router.push(`/property/${item._id}`)}
									>
										<View className="mb-4 break-inside-avoid">
											<Image
												source={{ uri: item.mainImage }}
												style={{ width: "100%", height: 200, borderRadius: 8 }}
											/>
											<Text className="mt-2">
												<Star color={"black"} fill={"black"} size={15} />
												{"  "}
												{item.rating}
												{""}({item.ratingNumber.toLocaleString()})
											</Text>
											<Text className="text-lg font-bold">
												{item.houseName}
											</Text>
											<Text className="text-sm text-gray-600 line-clamp-1">
												From ₦{item.startingPricePerYear}k / year
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</>
					)}
				</View>
			</ScrollView>
			<StatusBar style="inverted" />
		</SafeAreaView>
	);
};

export default HomePage;
