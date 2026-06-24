import { createContext, ReactNode, useContext, useState } from "react";

export type WishlistPost = {
  id: number;
  name: string;
  edition: string;
  condition: string;
  price: string;
};

type WishlistContextValue = {
  wishlist: WishlistPost[];
  togglePost: (post: WishlistPost) => void;
  isSaved: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistPost[]>([]);

  const isSaved = (id: number) => {
    return wishlist.some((post) => post.id === id);
  };

  const togglePost = (post: WishlistPost) => {
    setWishlist((currentWishlist) => {
      const alreadySaved = currentWishlist.some((item) => item.id === post.id);

      if (alreadySaved) {
        return currentWishlist.filter((item) => item.id !== post.id);
      }

      return [...currentWishlist, post];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, togglePost, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  }

  return context;
}