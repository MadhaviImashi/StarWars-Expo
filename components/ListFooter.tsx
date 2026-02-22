import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LoadingIndicator } from './LoadingIndicator';
import { Colors } from '../constants/Colors';

interface ListFooterProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  searchText: string;
  onFetchNextPage: () => void;
}

export const ListFooter: React.FC<ListFooterProps> = ({
  isFetchingNextPage,
  hasNextPage,
  searchText,
  onFetchNextPage,
}) => {
  if (isFetchingNextPage) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
      </View>
    );
  }

  if (searchText.length > 0 && hasNextPage) {
    return (
      <View style={styles.container}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Text style={styles.text}>Didn't find what you're looking for?</Text>
        <Button title="Search Deeper" onPress={onFetchNextPage} color={Colors.primary} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
