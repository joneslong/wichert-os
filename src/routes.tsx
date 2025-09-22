import { createHashRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";

import HomePage from "@/pages/HomePage";
import TasksPage from "@/pages/TasksPage";
import TasksCalendarPage from "@/pages/TasksCalendarPage";
import EmailsPage from "@/pages/EmailsPage";
import SyncPage from "@/pages/SyncPage";
import FamilyPage from "@/pages/FamilyPage";
import FamilyCalendarPage from "@/pages/FamilyCalendarPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "tasks-calendar", element: <TasksCalendarPage /> },
      { path: "emails", element: <EmailsPage /> },
      { path: "sync", element: <SyncPage /> },
      { path: "family", element: <FamilyPage /> },
      { path: "family-calendar", element: <FamilyCalendarPage /> },
    ],
  },
]);
