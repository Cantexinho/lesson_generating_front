export const authService = {
  login: async (username, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },

  getToken: () => {
    return localStorage.getItem("access_token");
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token refresh failed");
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      authService.logout();
      throw error;
    }
  },
};
