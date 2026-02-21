import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/landing-page";
import { Dashboard } from "./components/dashboard";
import { Setup } from "./components/setup";
import { Vault } from "./components/vault";
import { Notifications } from "./components/notifications";
import { Preview } from "./components/preview";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/setup",
    Component: Setup,
  },
  {
    path: "/vault",
    Component: Vault,
  },
  {
    path: "/notifications",
    Component: Notifications,
  },
  {
    path: "/preview",
    Component: Preview,
  },
]);
