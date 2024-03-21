import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'dark',
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // ini merupakan function yang dapat kita gunakan di global untuk mengurangi kode yang sama di gunakan
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('User friends tidak ada');
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    // Untuk memperbarui like, dimana jika post id sebelumnya sama dengan post id yang likenya diperbarui maka akan mereturn nilai post id tersebut yang baru, jikalau tidak sama maka akan mereturn nilai post sebelumnya
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;
