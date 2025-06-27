// src/components/results/ReportHeader.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Layout } from '../../constants';

interface ReportHeaderProps {
  timestamp: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ timestamp }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.reportHeader}>
      <Text style={styles.reportTitle}>📊 Soil Health Report</Text>
      <Text style={styles.reportDate}>📅 {formatDate(timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  reportHeader: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  reportTitle: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.families.poppins.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  reportDate: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.families.roboto.regular,
    color: Colors.text.secondary,
  },
});