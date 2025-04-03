import { Redirect } from 'expo-router';

// Redirect from the index tab to the workspace tab
export default function IndexRedirect() {
  return <Redirect href="/(tabs)/workspace" />;
}
