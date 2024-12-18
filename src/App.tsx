import { ThemeProvider, createTheme } from "@mui/material";

import "./index.css";
import "./App.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/slices";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import {
  createBrowserRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import PipelineComposer from "./routes/PipeLineComposer";
import UserPage from "./routes/OverviewPage";
import { loadState } from "./redux/browser-storage";
import AuthProvider from "./auth/authProvider";
import PrivateRoute from "./router/privateRoute";
import Login from "./routes/LoginPage";
import { Toaster } from "react-hot-toast";
import PrivateAdminRoute from "./router/privateAdminRoute";
import AdminDashboard from "./routes/DashboardPage";
import UserProvider from "./auth/usersProvider";
import PipelineExecutions from "./routes/PipelineExecutions";

// Configure redux-persist
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: loadState(),
});

console.log("store created!");

// here we subscribe to the store changes
// store.subscribe(
//   // we use debounce to save the state once each 800ms
//   // for better performances in case multiple changes occur in a short time
//   () => saveState(store.getState())
// );

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserPage />,
  },
  {
    path: "/pipeline",
    element: <PipelineComposer />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <AuthProvider>
          <UserProvider>
          <div className="App">
            <Provider store={store}>
              {/* <RouterProvider router={router} /> */}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/pipeline" element={<PipelineComposer />} />
                  <Route path="/" element={<UserPage />} />
                  <Route element={<PrivateAdminRoute />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  </Route>
                  <Route path="/pipeline/:id/executions" element={<PipelineExecutions />}></Route>
                </Route>
              </Routes>
            </Provider>
          </div>
          </UserProvider>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
