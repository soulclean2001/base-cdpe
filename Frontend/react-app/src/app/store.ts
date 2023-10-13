import { combineReducers, configureStore, EnhancedStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import counterReducer from '../features/counter/counterSlice'
import userReducer from '../features/User/userSlice'
import authReducer from '../features/Auth/authSlice'
import employerReducer from '../features/Employer/employerSlice'
import jobSeekerReducer from '../features/JobSeeker/jobSeekerSlice'
import chatReducer from '~/features/ChatPage/chatSlice'

const persistConfig: PersistConfig<any> = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth']
}

const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  auth: authReducer,
  employer: employerReducer,
  jobSeeker: jobSeekerReducer,
  chat: chatReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store: EnhancedStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      // }
      serializableCheck: false
    })
})

//
export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
