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
import WishlistButton from "../../components/WishlistButton";
import { decklyColors } from "../../constants/decklyColors";

type LocalPost = {
  id: number;
  nombre: string;
  edicion: string;
  numero: string;
  precio: number;
  estadoDetectado: string;
  score: number;
  cardImage?: string;
};

const postsBase: LocalPost[] = [
  {
    id: 1,
    nombre: "Volcarona",
    edicion: "Juntos de Aventuras",
    numero: "029/159",
    precio: 300,
    estadoDetectado: "Near Mint",
    score: 9,
  },
  {
    id: 2,
    nombre: "Buddy-Buddy Poffin",
    edicion: "Evoluciones Prismáticas",
    numero: "101/131",
    precio: 200,
    estadoDetectado: "Moderately Played",
    score: 5,
  },
  {
    id: 3,
    nombre: "Charizard EX",
    edicion: "Scarlet & Violet",
    numero: "125/197",
    precio: 15000,
    estadoDetectado: "Lightly Played",
    score: 7,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [isScrolled, setIsScrolled] = useState(false);

  const headerHeight = 78 + insets.top;

  const formatCLP = (value?: number) => {
    if (!value) return "$0 CLP";

    return `$${value.toLocaleString("es-CL")} CLP`;
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 20);
  };

  const getScoreColor = (score?: number) => {
    if (score === 10) return decklyColors.homeScoreMintBackground;
    if (score === 9) return decklyColors.homeScoreNearMintBackground;
    if (score === 7) return decklyColors.homeScoreLightlyPlayedBackground;
    if (score === 5) return decklyColors.homeScoreModeratelyPlayedBackground;
    if (score === 3) return decklyColors.homeScoreHeavilyPlayedBackground;
    if (score === 1) return decklyColors.homeScoreDamagedBackground;

    return decklyColors.homeScoreDamagedBackground;
  };

  const adaptPostToWishlist = (post: LocalPost) => {
    return {
      id: post.id,
      name: post.nombre,
      edition: post.edicion,
      condition: post.estadoDetectado,
      price: formatCLP(post.precio),
    };
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
            <Text style={styles.searchText}>
              Buscar cartas o publicaciones...
            </Text>
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
        <Text style={styles.sectionTitle}>Recientes</Text>

        <View style={styles.postsContainer}>
          {postsBase.map((post) => (
            <Pressable key={post.id} style={styles.postCard}>
              <View style={styles.imageBox}>
                {post.cardImage ? (
                  <Image
                    source={{ uri: post.cardImage }}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.imageText}>Carta</Text>
                )}
              </View>

              <View style={styles.postInfo}>
                <View>
                  <View style={styles.titleRow}>
                    <Text numberOfLines={1} style={styles.cardTitle}>
                      {post.nombre}
                    </Text>

                    <View
                      style={[
                        styles.scoreCircle,
                        {
                          backgroundColor: getScoreColor(post.score),
                        },
                      ]}
                    >
                      <Text style={styles.scoreCircleText}>{post.score}</Text>
                    </View>
                  </View>

                  <Text numberOfLines={1} style={styles.cardInfo}>
                    Edición: {post.edicion}
                  </Text>

                  <Text numberOfLines={1} style={styles.cardInfo}>
                    #{post.numero}
                  </Text>

                  <Text numberOfLines={1} style={styles.conditionText}>
                    {post.estadoDetectado}
                  </Text>
                </View>

                <View style={styles.bottomRow}>
                  <Text style={styles.cardPrice}>{formatCLP(post.precio)}</Text>

                  <WishlistButton post={adaptPostToWishlist(post)} />
                </View>
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
    marginBottom: 16,
  },
  postsContainer: {
    gap: 14,
  },
  postCard: {
    backgroundColor: decklyColors.homeCardBackground,
    borderColor: decklyColors.homeCardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
  },
  imageBox: {
    width: 82,
    height: 108,
    backgroundColor: decklyColors.homeCardImageBackground,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  imageText: {
    color: decklyColors.homeCardImageText,
    fontWeight: "bold",
  },
  postInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    color: decklyColors.homeCardTitle,
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCircleText: {
    color: decklyColors.homeScoreText,
    fontSize: 13,
    fontWeight: "900",
  },
  cardInfo: {
    color: decklyColors.homeCardInfo,
    marginTop: 4,
    fontSize: 13,
  },
  conditionText: {
    color: decklyColors.homeCardTitle,
    marginTop: 7,
    fontSize: 15,
    fontWeight: "800",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardPrice: {
    color: decklyColors.homeCardPrice,
    fontSize: 17,
    fontWeight: "bold",
  },
});