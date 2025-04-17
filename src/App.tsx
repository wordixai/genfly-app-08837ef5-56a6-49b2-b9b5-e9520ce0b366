import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import MatchesPage from "@/pages/MatchesPage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { TRPCProvider } from "@/server/trpc/provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import PremiumPage from "@/pages/PremiumPage";
import PassportPage from "@/pages/PassportPage";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TRPCProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<HomePage />} />
                <Route path="matches" element={<MatchesPage />} />
                <Route path="chat/:conversationId" element={<ChatPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="premium" element={<PremiumPage />} />
                <Route path="passport" element={<PassportPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </I18nextProvider>
    </TRPCProvider>
  </QueryClientProvider>
);

export default App;