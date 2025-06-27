// src/components/results/NearbyAgrovetsCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/cards/card';
import { Colors, Fonts, Layout } from '../../constants';

interface Agrovet {
  name: string;
  latitude: number;
  longitude: number;
  products: string[];
  prices: number[];
  distance_km: number;
  phone?: string | null;
}

interface NearbyAgrovetsCardProps {
  agrovets: Agrovet[];
}

export const NearbyAgrovetsCard: React.FC<NearbyAgrovetsCardProps> = ({
  agrovets,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCallAgrovet = (phone: string | null) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('No Contact', 'Phone number not available for this agrovet.');
    }
  };

  const handleNavigateToAgrovet = (latitude: number, longitude: number) => {
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps application.');
    });
  };

  if (!agrovets || agrovets.length === 0) return null;

  return (
    <Card style={styles.agrovetCard}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.cardTitle}>🏪 NEARBY AGROVETS</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.text.secondary}
        />
      </TouchableOpacity>

      {/* Show closest agrovet always */}
      <AgrovetItem
        agrovet={agrovets[0]}
        onCall={handleCallAgrovet}
        onNavigate={handleNavigateToAgrovet}
      />

      {isExpanded &&
        agrovets.slice(1, 3).map((agrovet, index) => (
          <AgrovetItem
            key={index + 1}
            agrovet={agrovet}
            onCall={handleCallAgrovet}
            onNavigate={handleNavigateToAgrovet}
          />
        ))}

      {agrovets.length > 3 && !isExpanded && (
        <Text style={styles.moreAgrovetsText}>
          +{agrovets.length - 1} more agrovets available
        </Text>
      )}
    </Card>
  );
};

const AgrovetItem: React.FC<{
  agrovet: Agrovet;
  onCall: (phone: string | null) => void;
  onNavigate: (latitude: number, longitude: number) => void;
}> = ({ agrovet, onCall, onNavigate }) => (
  <View style={styles.agrovetItem}>
    <View style={styles.agrovetHeader}>
      <Text style={styles.agrovetName}>{agrovet.name.trim()}</Text>
      <Text style={styles.agrovetDistance}>
        {agrovet.distance_km.toFixed(1)} km
      </Text>
    </View>

    <View style={styles.agrovetProducts}>
      {agrovet.products.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <Text style={styles.productName}>{product}</Text>
          <Text style={styles.productPrice}>KSh {agrovet.prices[index]}</Text>
        </View>
      ))}
    </View>

    <View style={styles.agrovetActions}>
      <TouchableOpacity
        style={styles.agrovetActionButton}
        onPress={() => onNavigate(agrovet.latitude, agrovet.longitude)}
      >
        <Ionicons name="location-outline" size={16} color={Colors.primary.green} />
        <Text style={styles.agrovetActionText}>Navigate</Text>
      </TouchableOpacity>

      {agrovet.phone && (
        <TouchableOpacity
          style={styles.agrovetActionButton}
        //   onPress={() => onCall(agrovet.phone)}
        >
          <Ionicons name="call-outline" size={16} color={Colors.primary.green} />
          <Text style={styles.agrovetActionText}>Call</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  agrovetCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.background.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  cardTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
  },
  agrovetItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  agrovetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  agrovetName: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.families.poppins.semiBold,
    color: Colors.text.primary,
    flex: 1,
  },
  agrovetDistance: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.primary.green,
  },
  agrovetProducts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
  },
  productName: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.text.primary,
    marginRight: Layout.spacing.xs,
  },
  productPrice: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.families.roboto.bold,
    color: Colors.primary.green,
  },
  agrovetActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  agrovetActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  agrovetActionText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.medium,
    color: Colors.primary.green,
    marginLeft: Layout.spacing.xs,
  },
  moreAgrovetsText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});