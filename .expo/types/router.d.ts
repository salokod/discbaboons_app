/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/(drawer)` | `/(app)/(drawer)/(tabs)` | `/(app)/(drawer)/(tabs)/bag` | `/(app)/(drawer)/(tabs)/bag/` | `/(app)/(drawer)/(tabs)/bag/editDisc` | `/(app)/(drawer)/(tabs)/bag/newDisc` | `/(app)/(drawer)/(tabs)/round` | `/(app)/(drawer)/(tabs)/round/` | `/(app)/(drawer)/(tabs)/round/viewRound` | `/(app)/(drawer)/baboonview` | `/(app)/(drawer)/bag` | `/(app)/(drawer)/bag/` | `/(app)/(drawer)/bag/editDisc` | `/(app)/(drawer)/bag/newDisc` | `/(app)/(drawer)/managebags` | `/(app)/(drawer)/round` | `/(app)/(drawer)/round/` | `/(app)/(drawer)/round/viewRound` | `/(app)/(drawer)/settings` | `/(app)/(tabs)` | `/(app)/(tabs)/bag` | `/(app)/(tabs)/bag/` | `/(app)/(tabs)/bag/editDisc` | `/(app)/(tabs)/bag/newDisc` | `/(app)/(tabs)/round` | `/(app)/(tabs)/round/` | `/(app)/(tabs)/round/viewRound` | `/(app)/about` | `/(app)/baboonview` | `/(app)/bag` | `/(app)/bag/` | `/(app)/bag/editDisc` | `/(app)/bag/newDisc` | `/(app)/blog` | `/(app)/contact` | `/(app)/managebags` | `/(app)/round` | `/(app)/round/` | `/(app)/round/viewRound` | `/(app)/settings` | `/(drawer)` | `/(drawer)/(tabs)` | `/(drawer)/(tabs)/bag` | `/(drawer)/(tabs)/bag/` | `/(drawer)/(tabs)/bag/editDisc` | `/(drawer)/(tabs)/bag/newDisc` | `/(drawer)/(tabs)/round` | `/(drawer)/(tabs)/round/` | `/(drawer)/(tabs)/round/viewRound` | `/(drawer)/baboonview` | `/(drawer)/bag` | `/(drawer)/bag/` | `/(drawer)/bag/editDisc` | `/(drawer)/bag/newDisc` | `/(drawer)/managebags` | `/(drawer)/round` | `/(drawer)/round/` | `/(drawer)/round/viewRound` | `/(drawer)/settings` | `/(tabs)` | `/(tabs)/bag` | `/(tabs)/bag/` | `/(tabs)/bag/editDisc` | `/(tabs)/bag/newDisc` | `/(tabs)/round` | `/(tabs)/round/` | `/(tabs)/round/viewRound` | `/_sitemap` | `/about` | `/baboonview` | `/bag` | `/bag/` | `/bag/editDisc` | `/bag/newDisc` | `/blog` | `/contact` | `/forgotpass` | `/forgotuser` | `/login` | `/managebags` | `/passwordreset` | `/register` | `/round` | `/round/` | `/round/viewRound` | `/settings`;
      DynamicRoutes: `/(app)/blog/${Router.SingleRoutePart<T>}` | `/blog/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/blog/[id]` | `/blog/[id]`;
    }
  }
}
