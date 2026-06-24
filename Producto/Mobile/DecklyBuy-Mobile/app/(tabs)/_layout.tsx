import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { decklyColors } from "../../constants/decklyColors";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const appBarHeight = 62;
  const systemBarHeight = Math.max(insets.bottom, 24);
  const totalBarHeight = appBarHeight + systemBarHeight;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: decklyColors.tabBarActiveIcon,
        tabBarInactiveTintColor: decklyColors.tabBarInactiveIcon,

        tabBarStyle: {
          height: totalBarHeight,
          backgroundColor: "transparent",
          borderTopColor: decklyColors.tabBarBorder,
          borderTopWidth: 1,
          paddingTop: 7,
          paddingBottom: systemBarHeight + 5,
          elevation: 0,
        },

        tabBarBackground: () => (
          <View style={styles.tabBackground}>
            <View
              style={[
                styles.appBarBackground,
                {
                  height: appBarHeight,
                  backgroundColor: decklyColors.tabBarBackground,
                },
              ]}
            />

            <View
              style={[
                styles.systemBarBackground,
                {
                  height: systemBarHeight,
                  backgroundColor: decklyColors.tabBarSystemBackground,
                },
              ]}
            />
          </View>
        ),

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/icons/home.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorías",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/icons/categories.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/icons/cart.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../assets/images/icons/profile.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  appBarBackground: {
    width: "100%",
  },
  systemBarBackground: {
    width: "100%",
  },
});