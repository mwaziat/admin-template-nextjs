import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
import { middleware } from "./middleware";
import generalSettingsSlice from "./features/general-settings/generalSettingsSlice";
import authReduxSlice from './features/auth/authSlice';

const appReducer = combineReducers({
  auth: authReduxSlice,
  generalSettings: generalSettingsSlice
  /* posts: postsReducer,
  comments: commentsReducer,
  users: usersReducer, */
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "payroll",
  storage: storage,
  whitelist: ["generalSettings", "auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
