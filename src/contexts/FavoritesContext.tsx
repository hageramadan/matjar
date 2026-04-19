"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  favorites: number[];
  favoritesCount: number;
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (id: number) => {
    setFavorites((prev) => [...prev, id]);
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoritesCount: favorites.length, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}