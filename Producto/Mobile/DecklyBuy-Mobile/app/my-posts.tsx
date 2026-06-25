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

type MyPost = {
  id: string;
  cardName: string;
  edition: string;
  number: string;
  condition: string;
  score: number;
  price: number;
  image: string;
};

const initialPosts: MyPost[] = [
  {
    id: "post-1",
    cardName: "Charizard ex",
    edition: "Obsidian Flames",
    number: "125/197",
    condition: "Near Mint",
    score: 9,
    price: 15000,
    image: "https://assets.tcgdex.net/en/sv/sv03/125/low.png",
  },
  {
    id: "post-2",
    cardName: "Buddy-Buddy Poffin",
    edition: "Temporal Forces",
    number: "144/162",
    condition: "Lightly Played",
    score: 7,
    price: 3200,
    image: "https://assets.tcgdex.net/en/sv/sv05/144/low.png",
  },
  {
    id: "post-3",
    cardName: "Volcarona",
    edition: "Darkness Ablaze",
    number: "025/189",
    condition: "Moderately Played",
    score: 5,
    price: 900,
    image: "https://assets.tcgdex.net/en/swsh/swsh3/25/low.png",
  },
];

export default function MyPostsScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<MyPost[]>(initialPosts);

  const formatCLP = (value: number) => {
    return `$${value.toLocaleString("es-CL")} CLP`;
  };

  const handleEdit = (post: MyPost) => {
    console.log("Editar publicación:", post.id);

    // Más adelante:
    // router.push({
    //   pathname: "/edit-post",
    //   params: { postId: post.id },
    // } as any);
  };

  const handleDelete = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
  };

  const handleCreatePost = () => {
    router.push("/create-post" as any);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 130,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backWrapper}>
          <BackButton onPress={() => router.back()} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Mis publicaciones</Text>
          <Text style={styles.subtitle}>
            Administra las cartas que tienes publicadas en DecklyBuy TCG.
          </Text>
        </View>

        {posts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No tienes publicaciones</Text>
            <Text style={styles.emptyText}>
              Presiona el botón + para crear una nueva publicación.
            </Text>
          </View>
        ) : (
          <View style={styles.postsList}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.imageBox}>
                  <Image
                    source={{ uri: post.image }}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.infoBox}>
                  <Text numberOfLines={1} style={styles.cardName}>
                    {post.cardName}
                  </Text>

                  <Text numberOfLines={1} style={styles.cardDetail}>
                    {post.edition} • #{post.number}
                  </Text>

                  <Text style={styles.cardDetail}>
                    Estado IA: {post.condition}
                  </Text>

                  <Text style={styles.cardDetail}>Score: {post.score}/10</Text>

                  <Text style={styles.priceText}>{formatCLP(post.price)}</Text>

                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => handleEdit(post)}
                    >
                      <Text style={styles.editButtonText}>Editar</Text>
                    </Pressable>

                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDelete(post.id)}
                    >
                      <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        style={[
          styles.floatingButton,
          {
            bottom: insets.bottom + 40,
          },
        ]}
        onPress={handleCreatePost}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
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
  postsList: {
    gap: 14,
  },
  postCard: {
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
  priceText: {
    color: "#b91c1c",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#dbeafe",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  editButtonText: {
    color: "#1e40af",
    fontSize: 13,
    fontWeight: "900",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "900",
  },
  floatingButton: {
    position: "absolute",
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: decklyColors.primary,
    borderColor: decklyColors.primaryDark,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 8,
  },
  floatingButtonText: {
    color: "#111827",
    fontSize: 34,
    fontWeight: "900",
    marginTop: -3,
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