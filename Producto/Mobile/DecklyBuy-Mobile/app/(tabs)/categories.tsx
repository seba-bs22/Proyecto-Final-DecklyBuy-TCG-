import { useState } from "react";
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { decklyColors } from "../../constants/decklyColors";

const categories = [
  {
    id: "pokemon",
    title: "Pokémon básicos, Fase 1/2",
    description: "Cartas Pokémon tradicionales para colección o juego.",
    image: require("../../assets/images/categories/pokemon-bg.jpg"),
  },
  {
    id: "especiales",
    title: "Pokémon EX, V, VMAX",
    description: "Cartas especiales, poderosas y de mayor valor.",
    image: require("../../assets/images/categories/especiales-bg.jpg"),
  },
  {
    id: "entrenador",
    title: "Cartas de entrenador",
    description: "Cartas de apoyo, objetos, estadios y entrenadores.",
    image: require("../../assets/images/categories/entrenador-bg.jpg"),
  },
  {
    id: "energia",
    title: "Cartas de energía",
    description: "Energías básicas y especiales para tus mazos.",
    image: require("../../assets/images/categories/energia-bg.jpg"),
  },
];

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Categorías</Text>
        <Text style={styles.subtitle}>
          Selecciona una categoría para explorar cartas Pokémon TCG.
        </Text>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryWrapper,
                isSelected && styles.categorySelected,
              ]}
            >
              <ImageBackground
                source={category.image}
                style={styles.categoryCard}
                imageStyle={styles.categoryImage}
                blurRadius={2}
                resizeMode="cover"
              >
                <View style={styles.overlay} />

                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>

                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>

                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>Seleccionado</Text>
                    </View>
                  )}
                </View>
              </ImageBackground>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: decklyColors.categoriesBackground,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 110,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 46,
  },
  title: {
    color: decklyColors.categoriesTitle,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 35,
  },
  subtitle: {
    color: decklyColors.categoriesSubtitle,
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },
  categoriesContainer: {
    width: "100%",
    gap: 16,
  },
  categoryWrapper: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: decklyColors.categoriesCardBorder,
  },
  categorySelected: {
    borderColor: decklyColors.categoriesSelectedBorder,
    shadowColor: decklyColors.categoriesSelectedShadow,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  categoryCard: {
    height: 135,
    justifyContent: "center",
  },
  categoryImage: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: decklyColors.categoriesOverlay,
  },
  categoryContent: {
    padding: 18,
    zIndex: 2,
  },
  categoryTitle: {
    color: decklyColors.categoriesTitleText,
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryDescription: {
    color: decklyColors.categoriesDescriptionText,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  selectedBadge: {
    backgroundColor: decklyColors.categoriesBadgeBackground,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  selectedBadgeText: {
    color: decklyColors.categoriesBadgeText,
    fontWeight: "bold",
    fontSize: 12,
  },
});