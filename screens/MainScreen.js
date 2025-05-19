import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
import RegionButtons from '../components/RegionButtons'; // 위치에 따라 경로 조정
import styles from '../styles/styles';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 샘플 데이터(카테고리만)
// const sampleSpots = [
//   { id: '1', name: '한강공원', category: '20s', type: 'popular' },
//   { id: '2', name: '광장시장', category: '30s', type: 'food' },
//   { id: '3', name: '서울타워', category: '20s', type: 'popular' },
//   { id: '4', name: '가로수길', category: '30s', type: 'sns' },
// ];

// 카테고리와 지역(더미 데이터)
const allSpots = {
  서울: [
    { id: 's1', name: '한강공원', category: '20s', type: 'popular', latitude: 37.5206, longitude: 126.9242 },
    { id: 's2', name: '광장시장', category: '30s', type: 'food', latitude: 37.5704, longitude: 127.0005 },
    { id: 's3', name: '서울타워', category: '20s', type: 'popular', latitude:37.5512, longitude: 126.9882 },
    { id: 's4', name: '성수동 카페거리', category: '30s', type: 'sns', latitude:37.5446, longitude: 127.0562 },
    { id: 's5', name: '북촌한옥마을', category: '20s', type: 'sns', latitude:37.5826, longitude: 126.9849 },
  ],
  부산: [
    { id: 'b1', name: '해운대 해수욕장', category: '20s', type: 'popular' },
    { id: 'b2', name: '자갈치시장', category: '30s', type: 'food' },
    { id: 'b3', name: '광안대교 야경', category: '20s', type: 'sns' },
    { id: 'b4', name: '송정카페거리', category: '30s', type: 'sns' },
    { id: 'b5', name: '동백섬', category: '20s', type: 'popular' },
  ],
  제주: [
    { id: 'j1', name: '성산일출봉', category: '20s', type: 'popular' },
    { id: 'j2', name: '동문시장', category: '30s', type: 'food' },
    { id: 'j3', name: '우도', category: '30s', type: 'sns' },
    { id: 'j4', name: '협재해수욕장', category: '20s', type: 'popular' },
    { id: 'j5', name: '이호테우 해변 말등대', category: '30s', type: 'sns' },
  ]
};

function TabButton({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton}>
      <Text style={styles.tabText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function MainScreen({ navigation}) {

  const [openedSpotId, setOpenedSpotId] = useState(null); // 펼쳐질 지도를 위한 상태 추가
  const [isAdmin, setIsAdmin] = useState(false); // true면 관리자, false면 일반 사용자  
  const [guestId, setGuestId] = useState(''); // 게스트 ID를 위한 상태 추가
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [region, setRegion] = useState('서울'); // 지역 상태 (기본 : 서울)
  const [selectedTab, setSelectedTab] = useState('null'); // 필터 상태

  // 샘플데이터 필터
  // const filteredSpots = sampleSpots.filter(
  //   (spot) => spot.type === selectedTab || spot.category === selectedTab
  // );

  // 전체데이터 필터 (allSpots은 객체이므로 객체의 배열을 꺼내줘야함)
  const sampleSpots = allSpots[region] || [];
  const filteredSpots = sampleSpots.filter((spot) => {
    // 선택된 탭이 없으면 모두 보여줌
    if (!selectedTab) return true;

    // type또는 category에 해당되면 해당 필터만 보여줌
    return spot.type === selectedTab || spot.category === selectedTab
  });

  // 단순히 관광지 저장
  // const addToCart = (spot) => {
  //   if (!cart.find((item) => item.id === spot.id)) {
  //     setCart([...cart, spot]);
  //   }
  // };

  // 관광지 저장 추가 및 저장 함수
  // const addToCart = async (spot) => {
  //   if (!spot || !spot.id) return;

  //   const alreadyInCart = cart.find((item) => item.id === spot.id);
  //   if (alreadyInCart) return;

  //   const newCart = [...cart, spot];
  //   setCart(newCart);
  //   try {
  //     await AsyncStorage.setItem(`@cart-${guestId}`, JSON.stringify(newCart));
  //     console.log(`✅ 저장됨: ${spot.name}`);
  //   } catch (e) {
  //     console.error('❌ 저장 실패:', e);
  //   }
  // };

  // 관광지 저장 삭제 함수 추가
  // const removeFromCart = async (spotId) => {
  //   const updatedCart = cart.filter((item) => item.id !== spotId);
  //   setCart(updatedCart);
  //   await AsyncStorage.setItem(`@cart-${guestId}`, JSON.stringify(updatedCart));
  // };

  // 관광지 저장 추가 및 저장 및 삭제 함수 추가
  const addToCart = async (spot) => {
    console.log('🛒 현재 guestId:', guestId);

    if (!guestId || !spot?.id) return;

    // 위도, 경도 누락 시 보완
    if (!spot.latitude || !spot.longitude) {
      const enriched = (allSpots[region] || []).find((s) => s.id === spot.id);
      if (enriched) {
        spot = { ...spot, latitude: enriched.latitude, longitude: enriched.longitude };
        console.log('📍 위경도 보완된 spot:', spot);
      }
    }

    const exists = cart.find((item) => item.id === spot.id);
    let newCart;

    if (exists) {
      // 삭제
      newCart = cart.filter((item) => item.id !== spot.id);
      console.log(`🗑️ 삭제됨: ${spot.name}`);
    } else {
      // 추가
      newCart = [...cart, spot];
      console.log(`✅ 저장됨: ${spot.name}`);
    }

    setCart(newCart);
    await AsyncStorage.setItem(`@cart-${guestId}`, JSON.stringify(newCart));
  };





  // 접속하는 사용자마다 랜덤 GUEST번호 부여 및 저장된 관광지 불러오기
  useEffect(() => {
    const initGuest = async () => {
      const id = 'GUEST-' + Math.floor(Math.random() * 100000);
      setGuestId(id);
      await AsyncStorage.setItem('@guestId', id); // 반드시 저장
    };

    initGuest().then(() => {
      // ✅ guestId 세팅이 끝난 후에 장바구니 불러오기
      const loadCart = async () => {
        const id = await AsyncStorage.getItem('@guestId');
        if (id) {
          const saved = await AsyncStorage.getItem(`@cart-${id}`);
          if (saved) {
            setCart(JSON.parse(saved));
          }
        }
      };
      loadCart();
    });
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isAdmin && (
          <Text style={styles.title}>지역: {region} | ID: {guestId}</Text>
        )}

        <Text style={styles.title}>ID: {guestId}</Text>
        <RegionButtons selectedRegion={region} onSelect={setRegion} />

        <View style={styles.tabRow}>
          <TabButton label="전체" onPress={() => setSelectedTab(null)} />
          <TabButton label="인기" onPress={() => setSelectedTab('popular')} />
          <TabButton label="맛집" onPress={() => setSelectedTab('food')} />
          <TabButton label="20대" onPress={() => setSelectedTab('20s')} />
          <TabButton label="30대" onPress={() => setSelectedTab('30s')} />
        </View>

        <FlatList
          data={filteredSpots}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.spotName}>{item.name}</Text>
                  <Text style={styles.spotMeta}>
                    {item.category} · {item.type}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity onPress={() => setOpenedSpotId(item.id)}>
                    <Icon name="expand-more" size={24} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => addToCart(item)}>
                    <Icon name="shopping-cart" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>

              {openedSpotId === item.id && item.latitude && item.longitude && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                      }}
                      title={item.name}
                    />
                  </MapView>
                </View>
              )}
            </View>
          )}
        />

        <Text style={styles.cartCount}>🛒 여행카트: {cart.length}개</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Wishlist', {guestId})}
          style={styles.wishlistButton}
        >
          <Text style={styles.wishlistButtonText}>📝 찜 목록 보기</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}
