import { RegisterForm } from "@/components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSuccess = () => {
    navigate("/");
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}