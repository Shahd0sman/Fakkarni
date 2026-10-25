import api from "./api";

export const authService = {
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.patch("/users/me", userData);
    return response.data;
  },

  async changePassword(passwords) {
    const response = await api.patch("/users/change-password", passwords);
    return response.data;
  },

  async deleteAccount(password) {
    const response = await api.delete("/users/me", { data: { password } });
    return response.data;
  },
};

export default authService;

