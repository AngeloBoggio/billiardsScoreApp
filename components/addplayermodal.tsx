import React from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet } from "react-native";

interface AddPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPlayer: (name: string) => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  visible,
  onClose,
  onAddPlayer,
}) => {
  const [playerName, setPlayerName] = React.useState("");

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      onAddPlayer(playerName);
      setPlayerName("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Player Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={playerName}
            onChangeText={setPlayerName}
          />
          <View style={styles.buttonContainer}>
            <Button title="Add Player" onPress={handleAddPlayer} />
            <Button title="Cancel" color="red" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.68)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "70%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});

export default AddPlayerModal;
