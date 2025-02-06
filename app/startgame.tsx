import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import local images
const images = {
  square1: require("../assets/images/8ball.png"),
  square2: require("../assets/images/8ball.png"),
  square3: require("../assets/images/8ball.png"),
  square4: require("../assets/images/8ball.png"),
};

const StartGame = () => {
  const loadMatchHistory = async () => {
    try {
      const matches = await AsyncStorage.getItem("matchHistory");
      return matches ? JSON.parse(matches) : [];
    } catch (error) {
      console.error("Error loading match history:", error);
      return [];
    }
  };

  return (
    <View style={styles.container}>
      {/* First Square */}
      <Link href="/eightball" asChild>
        <Pressable style={styles.pressable}>
          <View style={styles.square}>
            <Image source={images.square1} style={styles.image} />
          </View>
          <Text style={styles.text}>8 Ball</Text>
        </Pressable>
      </Link>

      {/* Second Square */}
      <Link href="/nineball" asChild>
        <Pressable style={styles.pressable}>
          <View style={styles.square}>
            <Image source={images.square2} style={styles.image} />
          </View>
          <Text style={styles.text}>9 Ball</Text>
        </Pressable>
      </Link>

      {/* Third Square */}
      <Link href="/tenball" asChild>
        <Pressable style={styles.pressable}>
          <View style={styles.square}>
            <Image source={images.square3} style={styles.image} />
          </View>
          <Text style={styles.text}>10 Ball</Text>
        </Pressable>
      </Link>

      {/* Fourth Square */}
      <Link href="/straightpool" asChild>
        <Pressable style={styles.pressable}>
          <View style={styles.square}>
            <Image source={images.square4} style={styles.image} />
          </View>
          <Text style={styles.text}>Straight Pool</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  pressable: {
    width: "40%",
    aspectRatio: 1,
  },
  square: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default StartGame;
