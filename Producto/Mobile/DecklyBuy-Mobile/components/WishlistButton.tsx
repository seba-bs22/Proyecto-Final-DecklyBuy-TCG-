import { useRef } from "react";
import { Animated, Image, Pressable, StyleSheet } from "react-native";
import { decklyColors } from "../constants/decklyColors";
import {
    useWishlist,
    WishlistPost,
} from "../context/WishlistContext";

type Props = {
  post: WishlistPost;
  size?: number;
};

export default function WishlistButton({ post, size = 22 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const { togglePost, isSaved } = useWishlist();

  const saved = isSaved(post.id);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.78,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    togglePost(post);
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Image
          source={
            saved
              ? require("../assets/images/icons/wishlist-full.png")
              : require("../assets/images/icons/wishlist.png")
          }
          style={{
            width: size,
            height: size,
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: decklyColors.wishlistIconButtonBackground,
    borderColor: decklyColors.wishlistIconButtonBorder,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});