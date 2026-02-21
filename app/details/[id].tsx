import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchPerson } from '../../api/swapi';
import { FilmNameItem } from '../../components/FilmNameItem';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Colors } from '../../constants/Colors';
import { useLocalPeople } from '../../context/LocalPeopleContext';

export default function DetailScreen() {
  const { id, isLocal } = useLocalSearchParams<{ id: string; isLocal: string }>();
  const isLocalBool = isLocal === 'true';

  const { getLocalPersonById } = useLocalPeople();

  const { data: remotePerson, isLoading: isRemoteLoading, isError: isRemoteError } = useQuery({
    queryKey: ['person', id],
    queryFn: async () => fetchPerson(id),
    enabled: !isLocalBool, // to avoid automatic refetching when viewing a locally created person
  });

  const person = isLocalBool ? getLocalPersonById(id) : remotePerson;
  const isLoading = isLocalBool ? false : isRemoteLoading;
  const isError = isLocalBool ? !person : isRemoteError;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError || !person) {
    return (
      <View style={styles.center}>
        <Text>Error loading details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{headerShown: true, title: ''}} />
      
      <View style={styles.header}>
        <Text style={styles.name}>{person.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Height:</Text>
        <Text style={styles.value}>{person.height}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Birth Year:</Text>
        <Text style={styles.value}>{person.birth_year}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Films:</Text>
        {person?.films && person?.films.length > 0 ? (
          person.films.map((film: string, index: number) => (
            <FilmNameItem key={index} urlOrTitle={film} />
          ))
        ) : (
          <Text style={styles.value}>None</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    // paddingVertical: 25,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    backgroundColor: Colors.secondary,
    paddingTop: 15,
    paddingBottom: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  localBadge: {
    color: Colors.text.link,
    marginTop: 5,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
