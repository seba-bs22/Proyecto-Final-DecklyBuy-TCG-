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
import { decklyColors } from "../../constants/decklyColors";

type CardReference = {
  id: string;
  name: string;
  set: string;
  number: string;
  image?: string;
};

const cardsBase: CardReference[] = [
  {
    id: "swsh3-25",
    name: "Volcarona",
    set: "Darkness Ablaze",
    number: "025/189",
    image: "https://assets.tcgdex.net/en/swsh/swsh3/25/low.png",
  },
  {
    id: "sv05-144",
    name: "Buddy-Buddy Poffin",
    set: "Temporal Forces",
    number: "144/162",
    image: "https://assets.tcgdex.net/en/sv/sv05/144/low.png",
  },
  {
    id: "sv03-125",
    name: "Charizard ex",
    set: "Obsidian Flames",
    number: "125/197",
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
  {
    id: "sv04-123",
    name: "Pikachu",
    set: "Paradox Rift",
    number: "123/182",
    image: "https://assets.tcgdex.net/en/sv/sv04/123/low.png",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isScrolled, setIsScrolled] = useState(false);

  const headerHeight = 78 + insets.top;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 20);
  };

  const handleCardPress = (card: CardReference) => {
    router.push({
      pathname: "/card-posts",
      params: {
        cardId: card.id,
        name: card.name,
        set: card.set,
        number: card.number,
        image: card.image ?? "",
      },
    } as any);
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            height: headerHeight,
            backgroundColor: isScrolled
              ? decklyColors.homeHeaderScrolledBackground
              : decklyColors.homeHeaderTopBackground,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isScrolled
                  ? decklyColors.homeSearchScrolledBackground
                  : decklyColors.homeSearchBackground,
              },
            ]}
          >
            <Text style={styles.searchText}>Buscar cartas...</Text>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => router.push("/notifications" as any)}
          >
            <Image
              source={require("../../assets/images/icons/notifications.png")}
              style={styles.notificationIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + 22,
          },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Cartas disponibles</Text>

        <Text style={styles.sectionDescription}>
          Selecciona una carta para ver las publicaciones asociadas.
        </Text>

        <View style={styles.cardsGrid}>
          {cardsBase.map((card) => (
            <Pressable
              key={card.id}
              style={({ pressed }) => [
                styles.cardReference,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleCardPress(card)}
            >
              <View style={styles.imageBox}>
                {card.image ? (
                  <Image
                    source={{ uri: card.image }}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.imageText}>Carta</Text>
                )}
              </View>

              <View style={styles.cardInfoBox}>
                <Text numberOfLines={2} style={styles.cardName}>
                  {card.name}
                </Text>

                <Text numberOfLines={1} style={styles.cardSet}>
                  Set: {card.set}
                </Text>

                <Text numberOfLines={1} style={styles.cardNumber}>
                  N° {card.number}
                </Text>

                <Text style={styles.viewPostsText}>Ver publicaciones</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: decklyColors.homeBackground,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: 1,
    borderBottomColor: decklyColors.homeHeaderBorder,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  searchBox: {
    flex: 1,
    borderColor: decklyColors.homeSearchBorder,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginRight: 12,
  },
  searchText: {
    color: decklyColors.homeSearchText,
    fontSize: 14,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: decklyColors.homeNotificationBackground,
    borderColor: decklyColors.homeNotificationBorder,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: decklyColors.homeNotificationIcon,
  },
  container: {
    flex: 1,
    backgroundColor: decklyColors.homeBackground,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    color: decklyColors.homeSectionTitle,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionDescription: {
    color: decklyColors.homeCardInfo,
    fontSize: 14,
    marginBottom: 18,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  cardReference: {
    width: "48%",
    backgroundColor: decklyColors.homeCardBackground,
    borderColor: decklyColors.homeCardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 260,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  imageBox: {
    height: 150,
    backgroundColor: decklyColors.homeCardImageBackground,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  imageText: {
    color: decklyColors.homeCardImageText,
    fontWeight: "bold",
  },
  cardInfoBox: {
    flex: 1,
  },
  cardName: {
    color: decklyColors.homeCardTitle,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardSet: {
    color: decklyColors.homeCardInfo,
    fontSize: 13,
    marginBottom: 4,
  },
  cardNumber: {
    color: decklyColors.homeCardInfo,
    fontSize: 13,
    marginBottom: 10,
  },
  viewPostsText: {
    color: decklyColors.homeCardPrice,
    fontSize: 13,
    fontWeight: "bold",
    marginTop: "auto",
  },
});