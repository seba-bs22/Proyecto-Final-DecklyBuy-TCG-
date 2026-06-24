import { router } from "expo-router";
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { decklyColors } from "../constants/decklyColors";

export default function ForgotPasswordScreen() {
  return (
    <ImageBackground
      source={require("../assets/images/login-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Recuperar contraseña</Text>

          <Text style={styles.description}>
            Ingresa tu correo electrónico para recibir un enlace de recuperación.
          </Text>

          <Text style={styles.label}>Correo electrónico</Text>

          <TextInput
            style={styles.input}
            placeholder="Ej: usuario@correo.com"
            placeholderTextColor={decklyColors.forgotPasswordInputPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Pressable style={styles.recoverButton}>
            <Text style={styles.recoverButtonText}>RECUPERAR</Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/login" as any)}>
            <Text style={styles.backText}>
              ¿Recordaste tu contraseña?{" "}
              <Text style={styles.backHighlight}>Volver a login</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: decklyColors.forgotPasswordBackground,
  },
  overlay: {
    flex: 1,
    backgroundColor: decklyColors.forgotPasswordOverlay,
    justifyContent: "center",
    padding: 24,
  },
  box: {
    backgroundColor: decklyColors.forgotPasswordBoxBackground,
    borderColor: decklyColors.forgotPasswordBoxBorder,
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: decklyColors.forgotPasswordTitle,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    color: decklyColors.forgotPasswordDescription,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  label: {
    color: decklyColors.forgotPasswordLabel,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: decklyColors.forgotPasswordInputBackground,
    borderColor: decklyColors.forgotPasswordInputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: decklyColors.forgotPasswordInputText,
    marginBottom: 18,
  },
  recoverButton: {
    backgroundColor: decklyColors.forgotPasswordButtonBackground,
    borderColor: decklyColors.forgotPasswordButtonBorder,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  recoverButtonText: {
    color: decklyColors.forgotPasswordButtonText,
    fontWeight: "bold",
    fontSize: 16,
  },
  backText: {
    color: decklyColors.forgotPasswordBackText,
    textAlign: "center",
    marginTop: 18,
    fontWeight: "600",
  },
  backHighlight: {
    color: decklyColors.forgotPasswordBackHighlight,
    fontWeight: "bold",
  },
});