import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BackButton from "../components/BackButton";
import { decklyColors } from "../constants/decklyColors";

export default function CreatePostScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    numero: "",
    precio: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const pickImageFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso requerido",
        "Debes permitir el acceso a la galería para seleccionar una imagen."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso requerido",
        "Debes permitir el acceso a la cámara para tomar una foto."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    if (!imageUri) {
      Alert.alert(
        "Imagen requerida",
        "Debes seleccionar o tomar una foto antes de analizarla."
      );
      return;
    }

    Alert.alert(
      "Análisis pendiente",
      "Más adelante conectaremos esta acción con el servicio de IA."
    );
  };

  const handlePublish = () => {
    Alert.alert(
      "Publicación pendiente",
      "Más adelante conectaremos esta acción con el backend."
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <BackButton onPress={() => router.replace("/my-posts" as any)} />

      <Text style={styles.title}>Crear publicación</Text>

      <Text style={styles.subtitle}>
        Completa los datos de la carta y agrega una imagen para previsualizarla.
      </Text>

      <View style={styles.imageBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Sube o toma una imagen de la carta
            </Text>
          </View>
        )}

        <View style={styles.imageButtonsRow}>
          <Pressable
            style={styles.imageButton}
            onPress={pickImageFromGallery}
          >
            <Text style={styles.imageButtonText}>Galería</Text>
          </Pressable>

          <Pressable
            style={styles.imageButton}
            onPress={takePhotoWithCamera}
          >
            <Text style={styles.imageButtonText}>Cámara</Text>
          </Pressable>
        </View>

        <Pressable style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.analyzeButtonText}>Analizar imagen</Text>
        </Pressable>
      </View>

      <View style={styles.formBox}>
        <Text style={styles.label}>Nombre de la carta</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Charizard EX"
          placeholderTextColor={decklyColors.createPostInputPlaceholder}
          value={formData.nombre}
          onChangeText={(value) => handleChange("nombre", value)}
        />

        <Text style={styles.label}>Edición</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Scarlet & Violet 151"
          placeholderTextColor={decklyColors.createPostInputPlaceholder}
          value={formData.edicion}
          onChangeText={(value) => handleChange("edicion", value)}
        />

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 065/165"
          placeholderTextColor={decklyColors.createPostInputPlaceholder}
          value={formData.numero}
          onChangeText={(value) => handleChange("numero", value)}
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 8000"
          placeholderTextColor={decklyColors.createPostInputPlaceholder}
          value={formData.precio}
          onChangeText={(value) => handleChange("precio", value)}
          keyboardType="numeric"
        />

        <View style={styles.separator} />

        <Text style={styles.label}>Estado detectado</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Ej: Lightly Played"
          placeholderTextColor={decklyColors.createPostInputPlaceholder}
          editable={false}
        />

        <Text style={styles.label}>Score</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Ej: 7/10"
          placeholderTextColor={decklyColors.createPostInputPlaceholder}
          editable={false}
        />

        <Text style={styles.label}>Confianza</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          placeholder="Ej: 85%"
          placeholderTextColor={decklyColors.createPostInputPlaceholder}
          editable={false}
        />
      </View>

      <Pressable style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishButtonText}>PUBLICAR</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: decklyColors.createPostBackground,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    color: decklyColors.createPostTitle,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 24,
  },
  subtitle: {
    color: decklyColors.createPostSubtitle,
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 21,
  },
  imageBox: {
    backgroundColor: decklyColors.createPostImageBoxBackground,
    borderColor: decklyColors.createPostImageBoxBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  placeholder: {
    height: 230,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: decklyColors.createPostImageBoxBorder,
  },
  placeholderText: {
    color: decklyColors.createPostImagePlaceholderText,
    fontWeight: "600",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 280,
    borderRadius: 14,
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  imageButtonsRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: decklyColors.createPostImageButtonBackground,
    borderColor: decklyColors.createPostImageButtonBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  imageButtonText: {
    color: decklyColors.createPostImageButtonText,
    fontWeight: "bold",
  },
  analyzeButton: {
    backgroundColor: decklyColors.createPostAnalyzeButtonBackground,
    borderColor: decklyColors.createPostAnalyzeButtonBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 12,
  },
  analyzeButtonText: {
    color: decklyColors.createPostAnalyzeButtonText,
    fontWeight: "bold",
  },
  formBox: {
    backgroundColor: decklyColors.createPostFormBackground,
    borderColor: decklyColors.createPostFormBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  label: {
    color: decklyColors.createPostLabel,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    backgroundColor: decklyColors.createPostInputBackground,
    borderColor: decklyColors.createPostInputBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: decklyColors.createPostInputText,
    marginBottom: 14,
  },
  readOnlyInput: {
    backgroundColor: decklyColors.createPostReadOnlyBackground,
    color: decklyColors.createPostReadOnlyText,
  },
  separator: {
    height: 1,
    backgroundColor: decklyColors.createPostSeparator,
    marginVertical: 10,
  },
  publishButton: {
    backgroundColor: decklyColors.createPostPublishButtonBackground,
    borderColor: decklyColors.createPostPublishButtonBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  publishButtonText: {
    color: decklyColors.createPostPublishButtonText,
    fontSize: 16,
    fontWeight: "bold",
  },
});