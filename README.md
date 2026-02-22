# StarWars App - Expo
This is the Expo app i implemented for the LiquidLabs TakeHome Assignment

## Prerequisites:

- Node.js version 18 or higher (20+ is recommended) as i have used the latest React Native version.
- Fastest way to run the app in a physical device is by using the ExpoGo app. Or else can run from an ios emulator (with Xcode) or an android emulator (using AndroidStudio).

## Steps to run the App:

1. Clone the repo & Navigate to the project folder
   
   ```bash
   git clone https://github.com/MadhaviImashi/StarWars-Expo.git
   cd StarWars
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the app

   ```bash
   npm start
   ```

Once the server is running, you'll find options in the terminal to open the app in a preferred way (scan the QR code and open from ExpoGo app to run the app in a physical device | type a to open in Android emulator | type i to open in iOS emulator )

## Reasons for using specific frameworks or libraries: 

1. Expo - Used as per the guidelines
2. Tanstack Query - Used for efficient server state management. It handles caching (so we don't re-fetch data unnecessarily when navigating back), simplifies the loading state and error handling. It also provides infinite scrolling capabilities via `useInfiniteQuery` which was essential for the paginated people list.
3. Expo-crypto - Used to generate unique UUIDs for locally created users. 
4. Axios - Used since it provides a cleaner API than fetch with automatic JSON parsing. Also, Axios automatically rejects the promise when status code is 4xx or 500 (unlike fetch), which made simulating successful POST request easier.
5. ReactNative Safe Area Context - Used it to handle ios notches & android status bars.

## Performance Enhancements:
- Leveraged TanStack Query's caching to avoid unnecessary refetching of same data.
- Implemented Memoization on the PersonCard component & useCallback on the renderItem function to prevent unnecessary re-renders of list items during updates.
- Implemented debouncing for the search input to prevent filtering logic from running on every keystroke for better UIUX.

## Please Note:

- The locally created user entries aren't persist accross app reloads as per the requirement. But the state is maintained while using the app (using Context API).
- Also, No .env file is included as this demo app does not require confidential API keys. the configuration constants are stored in `Constants/Config.ts`.