import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';



export default function WishlistScreen({ route }) {
  // const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const mapRef = useRef(null);
  
  const focusOnSpot = (spot) => {
    if (spot.latitude && spot.longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: spot.latitude,
          longitude: spot.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500 // 애니메이션 시간(ms)
      );
    }
  };
  
  // useEffect(() => {
  //   const loadData = async () => {
  //     const id = await AsyncStorage.getItem('@guestId');
  //     console.log('📌 가져온 guestId:', id); // 👈 여기도 확인
  //     setGuestId(id);
  //     const saved = await AsyncStorage.getItem(`@cart-${id}`);
  //     console.log('📌 저장된 찜 목록:', saved); // 👈 raw JSON 문자열도 찍기
  //     if (id && saved) {
  //       const parsed = JSON.parse(saved);
  //       console.log('🧭 찜 목록 데이터:', parsed); // 👈 여기 확인해봐
  //       setCart(JSON.parse(saved));
  //     }
  //   };

  //   loadData();
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      const id = route?.params?.guestId; // ✅ route에서 받기
      console.log('📌 받은 guestId:', id); // 디버깅 확인

      console.log('id 확인 전');

      // if (!id) return;
      // setGuestId(id);
      if (typeof id !== 'string' || !id.startsWith('GUEST-')) {
        console.warn('❌ 유효하지 않은 guestId:', id);
        return;
      }
      console.log('id 확인 후');

      const saved = await AsyncStorage.getItem(`@cart-${id}`);
      console.log('📦 저장된 찜 목록:', saved);

      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✅ 찜 목록 파싱:', parsed);
        setCart(parsed);
      } else {
        console.warn('저장된 찜 데이터 없음');
      }
    };

    loadData();
  }, [route]);


  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>📍 찜한 여행지 지도 보기</Text>

      <MapView
      ref={mapRef}
        style={{ flex: 1, minHeight: 300 }} // 💡 또는 height: 300
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {cart.map((spot) =>
          spot.latitude && spot.longitude ? (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              title={spot.name}
              description={`${spot.category} · ${spot.type}`}
              pinColor="tomato"
            />
          ) : null
        )}
      </MapView>



      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => focusOnSpot(item)}>
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category} · {item.type}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
    color: '#6b7280',
  },
});