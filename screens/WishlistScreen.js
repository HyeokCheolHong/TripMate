// screens/WishlistScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WishlistScreen({ route }) {
  const { guestId } = route.params;
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      const saved = await AsyncStorage.getItem(`@cart-${guestId}`);
      if (saved) setWishlist(JSON.parse(saved));
    };
    loadWishlist();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 찜한 여행지</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} ({item.type})</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f5f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
});
