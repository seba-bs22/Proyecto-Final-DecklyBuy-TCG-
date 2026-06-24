import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { decklyColors } from "../constants/decklyColors";

export default function LoginScreen() {
  const handleLogin = () => {
    router.replace("/(tabs)/home" as any);
  };

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>DecklyBuy TCG</Text>
          <Text style={styles.subtitle}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Accede a tu cuenta para gestionar tus cartas TCG</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={decklyColors.loginInputPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={decklyColors.loginInputPlaceholder}
            secureTextEntry
          />

          <Pressable onPress={() => router.push("/forgot-password" as any)}>
            <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Ingresar</Text>
          </Pressable>

          <Pressable style={styles.googleButton}>
            <Image
              source={require("../assets/images/icons/google-logo.png")}
              style={styles.googleLogo}
              resizeMode="contain"
            />

            <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/register" as any)}>
            <Text style={styles.registerText}>
                ¿No tienes cuenta?{" "}
                <Text style={styles.registerHighlight}>Regístrate</Text>
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
    backgroundColor: decklyColors.loginBackground,
  },
  overlay: {
    flex: 1,
    backgroundColor: decklyColors.loginOverlay,
    justifyContent: "center",
    padding: 24,
  },
  loginBox: {
    backgroundColor: decklyColors.loginBoxBackground,
    borderColor: decklyColors.loginBoxBorder,
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: decklyColors.loginTitle,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: decklyColors.loginSubtitle,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    backgroundColor: decklyColors.loginInputBackground,
    borderColor: decklyColors.loginInputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
    fontSize: 15,
    color: decklyColors.loginInputText,
  },
  forgotPasswordText: {
    color: decklyColors.loginRegisterHighlight,
    textAlign: "right",
    fontWeight: "700",
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: decklyColors.loginButtonBackground,
    borderColor: decklyColors.loginButtonBorder,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: decklyColors.loginButtonText,
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  googleButton: {
  backgroundColor: decklyColors.loginGoogleBackground,
  borderColor: decklyColors.loginGoogleBorder,
  borderWidth: 1,
  borderRadius: 12,
  paddingVertical: 13,
  paddingHorizontal: 14,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  marginTop: 12,
},

googleLogo: {
  width: 30,
  height: 22,
  marginRight: 10,
},

googleButtonText: {
  color: decklyColors.loginGoogleText,
  fontWeight: "700",
  fontSize: 15,
},
  registerText: {
    color: decklyColors.loginRegisterText,
    textAlign: "center",
    marginTop: 18,
    fontWeight: "600",
  },
  registerHighlight: {
    color: decklyColors.loginRegisterHighlight,
    fontWeight: "bold",
  },
});