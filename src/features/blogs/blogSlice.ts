import { createSlice } from "@reduxjs/toolkit";

interface BlogState {
  blogs: any[];
  total: number;
}

const initialState: BlogState = {
  blogs: [],
  total: 0,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action) {
      state.blogs = action.payload.blogs;
      state.total = action.payload.total;
    },
  },
});

export const { setBlogs } = blogSlice.actions;
export default blogSlice.reducer;