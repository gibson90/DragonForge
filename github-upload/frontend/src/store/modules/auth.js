// frontend/src/store/auth.js (Pinia version)
import { defineStore } from 'pinia';
import api from "@/services/api";
import SocketService from "@/services/socket";
import { ref, watch, toRaw } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || {});
  const status = ref("");

  watch(token, (newToken) => {
    newToken ? localStorage.setItem("token", newToken) : localStorage.removeItem("token");
  });

  watch(refreshToken, (newRefreshToken) => {
    newRefreshToken ? localStorage.setItem("refreshToken", newRefreshToken) : localStorage.removeItem("refreshToken");
  });

  watch(user, (newUser) => {
    newUser && Object.keys(newUser).length > 0
      ? localStorage.setItem("user", JSON.stringify(toRaw(newUser))) // ✅ FIX: Remove reactivity before storing
      : localStorage.removeItem("user");
  });

  const isAuthenticated = () => !!token.value;
  const authStatus = () => status.value;
  const getUser = () => user.value;

  async function registerUser(userData) {
    status.value = "loading";
    try {
      const response = await api.post("/auth/register", userData);
      const { accessToken, refreshToken, user: userInfo } = response.data;

      token.value = accessToken;
      refreshToken.value = refreshToken;
      user.value = userInfo;
      status.value = "success";

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userInfo)); // ✅ FIX: Store user data as string

      return response.data; // ✅ FIX: Return only serializable data
    } catch (error) {
      status.value = "error";
      throw error;
    }
  }

  async function loginUser(credentials) {
    status.value = "loading";
    try {
      const response = await api.post("/auth/login", credentials);
      const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data;

      token.value = accessToken;
      refreshToken.value = newRefreshToken;
      user.value = userData;
      status.value = "success";

      SocketService.initialize();


      return response.data; // ✅ FIX: Return only JSON-serializable data
    } catch (error) {
      status.value = "error";
      throw error;
    }
  }

  function logout() {
    status.value = "";
    token.value = null;
    refreshToken.value = null;
    user.value = {};
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    console.log("User logged out", isAuthenticated.value); // ✅ FIX: Log user logout
  }

  return { token, refreshToken, user, status, isAuthenticated, authStatus, getUser, registerUser, loginUser, logout };
});
