import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Simple layout for public pages like Login, Register, Home */}
      <main>
        <Outlet /> {/* Login, Register, ForgotPassword pages render here */}
      </main>
    </div>
  );
};

export default MainLayout;