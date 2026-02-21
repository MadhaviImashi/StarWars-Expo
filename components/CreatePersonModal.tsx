import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { createPerson } from '../api/swapi';
import { useLocalPeople } from '../context/LocalPeopleContext';
import { LoadingIndicator } from './LoadingIndicator';

interface CreatePersonModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreatePersonModal: React.FC<CreatePersonModalProps> = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [films, setFilms] = useState('');
  
  const { addLocalPerson } = useLocalPeople();

  const resetForm = () => {
    setName('');
    setHeight('');
    setBirthYear('');
    setFilms('');
  };

  const mutation = useMutation({
    mutationFn: async (newPerson: any) => {
      await createPerson(newPerson);
      return newPerson; // return the person data to be used in onSuccess
    },
    onSuccess: (newPerson) => {
      addLocalPerson(newPerson); // add to local Context state
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error('Failed to create person:', error);
      alert('Failed to create person. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!name || !height || !birthYear) {
      alert('Please fill in all required fields');
      return;
    }

    const newPerson = {
      name,
      height,
      birth_year: birthYear,
      films: films ? [films] : [],
    };

    mutation.mutate(newPerson);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create New Person</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Height"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Birth Year"
            value={birthYear}
            onChangeText={setBirthYear}
          />
          <TextInput
            style={styles.input}
            placeholder="Film"
            value={films}
            onChangeText={setFilms}
          />

          {mutation.isPending ? (
            <LoadingIndicator />
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} color="red" />
              <Button title="Create" onPress={handleSubmit} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
