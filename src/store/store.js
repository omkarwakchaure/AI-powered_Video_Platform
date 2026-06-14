import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./slices/sidebarSlice";
import searchSlice from "./slices/searchSlice";
import chatSlice from "./slices/chatSlice";
import aiSummarySlice from "./slices/aiSummarySlice";

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    search: searchSlice,
    chat: chatSlice,
    aiSummary: aiSummarySlice
  },
});

export default store;
