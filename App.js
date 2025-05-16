import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';
// import RegionPicker from './components/RegionPicker';
import RegionButtons from './components/RegionButtons'; // 지역 버튼
import MapView, { Marker } from 'react-native-maps'; // 지도
import AsyncStorage from '@react-native-async-storage/async-storage'; // 저장
import { SafeAreaView } from 'react-native-safe-area-context'; // 상단/하단 여백 추가(휴대폰 화면 네비게이션바 등등.. 대처)



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


export default function App() {
  const [region, setRegion] = useState('서울'); // 지역 상태 (기본 : 서울)
  const [selectedTab, setSelectedTab] = useState('null'); // 필터 상태
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [guestId, setGuestId] = useState(''); // 게스트 ID를 위한 상태 추가
  const [openedSpotId, setOpenedSpotId] = useState(null); // 펼쳐질 지도를 위한 상태 추가
  const [isAdmin, setIsAdmin] = useState(false); // true면 관리자, false면 일반 사용자

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
  const addToCart = async (spot) => {
    if (!spot || !spot.id) return;

    const alreadyInCart = cart.find((item) => item.id === spot.id);
    if (alreadyInCart) return;

    const newCart = [...cart, spot];
    setCart(newCart);
    try {
      await AsyncStorage.setItem(`@cart-${guestId}`, JSON.stringify(newCart));
      console.log(`✅ 저장됨: ${spot.name}`);
    } catch (e) {
      console.error('❌ 저장 실패:', e);
    }
  };


  // 접속하는 사용자마다 랜덤 GUEST번호 부여 및 저장된 관광지 불러오기
  useEffect(() => {
    const id = 'GUEST-' + Math.floor(Math.random() * 100000);
    setGuestId(id);

    // 저장된 장바구니 불러오기 
    const loadCart = async () => {
      const saved = await AsyncStorage.getItem(`@cart-${id}`);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    };

    loadCart();
  }, []);


  return (
    // 상단 하단 여백 추가
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isAdmin && (
          <Text style={styles.title}>지역: {region} | ID: {guestId}</Text>
        )}


        {/* 지역 선택 Picker */}
        {/* <RegionPicker region={region} onChange={setRegion} /> */}

        {/* 지역 선택 Buttons */}
        <Text style={styles.title}>ID: {guestId}</Text>
        <RegionButtons selectedRegion={region} onSelect={setRegion} />

        {/*카테고리 나열*/}
        <View style={styles.tabRow}>
          <TabButton label="전체" onPress={() => setSelectedTab(null)} />
          <TabButton label="인기" onPress={() => setSelectedTab('popular')} />
          <TabButton label="맛집" onPress={() => setSelectedTab('food')} />
          <TabButton label="20대" onPress={() => setSelectedTab('20s')} />
          <TabButton label="30대" onPress={() => setSelectedTab('30s')} />
        </View>

        {/* 관광지 표기 */}
        <FlatList
          data={filteredSpots}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.spotName}>{item.name}</Text>
                  <Text style={styles.spotMeta}>{item.category} · {item.type}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {/* 지도 보기 버튼 */}
                  <TouchableOpacity onPress={() => setOpenedSpotId(item.id)}>
                    <Icon name="expand-more" size={24} color="#000" />
                  </TouchableOpacity>
                  {/* 관광지 저장하기 버튼 */}
                  <TouchableOpacity onPress={() => addToCart(item)}>
                    <Icon name="shopping-cart" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 👇 지도는 cardContent 밖에 위치시킴 */}
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
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton}>
      <Text style={styles.tabText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
  },
  spotMeta: {
    fontSize: 14,
    color: '#6b7280',
  },
  cartCount: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
  marginTop: 12,
  height: 200,
  width: '100%',
  borderRadius: 10,
  overflow: 'hidden',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 32, // ✅ 하단 여백 추가
  },
});
