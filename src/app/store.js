import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
})

// set up to be able to set up options in UsersList to refetch on settings given
setupListeners(store.dispatch)
