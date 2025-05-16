import { Text, TouchableOpacity } from 'react-native';

export function Button({ children, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-blue-500 px-4 py-2 rounded-lg shadow"
    >
      <Text className="text-white font-semibold">{children}</Text>
    </TouchableOpacity>
  );
}
