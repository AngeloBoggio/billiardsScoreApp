import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import local images
const images = {
  square1: require("../assets/images/8ball.png"),
  square2: require("../assets/images/9ball.png"),
  square3: require("../assets/images/10ball.png"),
  square4: require("../assets/images/straightpool.png"),
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
    <View style={styles.main}>
      {/* This will be the profile button*/}
      <View style={styles.buttonarea}>
        <View style={styles.profilebutton}>
          <TouchableOpacity
            onPress={() => console.log("Profile button pressed")}
          >
            <Image
              source={require("../assets/images/friendsicon.png")} // Replace with your actual image path
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.text}>Friends</Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Billiards Score
        </Text>

        <View style={styles.profilebutton}>
          <TouchableOpacity
            onPress={() => console.log("Profile button pressed")}
          >
            <Image
              source={require("../assets/images/profile.png")} // Replace with your actual image path
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.text}>Profile</Text>
        </View>
      </View>

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
      <TouchableOpacity
        onPress={() => console.log("recent matches button pressed")}
      >
        <Text style={styles.recentmatchtitle}>Recent Matches:</Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.matchHistory}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={index} style={styles.matchItem}>
              <Text>Item {index + 1}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1, // Ensures `ScrollView` can expand
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#EEEEEE",
  },
  matchHistory: {
    flex: 1, // Takes up remaining space
    width: "100%", // Ensures it spans full width
  },
  scrollContent: {
    padding: 15,
    columnGap: 50,
  },
  matchItem: {
    padding: 10,
    marginVertical: 7,
    backgroundColor: "#ebebeb",
    borderRadius: 5,
  },
  profilebutton: {
    margin: 20,
    alignContent: "center",
  },
  profileImage: {
    width: 50, // Adjust size as needed
    height: 50,
  },
  buttonarea: { flexDirection: "row", gap: 25, marginTop: 50 },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    padding: 10,
  },
  pressable: {
    width: "45%",
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
    color: "#000000",
    textAlign: "center",
  },
  recentmatchtitle: {
    marginTop: 50,
    fontFamily: "Bold",
    fontSize: 20,
  },
});

export default StartGame;
