import React, { createContext, useContext, useState, ReactNode } from 'react';
import { randomUUID } from 'expo-crypto';

interface Person {
  id: string;
  name: string;
  height: string;
  birth_year: string;
  films: string[];
  isLocal: boolean;
}

interface LocalPeopleContextType {
  localPeople: Person[];
  addLocalPerson: (person: Omit<Person, 'id' | 'isLocal'>) => void;
}

const LocalPeopleContext = createContext<LocalPeopleContextType | undefined>(undefined);

export const LocalPeopleProvider = ({ children }: { children: ReactNode }) => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);

  const addLocalPerson = (person: Omit<Person, 'id' | 'isLocal'>) => {
    const newPerson: Person = {
      ...person,
      id: randomUUID(),
      isLocal: true,
    };
    setLocalPeople((prev) => [newPerson, ...prev]);
  };

  return (
    <LocalPeopleContext.Provider value={{ localPeople, addLocalPerson }}>
      {children}
    </LocalPeopleContext.Provider>
  );
};

// custom hook for easy access to the LocalPeopleContext
export const useLocalPeople = () => {
  const context = useContext(LocalPeopleContext);
  if (!context) {
    throw new Error('useLocalPeople must be used within a LocalPeopleProvider');
  }
  return context;
};
