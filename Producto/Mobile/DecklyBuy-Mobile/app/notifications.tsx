import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { decklyColors } from "../constants/decklyColors";

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.replace("/(tabs)/home" as any)} />

      <View style={styles.content}>
        <Text style={styles.title}>Notificaciones</Text>

        <Text style={styles.emptyText}>
          No hay notificaciones pendientes.
        </Text>

        <Text style={styles.helperText}>
          Aquí aparecerán avisos sobre publicaciones, compras o cambios importantes.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: decklyColors.notificationsBackground,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  title: {
    color: decklyColors.notificationsTitle,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
  emptyText: {
    color: decklyColors.notificationsText,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  helperText: {
    color: decklyColors.notificationsMutedText,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});