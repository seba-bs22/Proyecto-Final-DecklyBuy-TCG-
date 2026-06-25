import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
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

type Offer = {
  id: string;
  seller: string;
  condition: string;
  language: string;
  score: number;
  confidence: number;
  price: number;
  image: string;
};

const getParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
};

const fallbackCards = {
  "sv03-125": {
    name: "Charizard ex",
    set: "Obsidian Flames",
    number: "125/197",
    category: "Pokémon ex",
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
    description:
      "Carta Pokémon oficial perteneciente a la expansión Obsidian Flames.",
  },
  "sv05-144": {
    name: "Buddy-Buddy Poffin",
    set: "Temporal Forces",
    number: "144/162",
    category: "Entrenador",
    image: "https://assets.tcgdex.net/en/sv/sv05/144/low.png",
    description:
      "Carta de entrenador utilizada dentro del formato competitivo Pokémon TCG.",
  },
  "swsh3-25": {
    name: "Volcarona",
    set: "Darkness Ablaze",
    number: "025/189",
    category: "Fase 1",
    image: "https://assets.tcgdex.net/en/swsh/swsh3/25/low.png",
    description:
      "Carta Pokémon de la expansión Darkness Ablaze, mostrada como referencia oficial.",
  },
  "sv04-123": {
    name: "Pikachu",
    set: "Paradox Rift",
    number: "123/182",
    category: "Pokémon básico",
    image: "https://assets.tcgdex.net/en/sv/sv04/123/low.png",
    description:
      "Carta Pokémon básica usada como referencia dentro del catálogo oficial.",
  },
};

const offersBase: Offer[] = [
  {
    id: "offer-1",
    seller: "Sebastian",
    condition: "Near Mint",
    language: "Español",
    score: 9,
    confidence: 94,
    price: 15000,
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
  {
    id: "offer-2",
    seller: "Cristóbal",
    condition: "Lightly Played",
    language: "Inglés",
    score: 7,
    confidence: 88,
    price: 11800,
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
  {
    id: "offer-3",
    seller: "Ignacio",
    condition: "Moderately Played",
    language: "Japonés",
    score: 5,
    confidence: 81,
    price: 9200,
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
];

const conditionFilters = [
  "Todos",
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
];

const languageFilters = [
  "Todos",
  "Español",
  "Inglés",
  "Japonés",
  "Portugués",
];

const orderFilters = [
  { label: "Más barato", value: "price_asc" },
  { label: "Mayor precio", value: "price_desc" },
  { label: "Mejor IA", value: "score_desc" },
];

export default function CardPostsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const cardId = getParam(params.cardId);
  const paramName = getParam(params.name);
  const paramSet = getParam(params.set);
  const paramNumber = getParam(params.number);
  const paramCategory = getParam(params.category);
  const paramImage = getParam(params.image);

  const fallbackCard =
    fallbackCards[cardId as keyof typeof fallbackCards] ?? fallbackCards["sv03-125"];

  const card = {
    id: cardId || "sv03-125",
    name: paramName || fallbackCard.name,
    set: paramSet || fallbackCard.set,
    number: paramNumber || fallbackCard.number,
    category: paramCategory || fallbackCard.category,
    image: paramImage || fallbackCard.image,
    description: fallbackCard.description,
  };

  const [conditionFilter, setConditionFilter] = useState("Todos");
  const [languageFilter, setLanguageFilter] = useState("Todos");
  const [orderFilter, setOrderFilter] = useState("price_asc");
  const [wishlistOffers, setWishlistOffers] = useState<string[]>([]);

  const offers = useMemo(() => {
    let result = offersBase.map((offer) => ({
      ...offer,
      image: card.image,
    }));

    if (conditionFilter !== "Todos") {
      result = result.filter((offer) => offer.condition === conditionFilter);
    }

    if (languageFilter !== "Todos") {
      result = result.filter((offer) => offer.language === languageFilter);
    }

    if (orderFilter === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (orderFilter === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (orderFilter === "score_desc") {
      result.sort((a, b) => b.score - a.score);
    }

    return result;
  }, [card.image, conditionFilter, languageFilter, orderFilter]);

  const formatCLP = (value: number) => {
    return `$${value.toLocaleString("es-CL")} CLP`;
  };

  const toggleWishlist = (offerId: string) => {
    setWishlistOffers((current) => {
      if (current.includes(offerId)) {
        return current.filter((id) => id !== offerId);
      }

      return [...current, offerId];
    });
  };

  const addToCart = (offer: Offer) => {
    console.log("Agregar al carrito:", offer.id);

    Alert.alert(
      "Carrito",
      "Más adelante esta oferta se agregará al carrito real."
    );
  };

  const buyNow = (offer: Offer) => {
    console.log("Comprar ahora:", offer.id);

    Alert.alert(
      "Comprar ahora",
      "Más adelante este botón llevará directamente al pago."
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 110,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backWrapper}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{card.name}</Text>
        <Text style={styles.subtitle}>
          Información oficial de la carta y ofertas disponibles en el mercado.
        </Text>
      </View>

      <View style={styles.cardInfoBlock}>
        <View style={styles.officialImageBox}>
          <Image
            source={{ uri: card.image }}
            style={styles.officialImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.officialInfo}>
          <Text style={styles.officialName}>{card.name}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expansión</Text>
            <Text style={styles.infoValue}>{card.set}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número</Text>
            <Text style={styles.infoValue}>#{card.number}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Clasificación</Text>
            <Text style={styles.infoValue}>{card.category}</Text>
          </View>

          <Text style={styles.description}>{card.description}</Text>
        </View>
      </View>

      <View style={styles.marketHeader}>
        <Text style={styles.marketTitle}>Ofertas disponibles</Text>
        <Text style={styles.marketSubtitle}>
          Compara publicaciones de distintos vendedores.
        </Text>
      </View>

      <View style={styles.filtersBox}>
        <Text style={styles.filterTitle}>Estado</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {conditionFilters.map((condition) => (
            <Pressable
              key={condition}
              style={[
                styles.filterChip,
                conditionFilter === condition && styles.filterChipActive,
              ]}
              onPress={() => setConditionFilter(condition)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  conditionFilter === condition && styles.filterChipTextActive,
                ]}
              >
                {condition}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>Idioma</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {languageFilters.map((language) => (
            <Pressable
              key={language}
              style={[
                styles.filterChip,
                languageFilter === language && styles.filterChipActive,
              ]}
              onPress={() => setLanguageFilter(language)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  languageFilter === language && styles.filterChipTextActive,
                ]}
              >
                {language}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>Ordenar</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {orderFilters.map((order) => (
            <Pressable
              key={order.value}
              style={[
                styles.filterChip,
                orderFilter === order.value && styles.filterChipActive,
              ]}
              onPress={() => setOrderFilter(order.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  orderFilter === order.value && styles.filterChipTextActive,
                ]}
              >
                {order.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {offers.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Sin ofertas disponibles</Text>
          <Text style={styles.emptyText}>
            No hay publicaciones que coincidan con los filtros seleccionados.
          </Text>
        </View>
      ) : (
        <View style={styles.offersList}>
          {offers.map((offer) => {
            const isInWishlist = wishlistOffers.includes(offer.id);

            return (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerImageBox}>
                  <Image
                    source={{ uri: offer.image }}
                    style={styles.offerImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.offerInfo}>
                  <View style={styles.offerTopRow}>
                    <Text style={styles.sellerText}>{offer.seller}</Text>

                    <Text style={styles.priceText}>
                      {formatCLP(offer.price)}
                    </Text>
                  </View>

                  <Text style={styles.offerDetail}>
                    Estado IA: {offer.condition}
                  </Text>

                  <Text style={styles.offerDetail}>
                    Idioma: {offer.language}
                  </Text>

                  <View style={styles.scoreRow}>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>IA {offer.score}/10</Text>
                    </View>

                    <Text style={styles.confidenceText}>
                      Confianza {offer.confidence}%
                    </Text>
                  </View>

                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.iconButton}
                      onPress={() => toggleWishlist(offer.id)}
                    >
                      <Image
                        source={
                          isInWishlist
                            ? require("../assets/images/icons/wishlist-full.png")
                            : require("../assets/images/icons/wishlist.png")
                        }
                        style={styles.actionIcon}
                        resizeMode="contain"
                      />
                    </Pressable>

                    <Pressable
                      style={styles.iconButton}
                      onPress={() => addToCart(offer)}
                    >
                      <Image
                        source={require("../assets/images/icons/cart.png")}
                        style={styles.actionIcon}
                        resizeMode="contain"
                      />
                    </Pressable>

                    <Pressable
                      style={styles.buyButton}
                      onPress={() => buyNow(offer)}
                    >
                      <Text style={styles.buyButtonText}>Comprar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
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
  cardInfoBlock: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 26,
  },
  officialImageBox: {
    height: 300,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    overflow: "hidden",
  },
  officialImage: {
    width: "100%",
    height: "100%",
  },
  officialInfo: {
    gap: 10,
  },
  officialName: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 4,
  },
  infoRow: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
  },
  description: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  marketHeader: {
    marginBottom: 14,
  },
  marketTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },
  marketSubtitle: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 5,
  },
  filtersBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  filterTitle: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 4,
  },
  filterRow: {
    gap: 10,
    paddingRight: 8,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  filterChipText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  offersList: {
    gap: 14,
  },
  offerCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
  },
  offerImageBox: {
    width: 92,
    height: 126,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 14,
  },
  offerImage: {
    width: "100%",
    height: "100%",
  },
  offerInfo: {
    flex: 1,
  },
  offerTopRow: {
    marginBottom: 6,
  },
  sellerText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 3,
  },
  priceText: {
    color: "#b91c1c",
    fontSize: 17,
    fontWeight: "900",
  },
  offerDetail: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  scoreBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  scoreText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "900",
  },
  confidenceText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    width: 21,
    height: 21,
  },
  buyButton: {
    flex: 1,
    backgroundColor: decklyColors.primary,
    borderColor: decklyColors.primaryDark,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  emptyBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 26,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});