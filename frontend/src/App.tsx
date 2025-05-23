import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "@/types";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import CandidateDetails from "./pages/CandidateDetails";
import { API_URL } from "./config";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    const user = {
      id: data.id,
      email: data.email,
      name: data.name,
      token: data.token,
    };

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }
  
    // Login after signup
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!loginResponse.ok) {
      throw new Error("Login failed after registration");
    }
  
    const data = await loginResponse.json();
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      token: data.token,
    };
  
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  };
  

  const handleLogout = () => {
    setUser(null);
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    localStorage.clear(); // if you're using localStorage
    sessionStorage.clear(); // if you switch to sessionStorage
   };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {user && <Navbar user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={setUser} />} 
            />
            <Route 
              path="/register" 
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Register onRegister={(userData) => handleRegister(userData.name, userData.email, userData.password)} />
                )
              } 
            />
            <Route
              path="/candidate/:id"
              element={user ? <CandidateDetails /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;