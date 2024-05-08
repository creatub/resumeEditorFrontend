import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./features/timer/timerSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
