/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/(drawer)` | `/(app)/(drawer)/(tabs)` | `/(app)/(drawer)/(tabs)/bag` | `/(app)/(drawer)/(tabs)/bag/` | `/(app)/(drawer)/(tabs)/bag/editDisc` | `/(app)/(drawer)/(tabs)/bag/newDisc` | `/(app)/(drawer)/(tabs)/round` | `/(app)/(drawer)/bag` | `/(app)/(drawer)/bag/` | `/(app)/(drawer)/bag/editDisc` | `/(app)/(drawer)/bag/newDisc` | `/(app)/(drawer)/favourites` | `/(app)/(drawer)/round` | `/(app)/(drawer)/settings` | `/(app)/(tabs)` | `/(app)/(tabs)/bag` | `/(app)/(tabs)/bag/` | `/(app)/(tabs)/bag/editDisc` | `/(app)/(tabs)/bag/newDisc` | `/(app)/(tabs)/round` | `/(app)/about` | `/(app)/bag` | `/(app)/bag/` | `/(app)/bag/editDisc` | `/(app)/bag/newDisc` | `/(app)/blog` | `/(app)/contact` | `/(app)/favourites` | `/(app)/round` | `/(app)/settings` | `/(drawer)` | `/(drawer)/(tabs)` | `/(drawer)/(tabs)/bag` | `/(drawer)/(tabs)/bag/` | `/(drawer)/(tabs)/bag/editDisc` | `/(drawer)/(tabs)/bag/newDisc` | `/(drawer)/(tabs)/round` | `/(drawer)/bag` | `/(drawer)/bag/` | `/(drawer)/bag/editDisc` | `/(drawer)/bag/newDisc` | `/(drawer)/favourites` | `/(drawer)/round` | `/(drawer)/settings` | `/(tabs)` | `/(tabs)/bag` | `/(tabs)/bag/` | `/(tabs)/bag/editDisc` | `/(tabs)/bag/newDisc` | `/(tabs)/round` | `/_sitemap` | `/about` | `/bag` | `/bag/` | `/bag/editDisc` | `/bag/newDisc` | `/blog` | `/contact` | `/favourites` | `/forgotpass` | `/forgotuser` | `/login` | `/passwordreset` | `/register` | `/round` | `/settings`;
      DynamicRoutes: `/(app)/blog/${Router.SingleRoutePart<T>}` | `/blog/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/blog/[id]` | `/blog/[id]`;
    }
  }
}
