import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../components/BackButton";
import { decklyColors } from "../constants/decklyColors";

const getParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
};

const internalClassificationOptions = [
  "Pokémon básico",
  "Fase 1",
  "Fase 2",
  "Pokémon ex",
  "Pokémon V",
  "Pokémon VMAX",
  "Entrenador",
  "Energía",
];

const officialLanguageOptions = [
  "Español",
  "Inglés",
  "Japonés",
  "Portugués",
  "Francés",
  "Alemán",
  "Italiano",
];

export default function CreatePostStepTwoScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const cardId = getParam(params.cardId);
  const name = getParam(params.name);
  const set = getParam(params.set);
  const number = getParam(params.number);
  const category = getParam(params.category);
  const image = getParam(params.image);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [internalClassification, setInternalClassification] = useState("");
  const [officialLanguage, setOfficialLanguage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePublish = () => {
    if (!photoUri) {
      Alert.alert("Falta imagen", "Agrega una foto de la carta para continuar.");
      return;
    }

    if (!internalClassification) {
      Alert.alert(
        "Falta clasificación",
        "Selecciona la clasificación interna de la carta."
      );
      return;
    }

    if (!officialLanguage) {
      Alert.alert("Falta idioma", "Selecciona el idioma oficial de la carta.");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Falta precio", "Ingresa el precio de venta.");
      return;
    }

    console.log("Publicar:", {
      cardId,
      name,
      set,
      number,
      category,
      internalClassification,
      officialLanguage,
      photoUri,
      price,
      description,
    });

    Alert.alert(
      "Publicación base",
      "Más adelante este botón enviará la publicación al backend."
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 90,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backWrapper}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Tu publicación</Text>
        <Text style={styles.subtitle}>
          Paso 2: agrega la foto real de tu carta, completa los datos de venta y
          prepara el análisis de calidad.
        </Text>
      </View>

      <View style={styles.officialBlock}>
        <Text style={styles.blockTitle}>Carta oficial seleccionada</Text>

        <View style={styles.officialContent}>
          <Image
            source={{ uri: image }}
            style={styles.officialImage}
            resizeMode="contain"
          />

          <View style={styles.officialInfo}>
            <Text style={styles.officialName}>{name}</Text>
            <Text style={styles.officialText}>Set: {set}</Text>
            <Text style={styles.officialText}>N° {number}</Text>
            <Text style={styles.officialCategory}>{category}</Text>
          </View>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Foto de tu carta</Text>
        <Text style={styles.blockDescription}>
          Agrega una imagen real de la carta que venderás. Luego esta imagen será
          analizada por la IA.
        </Text>

        <View style={styles.photoBox}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.photoPreview}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.photoPlaceholder}>Sin imagen seleccionada</Text>
          )}
        </View>

        <View style={styles.photoActions}>
          <Pressable style={styles.secondaryButton} onPress={pickFromGallery}>
            <Text style={styles.secondaryButtonText}>Galería</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={takePhoto}>
            <Text style={styles.secondaryButtonText}>Cámara</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Análisis de calidad</Text>

        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitle}>Estado IA</Text>
          <Text style={styles.analysisText}>
            Pendiente de análisis. Cuando conectemos el servicio IA, aquí se
            mostrará el estado detectado, score y confianza.
          </Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Datos de venta</Text>

        <Text style={styles.label}>Clasificación interna</Text>

        <View style={styles.chipContainer}>
          {internalClassificationOptions.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.choiceChip,
                internalClassification === option && styles.choiceChipActive,
              ]}
              onPress={() => setInternalClassification(option)}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  internalClassification === option &&
                    styles.choiceChipTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Idioma oficial</Text>

        <View style={styles.chipContainer}>
          {officialLanguageOptions.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.choiceChip,
                officialLanguage === option && styles.choiceChipActive,
              ]}
              onPress={() => setOfficialLanguage(option)}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  officialLanguage === option && styles.choiceChipTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Precio</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Ej: 15000"
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe detalles, estado o información adicional..."
          style={[styles.input, styles.textArea]}
          multiline
          placeholderTextColor="#94a3b8"
        />
      </View>

      <Pressable style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishButtonText}>Publicar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 18,
  },
  backWrapper: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  header: {
    marginBottom: 22,
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  officialBlock: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  officialContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  officialImage: {
    width: 100,
    height: 138,
    marginRight: 16,
  },
  officialInfo: {
    flex: 1,
  },
  officialName: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  officialText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  officialCategory: {
    color: "#1e40af",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 6,
  },
  block: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  blockTitle: {
    color: "#0f172a",
    fontSize: 19,
    fontWeight: "900",
  },
  blockDescription: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  photoBox: {
    height: 230,
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
  },
  photoActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#dbeafe",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1e40af",
    fontWeight: "900",
  },
  analysisBox: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  analysisTitle: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 6,
  },
  analysisText: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  choiceChip: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  choiceChipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  choiceChipText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
  },
  choiceChipTextActive: {
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "600",
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  publishButton: {
    backgroundColor: decklyColors.primary,
    borderColor: decklyColors.primaryDark,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  publishButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
});