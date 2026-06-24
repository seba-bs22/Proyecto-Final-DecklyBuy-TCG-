import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import WishlistButton from "../components/WishlistButton";
import { decklyColors } from "../constants/decklyColors";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistScreen() {
  const { wishlist } = useWishlist();

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.replace("/(tabs)/profile" as any)} />

      <View style={styles.content}>
        <Text style={styles.title}>Lista de deseados</Text>

        {wishlist.length === 0 ? (
          <>
            <Text style={styles.emptyText}>
              Aún no tienes productos en tu lista.
            </Text>

            <Text style={styles.helperText}>
              Agrégalos haciendo click en el marcador de un producto.
            </Text>
          </>
        ) : (
          <View style={styles.itemsContainer}>
            {wishlist.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageText}>Carta</Text>
                </View>

                <View style={styles.postInfo}>
                  <View>
                    <Text style={styles.cardName}>{post.name}</Text>
                    <Text style={styles.cardInfo}>Edición: {post.edition}</Text>
                    <Text style={styles.cardInfo}>Estado: {post.condition}</Text>
                  </View>

                  <View style={styles.bottomRow}>
                    <Text style={styles.cardPrice}>{post.price}</Text>
                    <WishlistButton post={post} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: decklyColors.wishlistBackground,
    padding: 20,
  },
  content: {
    flex: 1,
    paddingTop: 30,
  },
  title: {
    color: decklyColors.wishlistTitle,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyText: {
    color: decklyColors.wishlistText,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 180,
  },
  helperText: {
    color: decklyColors.wishlistMutedText,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  itemsContainer: {
    gap: 14,
  },
  postCard: {
    backgroundColor: decklyColors.wishlistCardBackground,
    borderColor: decklyColors.wishlistCardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
  },
  imagePlaceholder: {
    width: 82,
    height: 108,
    backgroundColor: decklyColors.wishlistImageBackground,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  imageText: {
    color: decklyColors.wishlistImageText,
    fontWeight: "bold",
  },
  postInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardName: {
    color: decklyColors.wishlistItemName,
    fontSize: 18,
    fontWeight: "bold",
  },
  cardInfo: {
    color: decklyColors.wishlistItemInfo,
    marginTop: 5,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardPrice: {
    color: decklyColors.wishlistItemPrice,
    fontSize: 18,
    fontWeight: "bold",
  },
});