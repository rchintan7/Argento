import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import styles from '../styles';

const SummaryComponent = () => {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>{`# of \n Check-Ins`}</Text>
        <Text style={styles.summaryValue}>{'4'}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>{`Longest\nStreak`}</Text>
        <Text style={styles.summaryValue}>
          {'4'}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>{`# of \n Green Days`}</Text>
        <Text style={styles.summaryValue}>
          {'4'}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>{`Journal\nEntries`}</Text>
        <Text style={styles.summaryValue}>
          {'4'}
        </Text>
      </View>
    </View>
  );
};

export default SummaryComponent;
