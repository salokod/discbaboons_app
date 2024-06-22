import { Slot } from "expo-router";
import { DataProviderContext } from "../context/DataContext";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <DataProviderContext>
      <Slot />
    </DataProviderContext>
  );
}
