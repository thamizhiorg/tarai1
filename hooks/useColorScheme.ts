import { useColorScheme as _useColorScheme } from 'react-native';

// Override the useColorScheme hook to always return 'light'
export function useColorScheme(): 'light' {
  return 'light';
}
