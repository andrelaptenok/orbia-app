import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "@pages/home";
import { NotFoundPage } from "@pages/not-found";
import { RouteErrorBoundary } from "@app/RouteErrorBoundary.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
