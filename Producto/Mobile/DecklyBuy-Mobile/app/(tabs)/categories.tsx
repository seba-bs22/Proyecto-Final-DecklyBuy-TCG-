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
import { decklyColors } from "../../constants/decklyColors";

type CatalogCard = {
  id: string;
  name: string;
  edition: string;
  number: string;
  category: string;
  condition: string;
  price: number;
  score: number;
  image: string;
};

const catalogBase: CatalogCard[] = [
  {
    id: "sv03-125",
    name: "Charizard ex",
    edition: "Obsidian Flames",
    number: "125/197",
    category: "ex",
    condition: "Near Mint",
    price: 15000,
    score: 9,
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
  {
    id: "sv05-144",
    name: "Buddy-Buddy Poffin",
    edition: "Temporal Forces",
    number: "144/162",
    category: "Trainer",
    condition: "Lightly Played",
    price: 3200,
    score: 7,
    image: "https://assets.tcgdex.net/en/sv/sv05/144/low.png",
  },
  {
    id: "swsh3-25",
    name: "Volcarona",
    edition: "Darkness Ablaze",
    number: "025/189",
    category: "Fase 1",
    condition: "Moderately Played",
    price: 900,
    score: 5,
    image: "https://assets.tcgdex.net/en/swsh/swsh3/25/low.png",
  },
  {
    id: "sv04-123",
    name: "Pikachu",
    edition: "Paradox Rift",
    number: "123/182",
    category: "Basico",
    condition: "Near Mint",
    price: 2500,
    score: 9,
    image: "https://assets.tcgdex.net/en/sv/sv04/123/low.png",
  },
  {
    id: "sv01-257",
    name: "Miraidon ex",
    edition: "Scarlet & Violet",
    number: "257/198",
    category: "ex",
    condition: "Heavily Played",
    price: 7800,
    score: 3,
    image: "https://assets.tcgdex.net/en/sv/sv01/257/low.png",
  },
  {
    id: "sv02-196",
    name: "Basic Lightning Energy",
    edition: "Paldea Evolved",
    number: "196/193",
    category: "Energia",
    condition: "Damaged",
    price: 500,
    score: 1,
    image: "https://assets.tcgdex.net/en/sv/sv02/196/low.png",
  },
];

const categoryFilters = [
  { label: "✨ Todos", value: "TODOS" },
  { label: "🃏 Básico", value: "Basico" },
  { label: "🔺 Fase 1", value: "Fase 1" },
  { label: "🔥 Fase 2", value: "Fase 2" },
  { label: "✨ ex", value: "ex" },
  { label: "⚡ Pokémon V", value: "V" },
  { label: "💥 VMAX", value: "VMAX" },
  { label: "🛡️ Entrenadores", value: "Trainer" },
  { label: "🔋 Energías", value: "Energia" },
];

const conditionFilters = [
  { label: "Cualquier estado", value: "TODOS" },
  { label: "Near Mint", value: "Near Mint" },
  { label: "Lightly Played", value: "Lightly Played" },
  { label: "Moderately Played", value: "Moderately Played" },
  { label: "Heavily Played", value: "Heavily Played" },
  { label: "Damaged", value: "Damaged" },
];

const orderFilters = [
  { label: "Más recientes", value: "recientes" },
  { label: "Menor precio", value: "precio_asc" },
  { label: "Mayor precio", value: "precio_desc" },
  { label: "Mejor IA", value: "score_desc" },
];

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState("TODOS");
  const [condition, setCondition] = useState("TODOS");
  const [order, setOrder] = useState("recientes");

  const filteredCards = useMemo(() => {
    let result = [...catalogBase];

    if (category !== "TODOS") {
      result = result.filter((card) => card.category === category);
    }

    if (condition !== "TODOS") {
      result = result.filter((card) => card.condition === condition);
    }

    if (order === "precio_asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (order === "precio_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (order === "score_desc") {
      result.sort((a, b) => b.score - a.score);
    }

    return result;
  }, [category, condition, order]);

  const formatCLP = (value: number) => {
    return `$${value.toLocaleString("es-CL")} CLP`;
  };

  const handleCardPress = (card: CatalogCard) => {
    router.push({
      pathname: "/card-posts",
      params: {
        cardId: card.id,
        name: card.name,
        set: card.edition,
        number: card.number,
        category: card.category,
        image: card.image,
      },
    } as any);
  };

  const resetFilters = () => {
    setCategory("TODOS");
    setCondition("TODOS");
    setOrder("recientes");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>MERCADO GLOBAL</Text>
        <Text style={styles.subtitle}>
          Busca cartas oficiales y explora ofertas disponibles en la comunidad.
        </Text>
      </View>

      <View style={styles.filtersBox}>
        <Text style={styles.filterTitle}>FILTRAR POR CLASIFICACIÓN</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {categoryFilters.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.filterChip,
                category === item.value && styles.filterChipActive,
              ]}
              onPress={() => setCategory(item.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  category === item.value && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        <Text style={styles.filterTitle}>ESTADO FÍSICO IA</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {conditionFilters.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.filterChip,
                condition === item.value && styles.filterChipActive,
              ]}
              onPress={() => setCondition(item.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  condition === item.value && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        <Text style={styles.filterTitle}>ORDENAR POR</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {orderFilters.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.filterChip,
                order === item.value && styles.filterChipActive,
              ]}
              onPress={() => setOrder(item.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  order === item.value && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {filteredCards.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            No se encontraron cartas con los filtros seleccionados.
          </Text>

          <Pressable style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Restablecer filtros</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredCards.map((card) => (
            <Pressable
              key={card.id}
              style={({ pressed }) => [
                styles.catalogCard,
                pressed && styles.catalogCardPressed,
              ]}
              onPress={() => handleCardPress(card)}
            >
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: card.image }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{card.category}</Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <View>
                  <Text numberOfLines={1} style={styles.cardName}>
                    {card.name}
                  </Text>

                  <Text numberOfLines={1} style={styles.cardEdition}>
                    {card.edition} • #{card.number}
                  </Text>
                </View>

                <View style={styles.bottomBox}>
                  <View>
                    <Text style={styles.priceLabel}>DESDE:</Text>
                    <Text style={styles.priceText}>{formatCLP(card.price)}</Text>
                  </View>

                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>⭐ IA: {card.score}/10</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: decklyColors.homeBackground,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "#0f172a",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  filtersBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  filterTitle: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
  },
  filterRow: {
    gap: 10,
    paddingRight: 8,
  },
  filterChip: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  filterChipText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
  },
  emptyBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 22,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
  },
  resetButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 16,
  },
  resetButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  grid: {
    gap: 18,
  },
  catalogCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  catalogCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  imageBox: {
    height: 260,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomColor: "#f1f5f9",
    borderBottomWidth: 1,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    color: "#1e40af",
    fontSize: 11,
    fontWeight: "900",
  },
  infoBox: {
    padding: 16,
    gap: 14,
  },
  cardName: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },
  cardEdition: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },
  bottomBox: {
    borderTopColor: "#f1f5f9",
    borderTopWidth: 1,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "900",
  },
  priceText: {
    color: "#b91c1c",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  scoreText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "900",
  },
});