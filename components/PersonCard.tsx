import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PersonCardProps {
  person: any;
  onPress: () => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.detail}>Height: {person.height}</Text>
        <Text style={styles.detail}>Born: {person.birth_year}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  localBadge: {
    marginTop: 4,
    fontSize: 12,
    color: 'blue',
    fontWeight: 'bold',
  },
});
