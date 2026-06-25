import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../components/BackButton";
import { decklyColors } from "../constants/decklyColors";

type OfficialCard = {
  id: string;
  name: string;
  set: string;
  number: string;
  category: string;
  image: string;
};

type Expansion = {
  id: string;
  name: string;
  subtitle: string;
  cards: OfficialCard[];
};

const expansions: Expansion[] = [
  {
    id: "sv03",
    name: "Obsidian Flames",
    subtitle: "Scarlet & Violet",
    cards: [
      {
        id: "sv03-125",
        name: "Charizard ex",
        set: "Obsidian Flames",
        number: "125/197",
        category: "Pokémon ex",
        image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
      },
      {
        id: "sv03-120",
        name: "Pidgeot ex",
        set: "Obsidian Flames",
        number: "120/197",
        category: "Pokémon ex",
        image: "https://assets.tcgdex.net/en/sv/sv03/120/low.png",
      },
    ],
  },
  {
    id: "sv05",
    name: "Temporal Forces",
    subtitle: "Scarlet & Violet",
    cards: [
      {
        id: "sv05-144",
        name: "Buddy-Buddy Poffin",
        set: "Temporal Forces",
        number: "144/162",
        category: "Entrenador",
        image: "https://assets.tcgdex.net/en/sv/sv05/144/low.png",
      },
      {
        id: "sv05-123",
        name: "Iron Leaves ex",
        set: "Temporal Forces",
        number: "123/162",
        category: "Pokémon ex",
        image: "https://assets.tcgdex.net/en/sv/sv05/123/low.png",
      },
    ],
  },
  {
    id: "swsh3",
    name: "Darkness Ablaze",
    subtitle: "Sword & Shield",
    cards: [
      {
        id: "swsh3-25",
        name: "Volcarona",
        set: "Darkness Ablaze",
        number: "025/189",
        category: "Fase 1",
        image: "https://assets.tcgdex.net/en/swsh/swsh3/25/low.png",
      },
    ],
  },
];

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();

  const [selectedExpansionId, setSelectedExpansionId] = useState<string | null>(
    null
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const selectedExpansion = useMemo(() => {
    return expansions.find((expansion) => expansion.id === selectedExpansionId);
  }, [selectedExpansionId]);

  const selectedCard = useMemo(() => {
    return selectedExpansion?.cards.find((card) => card.id === selectedCardId);
  }, [selectedExpansion, selectedCardId]);

  const handleSelectExpansion = (expansionId: string) => {
    setSelectedExpansionId(expansionId);
    setSelectedCardId(null);
  };

  const handleContinue = () => {
    if (!selectedCard) return;

    router.push({
      pathname: "/create-post-step-two",
      params: {
        cardId: selectedCard.id,
        name: selectedCard.name,
        set: selectedCard.set,
        number: selectedCard.number,
        category: selectedCard.category,
        image: selectedCard.image,
      },
    } as any);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 80,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backWrapper}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Crear publicación</Text>
        <Text style={styles.subtitle}>
          Paso 1: selecciona la carta oficial desde el catálogo.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Información del catálogo oficial</Text>
        <Text style={styles.blockDescription}>
          Elige una expansión y luego selecciona la carta que quieres publicar.
        </Text>

        <Text style={styles.label}>Expansión</Text>

        <View style={styles.optionsList}>
          {expansions.map((expansion) => (
            <Pressable
              key={expansion.id}
              style={[
                styles.optionCard,
                selectedExpansionId === expansion.id && styles.optionCardActive,
              ]}
              onPress={() => handleSelectExpansion(expansion.id)}
            >
              <Text
                style={[
                  styles.optionTitle,
                  selectedExpansionId === expansion.id &&
                    styles.optionTitleActive,
                ]}
              >
                {expansion.name}
              </Text>
              <Text
                style={[
                  styles.optionSubtitle,
                  selectedExpansionId === expansion.id &&
                    styles.optionSubtitleActive,
                ]}
              >
                {expansion.subtitle}
              </Text>
            </Pressable>
          ))}
        </View>

        {selectedExpansion && (
          <>
            <Text style={styles.label}>Carta oficial</Text>

            <View style={styles.cardsList}>
              {selectedExpansion.cards.map((card) => (
                <Pressable
                  key={card.id}
                  style={[
                    styles.officialCard,
                    selectedCardId === card.id && styles.officialCardActive,
                  ]}
                  onPress={() => setSelectedCardId(card.id)}
                >
                  <View style={styles.cardImageBox}>
                    <Image
                      source={{ uri: card.image }}
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text numberOfLines={1} style={styles.cardName}>
                      {card.name}
                    </Text>
                    <Text style={styles.cardDetail}>Set: {card.set}</Text>
                    <Text style={styles.cardDetail}>N° {card.number}</Text>
                    <Text style={styles.cardCategory}>{card.category}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>

      {selectedCard && (
        <View style={styles.previewBlock}>
          <Text style={styles.previewTitle}>Carta seleccionada</Text>

          <View style={styles.previewContent}>
            <Image
              source={{ uri: selectedCard.image }}
              style={styles.previewImage}
              resizeMode="contain"
            />

            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>{selectedCard.name}</Text>
              <Text style={styles.previewText}>{selectedCard.set}</Text>
              <Text style={styles.previewText}>N° {selectedCard.number}</Text>
              <Text style={styles.previewBadge}>{selectedCard.category}</Text>
            </View>
          </View>
        </View>
      )}

      <Pressable
        style={[
          styles.continueButton,
          !selectedCard && styles.continueButtonDisabled,
        ]}
        disabled={!selectedCard}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
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
    marginBottom: 6,
  },
  blockDescription: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  label: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 8,
  },
  optionsList: {
    gap: 10,
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  optionCardActive: {
    backgroundColor: "#dbeafe",
    borderColor: "#2563eb",
  },
  optionTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
  },
  optionTitleActive: {
    color: "#1e40af",
  },
  optionSubtitle: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },
  optionSubtitleActive: {
    color: "#1e40af",
  },
  cardsList: {
    gap: 12,
  },
  officialCard: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
  },
  officialCardActive: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  cardImageBox: {
    width: 76,
    height: 104,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 5,
  },
  cardDetail: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  cardCategory: {
    color: "#1e40af",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },
  previewBlock: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  previewTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewImage: {
    width: 100,
    height: 138,
    marginRight: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  previewText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  previewBadge: {
    color: "#1e40af",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 6,
  },
  continueButton: {
    backgroundColor: decklyColors.primary,
    borderColor: decklyColors.primaryDark,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  continueButtonDisabled: {
    opacity: 0.45,
  },
  continueButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
});