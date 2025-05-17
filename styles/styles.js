// styles/styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f5f9' },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f1f5f9',
    paddingBottom: 24,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  tabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tabButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tabText: { color: 'white', fontWeight: 'bold' },
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
  spotName: { fontSize: 18, fontWeight: '600' },
  spotMeta: { fontSize: 14, color: '#6b7280' },
  cartCount: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  wishlistButton: {
    backgroundColor: 'lightgreen',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  wishlistButtonText: {
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
});
