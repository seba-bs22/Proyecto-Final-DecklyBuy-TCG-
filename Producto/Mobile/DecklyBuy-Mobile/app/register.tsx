import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { decklyColors } from "../constants/decklyColors";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    numeroContacto: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleRegister = () => {
    Alert.alert(
      "Registro pendiente",
      "Más adelante conectaremos esta acción con el backend."
    );
  };

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.box}>
            <Text style={styles.title}>Registrarse</Text>

            <Text style={styles.description}>
              Crea tu cuenta para publicar y gestionar tus cartas TCG.
            </Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sebastian"
              placeholderTextColor={decklyColors.registerInputPlaceholder}
              value={formData.nombre}
              onChangeText={(value) => handleChange("nombre", value)}
            />

            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Bustos"
              placeholderTextColor={decklyColors.registerInputPlaceholder}
              value={formData.apellido}
              onChangeText={(value) => handleChange("apellido", value)}
            />

            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: seba_bs22"
              placeholderTextColor={decklyColors.registerInputPlaceholder}
              value={formData.nombreUsuario}
              onChangeText={(value) => handleChange("nombreUsuario", value)}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Número de contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 912345678"
              placeholderTextColor={decklyColors.registerInputPlaceholder}
              value={formData.numeroContacto}
              onChangeText={(value) => handleChange("numeroContacto", value)}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: usuario@correo.com"
              placeholderTextColor={decklyColors.registerInputPlaceholder}
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={decklyColors.registerInputPlaceholder}
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor={decklyColors.registerInputPlaceholder}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              secureTextEntry
            />

            <Pressable style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
            </Pressable>

            <Pressable onPress={() => router.replace("/login" as any)}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.loginHighlight}>Inicia sesión</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: decklyColors.registerBackground,
  },
  overlay: {
    flex: 1,
    backgroundColor: decklyColors.registerOverlay,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingVertical: 45,
  },
  box: {
    backgroundColor: decklyColors.registerBoxBackground,
    borderColor: decklyColors.registerBoxBorder,
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: decklyColors.registerTitle,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    color: decklyColors.registerDescription,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 22,
  },
  label: {
    color: decklyColors.registerLabel,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    backgroundColor: decklyColors.registerInputBackground,
    borderColor: decklyColors.registerInputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: decklyColors.registerInputText,
    marginBottom: 14,
  },
  registerButton: {
    backgroundColor: decklyColors.registerButtonBackground,
    borderColor: decklyColors.registerButtonBorder,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  registerButtonText: {
    color: decklyColors.registerButtonText,
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    color: decklyColors.registerLoginText,
    textAlign: "center",
    marginTop: 18,
    fontWeight: "600",
  },
  loginHighlight: {
    color: decklyColors.registerLoginHighlight,
    fontWeight: "bold",
  },
});