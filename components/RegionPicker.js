import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function RegionPicker({ region, onChange }) {
  const regionList = ['서울', '부산', '제주'];

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>지역 선택</Text>
      <View
        style={{
          borderWidth: Platform.OS === 'android' ? 1 : 0,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <Picker
          selectedValue={region}
          onValueChange={(value) => onChange(value)}
        >
          {regionList.map((r) => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
