import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface PlayerListProps {
  players: string[];
  onAddPlayer: () => void;
  onRemovePlayer: (index: number) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.listTitle}>Players List:</Text>
      <ScrollView
        style={styles.playerList}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {players.map((player, index) => (
          <View key={index} style={styles.playerBox}>
            <Text style={styles.playerName}>
              {index + 1}. {player}
            </Text>
            <TouchableOpacity onPress={() => onRemovePlayer(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={onAddPlayer}>
        <Text style={styles.plusButton}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
  },
  playerList: {
    maxHeight: 200,
    width: "50%",
    marginTop: 20,
    padding: 10,
  },
  playerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  playerName: {
    fontSize: 18,
  },
  removeButton: {
    color: "red",
    fontSize: 16,
  },
  addButton: {
    width: 60,
    height: 60,
    marginTop: 24,
    backgroundColor: "white",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  plusButton: {
    fontSize: 40,
    color: "red",
    textAlign: "center",
    lineHeight: 43,
  },
});

export default PlayerList;
