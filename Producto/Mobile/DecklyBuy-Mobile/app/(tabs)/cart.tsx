import { ScrollView, StyleSheet, Text, View } from "react-native";
import { decklyColors } from "../../constants/decklyColors";

const cartItems = [
  {
    id: 1,
    name: "Charizard VMAX",
    condition: "Near Mint",
    price: "$45.000",
  },
  {
    id: 2,
    name: "Pikachu Promo",
    condition: "Lightly Played",
    price: "$18.000",
  },
  {
    id: 3,
    name: "Mewtwo EX",
    condition: "Moderately Played",
    price: "$22.000",
  },
];

export default function CartScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Carrito</Text>

      <Text style={styles.subtitle}>
        Revisa las cartas agregadas antes de continuar con la compra.
      </Text>

      <View style={styles.itemsContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartCard}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Carta</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardCondition}>Estado: {item.condition}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total estimado</Text>
        <Text style={styles.totalPrice}>$85.000</Text>
      </View>

      <View style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>Continuar compra</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: decklyColors.cartBackground,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    color: decklyColors.cartTitle,
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 35,
    textAlign: "center",
  },
  subtitle: {
    color: decklyColors.cartSubtitle,
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
    lineHeight: 21,
  },
  itemsContainer: {
    gap: 14,
  },
  cartCard: {
    backgroundColor: decklyColors.cartItemBackground,
    borderColor: decklyColors.cartItemBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
  },
  imagePlaceholder: {
    width: 82,
    height: 108,
    backgroundColor: decklyColors.cartImageBackground,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  imageText: {
    color: decklyColors.cartImageText,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    color: decklyColors.cartItemName,
    fontSize: 18,
    fontWeight: "bold",
  },
  cardCondition: {
    color: decklyColors.cartItemCondition,
    marginTop: 6,
  },
  cardPrice: {
    color: decklyColors.cartItemPrice,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  totalBox: {
    backgroundColor: decklyColors.cartTotalBackground,
    borderColor: decklyColors.cartTotalBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginTop: 22,
  },
  totalLabel: {
    color: decklyColors.cartTotalLabel,
    fontSize: 15,
  },
  totalPrice: {
    color: decklyColors.cartTotalPrice,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  checkoutButton: {
    backgroundColor: decklyColors.cartButtonBackground,
    borderColor: decklyColors.cartButtonBorder,
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },
  checkoutText: {
    color: decklyColors.cartButtonText,
    fontSize: 16,
    fontWeight: "bold",
  },
});