import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { decklyColors } from "../../constants/decklyColors";

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>S</Text>
      </View>

      <Text style={styles.name}>Usuario DecklyBuy</Text>
      <Text style={styles.email}>usuario@decklybuy.cl</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Publicaciones</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Deseados</Text>
        </View>
      </View>

      <Pressable
        style={styles.option}
        onPress={() => router.push("/my-posts" as any)}
      >
        <Text style={styles.optionText}>Mis publicaciones</Text>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() => router.push("/wishlist" as any)}
      >
        <Text style={styles.optionText}>Lista de deseados</Text>
      </Pressable>

      <Pressable style={styles.option}>
        <Text style={styles.optionText}>Configuración</Text>
      </Pressable>

      <Pressable
        style={[styles.option, styles.logoutOption]}
        onPress={() => router.replace("/login" as any)}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: decklyColors.profileBackground,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  avatar: {
    marginTop: 60,
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: decklyColors.profileAvatarBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: decklyColors.profileAvatarText,
    fontSize: 42,
    fontWeight: "bold",
  },
  name: {
    color: decklyColors.profileName,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  email: {
    color: decklyColors.profileEmail,
    marginTop: 5,
    marginBottom: 25,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: decklyColors.profileStatsBackground,
    borderColor: decklyColors.profileStatsBorder,
    borderWidth: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    width: 140,
    marginHorizontal: 7,
  },
  statNumber: {
    color: decklyColors.profileStatsNumber,
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: decklyColors.profileStatsLabel,
    marginTop: 5,
  },
  option: {
    backgroundColor: decklyColors.profileOptionBackground,
    borderColor: decklyColors.profileOptionBorder,
    borderWidth: 1,
    width: "100%",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  optionText: {
    color: decklyColors.profileOptionText,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutOption: {
    backgroundColor: decklyColors.profileLogoutBackground,
    borderColor: decklyColors.profileLogoutBorder,
    marginTop: 8,
  },
  logoutText: {
    color: decklyColors.profileLogoutText,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});