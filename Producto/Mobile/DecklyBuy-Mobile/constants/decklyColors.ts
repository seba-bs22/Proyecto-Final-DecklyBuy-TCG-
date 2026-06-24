export const decklyColors = {
  // =========================
  // COLORES GENERALES
  // =========================

  background: "#ffffff",        // Fondo general de pantallas
  cardDark: "#ffffff00",        // Tarjetas oscuras reutilizables
  border: "#000000",            // Bordes generales

  primary: "#f4b400",           // Color principal: textos activos, botones, detalles
  primaryDark: "#d99a00",       // Variante oscura del color principal

  white: "#ffffff",             // Blanco general
  text: "#e5e7eb",              // Texto claro general
  textMuted: "#9ca3af",         // Texto secundario general
  textDark: "#111827",          // Texto oscuro general

  success: "#16a34a",           // Precio / estados positivos
  danger: "#dc2626",            // Errores / cerrar sesión / alertas


  // =========================
  // NAVEGACIÓN - BARRA INFERIOR
  // =========================

  tabBarBackground: "#ff0f0f",          // Barra roja de la app
  tabBarSystemBackground: "#000000",    // Barra negra inferior donde están los botones del celular
  tabBarBorder: "#d1d5db",              // Borde superior de la barra inferior
  tabBarActiveIcon: "#000000",          // Color del icono/texto activo
  tabBarInactiveIcon: "#ffffff",        // Color del icono/texto inactivo

  androidNavigationBar: "#000000",      // Barra negra nativa donde están los botones del celular

  // =========================
  // HOME
  // =========================

  homeBackground: "#ffffff",                  // Fondo de la pantalla Inicio

  homeHeaderTopBackground: "rgba(255, 31, 31, 0.55)",     // Header arriba: rojo claro glass
  homeHeaderScrolledBackground: "rgba(255, 255, 255, 0.72)", // Header al hacer scroll: blanco glass
  homeHeaderBorder: "rgba(255, 255, 255, 0.35)",          // Borde inferior del header

  homeSearchBackground: "rgba(255, 255, 255, 0.78)",      // Fondo del buscador
  homeSearchScrolledBackground: "rgba(243, 244, 246, 0.78)", // Fondo buscador cuando baja
  homeSearchBorder: "rgba(209, 213, 219, 0.8)",           // Borde del buscador
  homeSearchText: "#6b7280",                              // Texto dentro del buscador

  homeNotificationBackground: "rgba(255, 255, 255, 0.85)", // Fondo botón notificación
  homeNotificationBorder: "rgba(209, 213, 219, 0.9)",      // Borde botón notificación
  homeNotificationIcon: "#111827",                         // Color icono si el PNG usa tintColor

  homeSectionTitle: "#111827",             // Título "Recientes"

  homeCardBackground: "#ffffff",           // Fondo de publicaciones recientes
  homeCardBorder: "#d1d5db",               // Borde de publicaciones recientes
  homeCardImageBackground: "#e5e7eb",      // Fondo placeholder imagen
  homeCardImageText: "#4b5563",            // Texto placeholder imagen

  homeCardTitle: "#111827",                // Nombre de la carta
  homeCardInfo: "#4b5563",                 // Estado / edición
  homeCardPrice: "#16a34a",                // Precio de la carta

  homeMarkerBackground: "rgba(255, 255, 255, 0.9)", // Fondo marcador/deseado
  homeMarkerText: "#111827",                       // Color marcador

  // =========================
  // HOME - SCORE IA
  // =========================

  homeScoreMintBackground: "#166534",            // Mint 10
  homeScoreNearMintBackground: "#22c55e",        // Near Mint 9
  homeScoreLightlyPlayedBackground: "#facc15",   // Lightly Played 7
  homeScoreModeratelyPlayedBackground: "#f97316",// Moderately Played 5
  homeScoreHeavilyPlayedBackground: "#dc2626",   // Heavily Played 3
  homeScoreDamagedBackground: "#7f1d1d",         // Damaged 1

  homeScoreText: "#ffffff",

  // =========================
  // CATEGORIES - CATEGORÍAS
  // =========================

  categoriesBackground: "#ffffff",          // Fondo de la pantalla Categorías

  categoriesTitle: "#ff0000",               // Título "Categorías"
  categoriesSubtitle: "#111827",            // Subtítulo de la pantalla

  categoriesCardBorder: "transparent",      // Borde normal de cada categoría
  categoriesSelectedBorder: "#ff3232",      // Borde cuando se selecciona una categoría
  categoriesSelectedShadow: "#c50000",      // Sombra/resaltado al seleccionar

  categoriesOverlay: "rgba(0, 0, 0, 0.48)", // Capa oscura sobre la imagen de fondo
  categoriesTitleText: "#ffffff",           // Texto principal dentro del bloque
  categoriesDescriptionText: "#f3f4f6",     // Descripción dentro del bloque

  categoriesBadgeBackground: "#ffffff00",     // Fondo del badge "Seleccionado"
  categoriesBadgeText: "#111827",           // Texto del badge "Seleccionado"


  // =========================
  // CART - CARRITO
  // =========================

  cartBackground: "#ffffff",              // Fondo de la pantalla Carrito

  cartTitle: "#ff0000",                   // Título "Carrito"
  cartSubtitle: "#111827",                // Subtítulo del carrito

  cartItemBackground: "#ffffff",          // Fondo de cada producto en el carrito
  cartItemBorder: "#d1d5db",              // Borde de cada producto
  cartImageBackground: "#e5e7eb",         // Fondo del placeholder de imagen
  cartImageText: "#4b5563",               // Texto "Carta" dentro del placeholder

  cartItemName: "#111827",                // Nombre de la carta
  cartItemCondition: "#4b5563",           // Estado de la carta
  cartItemPrice: "#16a34a",               // Precio individual de cada carta

  cartTotalBackground: "#f3f4f6",         // Fondo del bloque de total
  cartTotalBorder: "#000000",             // Borde del bloque de total
  cartTotalLabel: "#4b5563",              // Texto "Total estimado"
  cartTotalPrice: "#16a34a",              // Precio total

  cartButtonBackground: "#ff0000",        // Fondo del botón "Continuar compra"
  cartButtonBorder: "#000000",            // Borde del botón
  cartButtonText: "#ffffff",              // Texto del botón

  cartEmptyText: "#6b7280",               // Texto si el carrito estuviera vacío


  // =========================
  // PROFILE - PERFIL
  // =========================

  profileBackground: "#ffffff",           // Fondo de la pantalla Perfil

  profileAvatarBackground: "#f4b400",     // Fondo del círculo del avatar
  profileAvatarText: "#111827",           // Letra dentro del avatar

  profileName: "#111827",                 // Nombre del usuario
  profileEmail: "#6b7280",                // Correo del usuario

  profileStatsBackground: "#f3f4f6",      // Fondo de los bloques Publicaciones/Deseados
  profileStatsBorder: "#d1d5db",          // Borde de los bloques Publicaciones/Deseados
  profileStatsNumber: "#f4b400",          // Número de publicaciones/deseados
  profileStatsLabel: "#111827",           // Texto Publicaciones/Deseados

  profileOptionBackground: "#ffffff",     // Fondo de opciones normales
  profileOptionBorder: "#d1d5db",         // Borde de opciones normales
  profileOptionText: "#111827",           // Texto de opciones normales

  profileLogoutBackground: "#000000",     // Fondo del botón Cerrar sesión
  profileLogoutBorder: "#000000",         // Borde del botón Cerrar sesión
  profileLogoutText: "#ffffff",           // Texto del botón Cerrar sesión


  // =========================
  // LOGIN - INICIO DE SESIÓN
  // =========================

  loginBackground: "#ffffff",                 // Color de respaldo si no carga la imagen de fondo
  loginOverlay: "rgba(0, 0, 0, 0.55)",        // Capa oscura sobre la imagen de fondo

  loginBoxBackground: "#ffffff",              // Fondo del cuadro de login
  loginBoxBorder: "#d1d5db",                  // Borde del cuadro de login

  loginTitle: "#ff0000",                      // Texto "DecklyBuy TCG"
  loginSubtitle: "#111827",                   // Texto "Iniciar sesión"

  loginInputBackground: "#f3f4f6",            // Fondo de inputs
  loginInputBorder: "#d1d5db",                // Borde de inputs
  loginInputText: "#111827",                  // Texto escrito en inputs
  loginInputPlaceholder: "#6b7280",           // Placeholder de inputs

  loginButtonBackground: "#ff0000",           // Fondo botón Ingresar
  loginButtonBorder: "#000000",               // Borde botón Ingresar
  loginButtonText: "#ffffff",                 // Texto botón Ingresar

  loginGoogleBackground: "#ffffff",           // Fondo botón Google
  loginGoogleBorder: "#000000",               // Borde botón Google
  loginGoogleText: "#111827",                 // Texto botón Google
  loginGoogleIcon: "#4285F4",                 // Letra/icono Google

  loginRegisterText: "#111827",               // Texto "¿No tienes cuenta?"
  loginRegisterHighlight: "#ff0000",          // Texto destacado "Regístrate"

  // =========================
  // MY POSTS - MIS PUBLICACIONES
  // =========================

  myPostsBackground: "#ffffff",          // Fondo de Mis publicaciones
  myPostsTitle: "#ff0000",               // Título "Mis publicaciones"
  myPostsText: "#111827",                // Texto "No tienes publicaciones aún"
  myPostsMutedText: "#6b7280",           // Texto secundario

  myPostsBackButtonBackground: "#f3f4f6", // Fondo botón volver
  myPostsBackButtonBorder: "#d1d5db",     // Borde botón volver
  myPostsBackButtonText: "#111827",       // Texto botón volver

  myPostsAddButtonBackground: "#ff0000",  // Fondo botón redondo +
  myPostsAddButtonBorder: "#000000",      // Borde botón redondo +
  myPostsAddButtonText: "#ffffff",        // Color del símbolo +

  // =========================
  // CREATE POST - CREAR PUBLICACIÓN
  // =========================

  createPostBackground: "#ffffff",             // Fondo de Crear publicación

  createPostTitle: "#ff0000",                  // Título "Crear publicación"
  createPostSubtitle: "#111827",               // Texto descriptivo bajo el título

  createPostBackButtonBackground: "#f3f4f6",   // Fondo botón Volver
  createPostBackButtonBorder: "#d1d5db",       // Borde botón Volver
  createPostBackButtonText: "#111827",         // Texto botón Volver

  createPostImageBoxBackground: "#f3f4f6",     // Fondo del bloque de imagen
  createPostImageBoxBorder: "#d1d5db",         // Borde del bloque de imagen
  createPostImagePlaceholderText: "#6b7280",   // Texto cuando no hay imagen

  createPostImageButtonBackground: "#111827",  // Fondo botón Galería/Cámara
  createPostImageButtonBorder: "#000000",      // Borde botón Galería/Cámara
  createPostImageButtonText: "#ffffff",        // Texto botón Galería/Cámara

  createPostAnalyzeButtonBackground: "#ff0000", // Fondo botón Analizar imagen
  createPostAnalyzeButtonBorder: "#000000",     // Borde botón Analizar imagen
  createPostAnalyzeButtonText: "#ffffff",       // Texto botón Analizar imagen

  createPostFormBackground: "#ffffff",        // Fondo del formulario
  createPostFormBorder: "#d1d5db",            // Borde del formulario

  createPostLabel: "#111827",                 // Texto de labels
  createPostInputBackground: "#f3f4f6",        // Fondo de inputs
  createPostInputBorder: "#d1d5db",            // Borde de inputs
  createPostInputText: "#111827",              // Texto escrito
  createPostInputPlaceholder: "#6b7280",       // Placeholder

  createPostReadOnlyBackground: "#e5e7eb",     // Fondo inputs solo lectura
  createPostReadOnlyText: "#4b5563",           // Texto inputs solo lectura

  createPostSeparator: "#d1d5db",              // Línea separadora análisis

  createPostPublishButtonBackground: "#ff0000", // Fondo botón PUBLICAR
  createPostPublishButtonBorder: "#000000",     // Borde botón PUBLICAR
  createPostPublishButtonText: "#ffffff",       // Texto botón PUBLICAR

  // =========================
  // WISHLIST - LISTA DE DESEADOS
  // =========================

  wishlistBackground: "#ffffff",              // Fondo de Lista de deseados
  wishlistTitle: "#ff0000",                   // Título "Lista de deseados"
  wishlistText: "#111827",                    // Texto principal
  wishlistMutedText: "#6b7280",               // Texto secundario

  wishlistBackButtonBackground: "#f3f4f6",    // Fondo botón Volver
  wishlistBackButtonBorder: "#d1d5db",        // Borde botón Volver
  wishlistBackButtonText: "#111827",          // Texto botón Volver

  // =========================
  // WISHLIST ICON - MARCADOR DESEADOS
  // =========================

  wishlistIconButtonBackground: "rgba(255, 255, 255, 0.9)", // Fondo del botón marcador
  wishlistIconButtonBorder: "#d1d5db",                      // Borde del botón marcador

  wishlistCardBackground: "#ffffff",        // Fondo de productos en deseados
  wishlistCardBorder: "#d1d5db",            // Borde de productos en deseados
  wishlistImageBackground: "#e5e7eb",       // Placeholder imagen en deseados
  wishlistImageText: "#4b5563",             // Texto placeholder imagen
  wishlistItemName: "#111827",              // Nombre producto deseado
  wishlistItemInfo: "#4b5563",              // Edición/estado producto deseado
  wishlistItemPrice: "#16a34a",             // Precio producto deseado

  // =========================
  // NOTIFICATIONS - NOTIFICACIONES
  // =========================

  notificationsBackground: "#ffffff",              // Fondo de Notificaciones
  notificationsTitle: "#ff0000",                   // Título "Notificaciones"
  notificationsText: "#111827",                    // Texto principal
  notificationsMutedText: "#6b7280",               // Texto secundario

  notificationsBackButtonBackground: "#f3f4f6",    // Fondo botón Volver
  notificationsBackButtonBorder: "#d1d5db",        // Borde botón Volver
  notificationsBackButtonText: "#111827",          // Texto botón Volver

  // =========================
  // FORGOT PASSWORD - RECUPERAR CONTRASEÑA
  // =========================

  forgotPasswordBackground: "#ffffff",              // Color respaldo si no carga imagen
  forgotPasswordOverlay: "rgba(0, 0, 0, 0.55)",     // Capa oscura sobre imagen

  forgotPasswordBoxBackground: "#ffffff",           // Fondo caja recuperar contraseña
  forgotPasswordBoxBorder: "#d1d5db",               // Borde caja

  forgotPasswordTitle: "#ff0000",                   // Título recuperar contraseña
  forgotPasswordDescription: "#111827",             // Descripción

  forgotPasswordLabel: "#111827",                   // Texto label correo
  forgotPasswordInputBackground: "#f3f4f6",          // Fondo input
  forgotPasswordInputBorder: "#d1d5db",              // Borde input
  forgotPasswordInputText: "#111827",                // Texto input
  forgotPasswordInputPlaceholder: "#6b7280",         // Placeholder input

  forgotPasswordButtonBackground: "#ff0000",         // Fondo botón recuperar
  forgotPasswordButtonBorder: "#000000",             // Borde botón recuperar
  forgotPasswordButtonText: "#ffffff",               // Texto botón recuperar

  forgotPasswordBackText: "#111827",                 // Texto volver a login
  forgotPasswordBackHighlight: "#ff0000",            // Texto destacado volver

  // =========================
  // REGISTER - REGISTRO
  // =========================

  registerBackground: "#ffffff",              // Color respaldo si no carga imagen
  registerOverlay: "rgba(0, 0, 0, 0.55)",     // Capa oscura sobre imagen

  registerBoxBackground: "#ffffff",           // Fondo caja registro
  registerBoxBorder: "#d1d5db",               // Borde caja registro

  registerTitle: "#ff0000",                   // Título "Registrarse"
  registerDescription: "#111827",             // Descripción bajo el título

  registerLabel: "#111827",                   // Texto de labels
  registerInputBackground: "#f3f4f6",          // Fondo inputs
  registerInputBorder: "#d1d5db",              // Borde inputs
  registerInputText: "#111827",                // Texto escrito
  registerInputPlaceholder: "#6b7280",         // Placeholder

  registerButtonBackground: "#ff0000",         // Fondo botón Crear cuenta
  registerButtonBorder: "#000000",             // Borde botón Crear cuenta
  registerButtonText: "#ffffff",               // Texto botón Crear cuenta

  registerLoginText: "#111827",                // Texto "¿Ya tienes cuenta?"
  registerLoginHighlight: "#ff0000",           // Texto destacado "Inicia sesión"
};