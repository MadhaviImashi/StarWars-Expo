import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { createPerson } from '../api/swapi';
import { useLocalPeople } from '../context/LocalPeopleContext';
import { LoadingIndicator } from './LoadingIndicator';
import { Colors } from '@/constants/Colors';

interface CreatePersonModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreatePersonModal: React.FC<CreatePersonModalProps> = ({visible, onClose}) => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [films, setFilms] = useState("");

  const heightInputRef = useRef<TextInput>(null);
  const birthYearInputRef = useRef<TextInput>(null);
  const filmsInputRef = useRef<TextInput>(null);

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
      console.error("Failed to create person:", error);
      alert("Failed to create person. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!name || !height || !birthYear) {
      alert("Please fill in all required fields");
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
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>Create New Person</Text>
          <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 5 }}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => heightInputRef.current?.focus()}
            />

            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              ref={heightInputRef}
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => birthYearInputRef.current?.focus()}
            />

            <Text style={styles.label}>Birth Year</Text>
            <TextInput
              ref={birthYearInputRef}
              style={styles.input}
              value={birthYear}
              onChangeText={setBirthYear}
              returnKeyType="next"
              onSubmitEditing={() => filmsInputRef.current?.focus()}
            />

            <Text style={styles.label}>Film (Optional)</Text>
            <TextInput
              ref={filmsInputRef}
              style={styles.input}
              value={films}
              onChangeText={setFilms}
              returnKeyType="done"
            />
          </ScrollView>
          {mutation.isPending ? (
            <View style={styles.buttonContainer}>
              <LoadingIndicator />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Create" onPress={handleSubmit} color={Colors.primary} />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: "50%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: Colors.text.primary,
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: Colors.text.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
});
