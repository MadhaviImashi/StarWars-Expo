import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchFilm } from '../api/swapi';
import { LoadingIndicator } from './LoadingIndicator';

interface FilmNameItemProps {
  urlOrTitle: string;
}

export const FilmNameItem: React.FC<FilmNameItemProps> = ({ urlOrTitle }) => {
  const isUrl = urlOrTitle.startsWith('http');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['film', urlOrTitle],
    queryFn: () => fetchFilm(urlOrTitle),
    enabled: isUrl, // Only fetch if it's a URL
  });

  if (!isUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{urlOrTitle}</Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingIndicator size="small" />;
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load film</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{data.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
});
