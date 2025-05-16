import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function RegionButtons({ selectedRegion, onSelect }) {
  const regions = ['서울', '부산', '제주'];

  return (
    <View style={styles.container}>
      {regions.map((region) => (
        <TouchableOpacity
          key={region}
          onPress={() => onSelect(region)}
          style={[
            styles.button,
            selectedRegion === region && styles.activeButton,
          ]}
        >
          <Text style={[
            styles.text,
            selectedRegion === region && styles.activeText,
          ]}>
            {region}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#10b981',
  },
  text: {
    color: '#111827',
    fontWeight: 'bold',
  },
  activeText: {
    color: 'white',
  },
});
