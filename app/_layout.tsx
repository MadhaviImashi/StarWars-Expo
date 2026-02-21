import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalPeopleProvider } from '../context/LocalPeopleContext';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <LocalPeopleProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: 'People' }} />
            <Stack.Screen name="details/[id]" options={{ title: 'Details' }} />
          </Stack>
        </LocalPeopleProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
