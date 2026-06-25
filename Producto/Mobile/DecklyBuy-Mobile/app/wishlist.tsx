import { router } from "expo-router";
import { useState } from "react";
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

type WishlistItem = {
  id: string;
  cardName: string;
  edition: string;
  number: string;
  condition: string;
  score: number;
  price: number;
  seller: string;
  image: string;
};

const initialWishlistItems: WishlistItem[] = [
  {
    id: "wishlist-1",
    cardName: "Charizard ex",
    edition: "Obsidian Flames",
    number: "125/197",
    condition: "Near Mint",
    score: 9,
    price: 15000,
    seller: "Sebastian",
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
  {
    id: "wishlist-2",
    cardName: "Buddy-Buddy Poffin",
    edition: "Temporal Forces",
    number: "144/162",
    condition: "Lightly Played",
    score: 7,
    price: 3200,
    seller: "Cristóbal",
    image: "https://assets.tcgdex.net/en/sv/sv05/144/low.png",
  },
  {
    id: "wishlist-3",
    cardName: "Volcarona",
    edition: "Darkness Ablaze",
    number: "025/189",
    condition: "Moderately Played",
    score: 5,
    price: 900,
    seller: "Ignacio",
    image: "https://assets.tcgdex.net/en/swsh/swsh3/25/low.png",
  },
];

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(
    initialWishlistItems
  );

  const formatCLP = (value: number) => {
    return `$${value.toLocaleString("es-CL")} CLP`;
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const handleViewPost = (item: WishlistItem) => {
    router.push({
      pathname: "/card-posts",
      params: {
        cardId: item.id,
        name: item.cardName,
        set: item.edition,
        number: item.number,
        image: item.image,
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
          paddingBottom: insets.bottom + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backWrapper}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Lista de deseados</Text>
        <Text style={styles.subtitle}>
          Revisa las publicaciones que guardaste para verlas o comprarlas más
          adelante.
        </Text>
      </View>

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No tienes cartas guardadas</Text>
          <Text style={styles.emptyText}>
            Cuando guardes una publicación, aparecerá en esta sección.
          </Text>
        </View>
      ) : (
        <View style={styles.wishlistList}>
          {wishlistItems.map((item) => (
            <View key={item.id} style={styles.wishlistCard}>
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.infoBox}>
                <Text numberOfLines={1} style={styles.cardName}>
                  {item.cardName}
                </Text>

                <Text numberOfLines={1} style={styles.cardDetail}>
                  {item.edition} • #{item.number}
                </Text>

                <Text style={styles.cardDetail}>
                  Estado IA: {item.condition}
                </Text>

                <Text style={styles.cardDetail}>Score: {item.score}/10</Text>

                <Text style={styles.sellerText}>Vendedor: {item.seller}</Text>

                <Text style={styles.priceText}>{formatCLP(item.price)}</Text>

                <View style={styles.actionsRow}>
                  <Pressable
                    style={styles.viewButton}
                    onPress={() => handleViewPost(item)}
                  >
                    <Text style={styles.viewButtonText}>Ver publicación</Text>
                  </Pressable>

                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeFromWishlist(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Quitar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
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
  wishlistList: {
    gap: 14,
  },
  wishlistCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
  },
  imageBox: {
    width: 92,
    height: 126,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 14,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  infoBox: {
    flex: 1,
  },
  cardName: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },
  cardDetail: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  sellerText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  priceText: {
    color: "#b91c1c",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 7,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: decklyColors.primary,
    borderColor: decklyColors.primaryDark,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  removeButton: {
    flex: 1,
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#b91c1c",
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