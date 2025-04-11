import { Text, View, ScrollView, TouchableNativeFeedback } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, Router, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Search, Star } from "lucide-react-native";
import { testProps } from "../../testProps";
import { Image } from "expo-image";

interface Property {
	agent: {
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

const HomePage = () => {
	const router = useRouter();
	const [leftProperties, setLeftProperties] = React.useState<Property[]>([]);
	const [rightProperties, setRightProperties] = React.useState<Property[]>([]);

	useEffect(() => {
		async function fetchProperties() {
			try {
				const propertyResponse = await fetch(
					"https://api.mockaroo.com/api/4a5174c0?count=10&key=c5e8ab40"
				);
				const propertyData = await propertyResponse.json();
				if (!propertyResponse.ok) {
					throw new Error(propertyData.message);
				}
				setLeftProperties(propertyData.filter((_, index) => index % 2 === 0));
				setRightProperties(propertyData.filter((_, index) => index % 2 !== 0));
			} catch (error) {
				console.error((error as Error).message);
			}
		}
		// fetchProperties();
		// console.log(testProps);
		// setProperties(testProps);
		setLeftProperties(testProps.filter((_, index) => index % 2 === 0));
		setRightProperties(testProps.filter((_, index) => index % 2 !== 0));
	}, []);
	return (
		<SafeAreaView className="py-1 bg-gray-50 flex-1">
			<View
				id="header"
				className="flex flex-row justify-between items-center p-3"
			>
				<Link href="/profile" className="flex flex-row gap-2">
					<User color={"black"} size={30} />
				</Link>
				<View className="w-2/3 border border-black rounded-3xl">
					<Text className="text-2xl font-bold text-center">Port-Harcourt</Text>
					<Text className="text-sm text-center">
						{new Date().toDateString()}
					</Text>
				</View>
				<Link href="/settings" className="flex flex-row gap-2">
					<Settings color={"black"} size={30} />
				</Link>
			</View>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="flex-row">
					{/* Left Column */}
					<View className="flex-1">
						{leftProperties.map((item, i) => (
							<TouchableNativeFeedback
								key={i}
								onPress={() =>
									router.push(`/property/${item.houseName.toLowerCase()}`)
								}
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
									<Text className="text-lg font-bold">{item.houseName}</Text>
									<Text className="text-sm text-gray-600 line-clamp-1">
										From ₦{item.startingPricePerYear}k / year
									</Text>
								</View>
							</TouchableNativeFeedback>
						))}
					</View>

					{/* Right Column */}
					<View className="flex-1 ml-2">
						{rightProperties.map((item, i) => (
							<TouchableNativeFeedback
								key={i}
								onPress={() =>
									router.push(`/property/${item.houseName.toLowerCase()}`)
								}
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
									<Text className="text-lg font-bold">{item.houseName}</Text>
									<Text className="text-sm text-gray-600 line-clamp-1">
										From ₦{item.startingPricePerYear}k / year
									</Text>
								</View>
							</TouchableNativeFeedback>
						))}
					</View>
				</View>
			</ScrollView>
			<StatusBar style="inverted" />
		</SafeAreaView>
	);
};

export default HomePage;
