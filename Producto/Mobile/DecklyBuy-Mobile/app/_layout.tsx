import { Stack } from "expo-router";
import { WishlistProvider } from "../context/WishlistContext";

export default function RootLayout() {
  return (
    <WishlistProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="my-posts" />
        <Stack.Screen name="create-post" />
        <Stack.Screen name="wishlist" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </WishlistProvider>
  );
}