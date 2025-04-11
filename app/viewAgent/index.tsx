import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const viewAgent = () => {
	return (
		<SafeAreaView>
			<Text style={{ fontSize: 20 }}>viewAgent</Text>
			<Link href="/home">Home</Link>
			<Link href="/viewProperty">View Property</Link>
			<Link href={"/viewAgent"}>View Agent</Link>
		</SafeAreaView>
	);
};

export default viewAgent;

const styles = StyleSheet.create({});
