import { ThemeProvider, createTheme } from "@mui/material";

import "./index.css";
import "./App.css";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/slices";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import {
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import PipelineComposer from "./routes/PipeLineComposer";
import UserPage from "./routes/OverviewPage";
import { loadState, saveState } from "./redux/browser-storage";
import AuthProvider from "./auth/authProvider";
import PrivateRoute from "./router/privateRoute";
import Login from "./routes/LoginPage";
import { fetchRepositoryPipelineList } from "./services/backendAPI";
import { setPipelines } from "./redux/slices/pipelineSlice";

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

// const dispatch = useDispatch();
// const localStateData = loadState();
// console.log("before-localStateData", localStateData);

// const fetcDbPipelines = async () => {
//   try {
//     const organization = localStateData.apiState.organizations[0];
//     const repository = localStateData.apiState.repositories[0];

//     const pipelines = await fetchRepositoryPipelineList(
//       organization.id,
//       repository.id
//     );

//     if (pipelines) return pipelines;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return {};
//   }
// };
// const updatePipelines = async () => {
//   const dbPipelines = await fetcDbPipelines(); // Wait for the promise to resolve
//   if (dbPipelines) {
//     console.log("dbPipelines : ", dbPipelines);

//     // Spread and create new state structure
//     const newPipelineState = {
//       ...localStateData.pipelineState, // Create a new pipeline state object
//       pipelines: [...localStateData.pipelineState.pipelines, ...dbPipelines], // Ensure a new array is created
//     };

//     // Dispatch the new pipeline state to Redux
//     dispatch(setPipelines(newPipelineState)); // Assuming setPipelineData is your Redux action to set the pipeline state
//   }
// };
// updatePipelines();
// console.log("localStateData", localStateData);

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: loadState(),
});

// here we subscribe to the store changes
store.subscribe(
  // we use debounce to save the state once each 800ms
  // for better performances in case multiple changes occur in a short time
  () => saveState(store.getState())
);

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
]);


export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Provider store={store}>
              {/* <RouterProvider router={router} /> */}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/pipeline" element={<PipelineComposer />} />
                  <Route path="/" element={<UserPage />} />
                </Route>
              </Routes>
            </Provider>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
