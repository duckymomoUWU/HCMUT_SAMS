import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "sonner";
import { authService } from "@/services/authService";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  loading: false,
  error: null,
};

// Đăng ký
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    {
      username,
      password,
      email,
      firstName,
      lastName,
    }: {
      username: string;
      password: string;
      email: string;
      firstName: string;
      lastName: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await authService.signUp(username, password, email, firstName, lastName);
      toast.success(
        "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.",
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Đăng ký không thành công!");
      return rejectWithValue(err.message);
    }
  },
);

// Đăng nhập
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    { username, password }: { username: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { accessToken } = await authService.signIn(username, password);
      dispatch(setAccessToken(accessToken)); // Lưu token vào store
      await dispatch(fetchMe()); // Gọi API lấy thông tin người dùng
      toast.success("Chào mừng bạn quay lại với SASS!");
    } catch (err: any) {
      console.error(err);
      toast.error("Đăng nhập không thành công!");
      return rejectWithValue(err.message);
    }
  },
);

// Lấy thông tin người dùng
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.fetchMe();
      return user;
    } catch (err: any) {
      console.error(err);
      toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
      return rejectWithValue(err.message);
    }
  },
);

// Làm mới token
export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const { user } = (getState() as any).auth;
      const accessToken = await authService.refresh();
      dispatch(setAccessToken(accessToken));
      if (!user) {
        await dispatch(fetchMe());
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      dispatch(clearState());
      return rejectWithValue(err.message);
    }
  },
);

// Đăng xuất
export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await authService.signOut();
      dispatch(clearState());
      toast.success("Logout thành công!");
    } catch (err: any) {
      console.error(err);
      toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
      return rejectWithValue(err.message);
    }
  },
);

// ---------------------------
// Slice chính
// ---------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    clearState: (state) => {
      state.accessToken = null;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
      })

      // signUp / signIn / signOut / refresh
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signUp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signIn.rejected, (state) => {
        state.loading = false;
      })
      .addCase(refresh.pending, (state) => {
        state.loading = true;
      })
      .addCase(refresh.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refresh.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setAccessToken, clearState } = authSlice.actions;
export default authSlice.reducer;
