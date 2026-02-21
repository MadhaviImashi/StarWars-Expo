import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchPeople } from '../api/swapi';
import { PersonCard } from '../components/PersonCard';

export default function ListScreen() {
  const [searchText, setSearchText] = useState('');

  // fetch paginated people data
  const {
    data: remoteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['people'],
    queryFn: ({ pageParam = 1 }) => fetchPeople(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        // Extract page number from next URL or just increment
        const url = new URL(lastPage.next);
        const page = url.searchParams.get('page');
        return page ? parseInt(page) : allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Debounced Search Handler
  const handleSearch = useCallback(
    lodash.debounce((text: string) => {
      setSearchText(text);
    }, 300),
    []
  );

  const renderItem = ({ item }: { item: any }) => {
    if (!item) return null;

    return (
      <PersonCard
        person={item}
        onPress={() => {}}
      />
    );
  };

  if (status === 'pending') {
    return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text>Error loading data: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people..."
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={remoteData?.pages.flatMap((page) => page.results) || []}
        keyExtractor={(item, index) => item?.id || item?.url || index.toString()}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  plusIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
