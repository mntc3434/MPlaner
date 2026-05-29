import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, FlatList, Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - SPACING.md * 2 - SPACING.sm * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

function GlassCard({ children, style, theme }) {
  return (
    <View style={[styles.glassCardWrapper, { borderColor: theme.glassBorder }, style]}>
      <BlurView intensity={20} tint={theme.mode} style={styles.glassEffect}>
        <View style={styles.glassContent}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

export default function GalleryScreen({ navigation }) {
  const { theme, progressPhotos, addPhoto, deletePhoto, userProfile } = useApp();
  const [comparing, setComparing] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to track progress.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileName = `progress_${Date.now()}.jpg`;
      const destPath = `${FileSystem.documentDirectory}${fileName}`;

      try {
        await FileSystem.copyAsync({
          from: asset.uri,
          to: destPath,
        });

        const newPhoto = {
          id: Date.now().toString(),
          uri: destPath,
          date: new Date().toISOString(),
          weight: userProfile.currentWeight,
        };

        await addPhoto(newPhoto);
      } catch (e) {
        Alert.alert('Error', 'Could not save the photo locally.');
      }
    }
  }

  function toggleCompare(photo) {
    if (comparing.find(p => p.id === photo.id)) {
      setComparing(p => p.filter(it => it.id !== photo.id));
    } else if (comparing.length < 2) {
      setComparing(p => [...p, photo]);
    }
  }

  function handleLongPress(id) {
    Alert.alert('Delete Photo', 'Remove this progress photo permanently?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePhoto(id) },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Progress Gallery</Text>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="add-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {comparing.length > 0 && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {comparing.length === 1 ? 'Select one more to compare' : 'Ready to compare'}
          </Text>
          {comparing.length === 2 && (
            <TouchableOpacity style={styles.compareBtn} onPress={() => setShowCompare(true)}>
              <Text style={styles.compareBtnText}>COMPARE</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setComparing([])}>
            <Text style={{ color: COLORS.error, fontSize: 12 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={progressPhotos}
        keyExtractor={item => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const isSelected = comparing.find(p => p.id === item.id);
          return (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => comparing.length > 0 ? toggleCompare(item) : null}
              onLongPress={() => handleLongPress(item.id)}
              delayLongPress={500}
            >
              <View style={[styles.item, isSelected && styles.itemSelected]}>
                <Image source={{ uri: item.uri }} style={styles.image} />
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{format(new Date(item.date), 'MMM d')}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkOverlay}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  </View>
                )}
                {!comparing.length && (
                  <TouchableOpacity style={styles.checkTrigger} onPress={() => toggleCompare(item)}>
                    <MaterialCommunityIcons name="compare" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="image-plus" size={64} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No progress photos yet.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={pickImage}>
               <Text style={styles.emptyBtnText}>Add Your First Photo</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Comparison Modal */}
      <Modal visible={showCompare} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comparison</Text>
              <TouchableOpacity onPress={() => { setShowCompare(false); setComparing([]); }}>
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {comparing.length === 2 && (
              <ScrollView contentContainerStyle={styles.compareScroll}>
                <View style={styles.compareContainer}>
                  <View style={styles.compareSlot}>
                    <Text style={[styles.slotLabel, { color: COLORS.primary }]}>BEFORE</Text>
                    <Image source={{ uri: comparing[0].uri }} style={styles.compareImage} />
                    <View style={styles.compareMeta}>
                      <Text style={styles.metaText}>{format(new Date(comparing[0].date), 'PPP')}</Text>
                      <Text style={styles.metaWeight}>{comparing[0].weight} {userProfile.units}</Text>
                    </View>
                  </View>
                  <View style={styles.compareSlot}>
                    <Text style={[styles.slotLabel, { color: COLORS.accent }]}>AFTER</Text>
                    <Image source={{ uri: comparing[1].uri }} style={styles.compareImage} />
                    <View style={styles.compareMeta}>
                      <Text style={styles.metaText}>{format(new Date(comparing[1].date), 'PPP')}</Text>
                      <Text style={styles.metaWeight}>{comparing[1].weight} {userProfile.units}</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  title: { fontSize: 20, fontWeight: '900' },
  list: { padding: SPACING.md, paddingBottom: 120 },
  row: { gap: SPACING.sm, marginBottom: SPACING.sm },
  item: { width: ITEM_WIDTH, height: ITEM_WIDTH * 1.3, borderRadius: RADIUS.md, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
  itemSelected: { borderWeight: 2, borderColor: COLORS.primary },
  image: { width: '100%', height: '100%' },
  dateBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dateText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  checkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  checkTrigger: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 12 },
  
  selectionBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(46, 204, 113, 0.1)', marginHorizontal: SPACING.md, padding: 12, borderRadius: 12, gap: 12 },
  selectionText: { flex: 1, fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  compareBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  compareBtnText: { color: '#000', fontSize: 11, fontWeight: '900' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 20, fontSize: 16 },
  emptyBtn: { marginTop: 20, backgroundColor: COLORS.primary + '20', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary },
  emptyBtnText: { color: COLORS.primary, fontWeight: '800' },

  modalOverlay: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  compareScroll: { padding: SPACING.md },
  compareContainer: { gap: SPACING.lg },
  compareSlot: { width: '100%' },
  slotLabel: { fontSize: 12, fontWeight: '900', marginBottom: 8, letterSpacing: 2 },
  compareImage: { width: '100%', height: width * 1.2, borderRadius: RADIUS.lg },
  compareMeta: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { color: '#A0A0A0', fontSize: 12 },
  metaWeight: { color: '#fff', fontWeight: '800' },

  glassCardWrapper: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, marginBottom: SPACING.sm },
  glassEffect: { borderRadius: RADIUS.lg },
  glassContent: { padding: SPACING.md },
});
