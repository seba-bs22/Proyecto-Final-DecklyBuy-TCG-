import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { decklyColors } from "../constants/decklyColors";

export default function MyPostsScreen() {
  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.replace("/(tabs)/profile" as any)} />

      <View style={styles.content}>
        <Text style={styles.title}>Mis publicaciones</Text>

        <Text style={styles.emptyText}>No tienes publicaciones aún</Text>

        <Text style={styles.helperText}>
          Cuando publiques una carta, aparecerá en esta sección.
        </Text>
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/create-post" as any)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: decklyColors.myPostsBackground,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  title: {
    color: decklyColors.myPostsTitle,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
  emptyText: {
    color: decklyColors.myPostsText,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  helperText: {
    color: decklyColors.myPostsMutedText,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 34,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: decklyColors.myPostsAddButtonBackground,
    borderColor: decklyColors.myPostsAddButtonBorder,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  addButtonText: {
    color: decklyColors.myPostsAddButtonText,
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 3,
  },
});