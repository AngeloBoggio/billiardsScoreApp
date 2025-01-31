import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import PlayerList from "@/components/playerList";
import AddPlayerModal from "@/components/addplayermodal";
import TeamSelectionScreen from "./teamSelectionScreen";
import GameScreen from "./gameScreen";

const EightBall = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState({});
  const [currentScreen, setCurrentScreen] = useState("start");

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        MyCustomFont: require("../assets/fonts/Impact.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleAddPlayer = (name: string) => {
    setPlayers((prev) => [...prev, name]);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length === 2) {
      setCurrentScreen("game");
    } else if (players.length > 2) {
      setCurrentScreen("teamSelection");
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (currentScreen === "teamSelection") {
    return (
      <TeamSelectionScreen
        players={players}
        onStartGame={() => setCurrentScreen("game")}
        setTeams={setTeams}
      />
    );
  }

  if (currentScreen === "game") {
    return <GameScreen players={players} teams={teams} />;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.playerCount, { fontFamily: "MyCustomFont" }]}>
        Players: {players.length}
      </Text>

      <PlayerList
        players={players}
        onAddPlayer={() => setModalVisible(true)}
        onRemovePlayer={handleRemovePlayer}
      />

      <AddPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddPlayer={handleAddPlayer}
      />

      {players.length >= 2 && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playerCount: {
    fontSize: 40,
    padding: 30,
  },
  startButton: {
    marginTop: 20,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});

export default EightBall;
