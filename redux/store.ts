import { configureStore } from '@reduxjs/toolkit';
import climbReducer from './climbSlice';

const store = configureStore({
    reducer: {
        climb: climbReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
