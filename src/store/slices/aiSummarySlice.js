import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem('aiSummaryCache');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('aiSummaryCache', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save AI summary cache:', error);
  }
};

const initialState = {
  summaries: loadFromLocalStorage(), // { [videoId]: summaryData }
};

const MAX_CACHED_VIDEOS = 50;

const aiSummarySlice = createSlice({
  name: 'aiSummary',
  initialState,
  reducers: {
    setSummary: (state, action) => {
      const { videoId, data } = action.payload;
      const keys = Object.keys(state.summaries);

      if (keys.length >= MAX_CACHED_VIDEOS && !state.summaries[videoId]) {
        delete state.summaries[keys[0]]; // remove oldest (first inserted)
      }

      state.summaries[videoId] = data;
      saveToLocalStorage(state.summaries);
    },
    clearSummary: (state, action) => {
      delete state.summaries[action.payload];
      saveToLocalStorage(state.summaries);
    },
    clearAllSummaries: (state) => {
      state.summaries = {};
      saveToLocalStorage(state.summaries);
    },
  },
});

export const { setSummary, clearSummary, clearAllSummaries } = aiSummarySlice.actions;
export default aiSummarySlice.reducer;
