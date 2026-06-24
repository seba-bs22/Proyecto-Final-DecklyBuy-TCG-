import { Image, Pressable, StyleSheet, Text } from "react-native";
import { decklyColors } from "../constants/decklyColors";

type Props = {
  onPress: () => void;
  text?: string;
};

export default function BackButton({ onPress, text = "Volver" }: Props) {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <Image
        source={require("../assets/images/icons/back.png")}
        style={styles.backIcon}
        resizeMode="contain"
      />

      <Text style={styles.backButtonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 42,
    backgroundColor: decklyColors.wishlistBackButtonBackground,
    borderColor: decklyColors.wishlistBackButtonBorder,
    borderWidth: 1,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 18,
    height: 18,
    marginRight: 7,
    tintColor: decklyColors.wishlistBackButtonText,
  },
  backButtonText: {
    color: decklyColors.wishlistBackButtonText,
    fontWeight: "700",
  },
});