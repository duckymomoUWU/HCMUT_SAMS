import api from "@/lib/Axios";

export const authService = {
  // signUp
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    const res = await api.post(
      "/auth/signup",
      {
        username,
        password,
        email,
        firstName,
        lastName,
      },
      { withCredentials: true },
    );
    return res.data;
  },

  // SignIn
  signIn: async (username: string, password: string) => {
    const res = await api.post(
      "/auth/signin",
      {
        username,
        password,
      },
      { withCredentials: true },
    );
    return res.data; // accessToken
  },

  // signOut
  signOut: async () => {
    return api.post("/auth/signout", { withCredentials: true });
  },

  // fetchMe
  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user ?? res.data; // fallback nếu API không bọc user
  },

  // refresh
  refresh: async () => {
    const res = await api.post("/auth/refresh", { withCredentials: true });
    return res.data.accessToken;
  },
};
