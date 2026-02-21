import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import lodash from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchPeople } from '../api/swapi';
import { CreatePersonModal } from '../components/CreatePersonModal';
import { ListFooter } from '../components/ListFooter';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { PersonCard } from '../components/PersonCard';
import { useLocalPeople } from '../context/LocalPeopleContext';

export default function ListScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  // fetch local Data from Context
  const { localPeople } = useLocalPeople();

  // fetch paginated remote Data
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

  // merge local & remote data
  const allPeople = useMemo(() => {
    const remotePeople = remoteData?.pages.flatMap((page) => page.results) || [];
    return [...localPeople, ...remotePeople]; // Local data first, then remote
  }, [localPeople, remoteData]);

  // search
  const filteredPeople = useMemo(() => {
    if (!searchText) return allPeople;
    const searchTextInLowerCase = searchText.toLowerCase();
    return allPeople.filter((person: any) =>
      person.name.toLowerCase().includes(searchTextInLowerCase)
    );
  }, [allPeople, searchText]);

  // debounce searching
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
        onPress={() => {
          let id = item.id;
          // for remote items, extract ID from URL
          if (!item.isLocal && item.url) {
            const parts = item.url.split('/').filter(Boolean);
            id = parts[parts.length - 1];
          }
          
          router.push({
            pathname: '/details/[id]',
            params: { id, isLocal: item.isLocal ? 'true' : 'false' },
          });
        }}
      />
    );
  };

  if (status === 'pending') {
    return <LoadingIndicator />;
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
          placeholder="Search characters..."
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filteredPeople}
        keyExtractor={(item, index) => item?.id || item?.url || index.toString()}
        renderItem={renderItem}
        onEndReached={() => {
          if (!searchText && hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5} // trigger when 50% from the bottom
        ListFooterComponent={
          <ListFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            searchText={searchText}
            onFetchNextPage={fetchNextPage}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No matching results found.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.plusIcon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <CreatePersonModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
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