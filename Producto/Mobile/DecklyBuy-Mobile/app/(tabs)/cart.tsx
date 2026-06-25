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

type CartItem = {
  id: string;
  name: string;
  edition: string;
  number: string;
  condition: string;
  score: number;
  price: number;
  quantity: number;
  seller: string;
  image: string;
};

const initialCartItems: CartItem[] = [
  {
    id: "cart-1",
    name: "Charizard ex",
    edition: "Obsidian Flames",
    number: "125/197",
    condition: "Near Mint",
    score: 9,
    price: 15000,
    quantity: 1,
    seller: "Sebastian",
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
  {
    id: "cart-2",
    name: "Buddy-Buddy Poffin",
    edition: "Temporal Forces",
    number: "144/162",
    condition: "Lightly Played",
    score: 7,
    price: 3200,
    quantity: 1,
    seller: "Cristóbal",
    image: "https://assets.tcgdex.net/en/sv/sv05/144/low.png",
  },
];

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  const shipping = cartItems.length > 0 ? 2990 : 0;
  const total = subtotal + shipping;

  const formatCLP = (value: number) => {
    return `$${value.toLocaleString("es-CL")} CLP`;
  };

  const removeItem = (id: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
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
        <Text style={styles.title}>Carrito de compras</Text>
        <Text style={styles.subtitle}>
          Revisa las cartas agregadas antes de continuar con el pedido.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cartas en el carrito</Text>

        {cartItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyText}>
              Agrega publicaciones de cartas para verlas aquí.
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <View style={styles.imageBox}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.itemInfo}>
                  <View>
                    <Text numberOfLines={1} style={styles.cardName}>
                      {item.name}
                    </Text>

                    <Text numberOfLines={1} style={styles.cardDetail}>
                      {item.edition} • #{item.number}
                    </Text>

                    <Text style={styles.cardDetail}>
                      Estado: {item.condition}
                    </Text>

                    <Text style={styles.cardDetail}>IA: {item.score}/10</Text>

                    <Text style={styles.sellerText}>
                      Vendedor: {item.seller}
                    </Text>
                  </View>

                  <View style={styles.bottomRow}>
                    <View>
                      <Text style={styles.priceLabel}>Precio</Text>
                      <Text style={styles.priceText}>
                        {formatCLP(item.price)}
                      </Text>
                    </View>

                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Resumen del pedido</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Productos</Text>
          <Text style={styles.summaryValue}>{cartItems.length}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCLP(subtotal)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío estimado</Text>
          <Text style={styles.summaryValue}>{formatCLP(shipping)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCLP(total)}</Text>
        </View>

        <Pressable
          style={[
            styles.checkoutButton,
            cartItems.length === 0 && styles.checkoutButtonDisabled,
          ]}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.checkoutButtonText}>Continuar pedido</Text>
        </Pressable>
      </View>
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
    marginBottom: 24,
  },
  title: {
    color: "#0f172a",
    fontSize: 27,
    fontWeight: "900",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  itemsList: {
    gap: 14,
  },
  cartCard: {
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
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
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
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 10,
  },
  priceLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "900",
  },
  priceText: {
    color: "#b91c1c",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: "900",
  },
  summaryBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  summaryTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "700",
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  totalLabel: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
  },
  totalValue: {
    color: "#b91c1c",
    fontSize: 18,
    fontWeight: "900",
  },
  checkoutButton: {
    backgroundColor: "#f4b400",
    borderColor: "#d99a00",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  checkoutButtonDisabled: {
    opacity: 0.45,
  },
  checkoutButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
  emptyBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
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