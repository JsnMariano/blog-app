import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Blogs from "./pages/Blogs";
import BlogView from "./pages/BlogView";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogView />} />

        {/* Protected */}
        <Route
          path="/blogs/create"
          element={<ProtectedRoute><CreateBlog /></ProtectedRoute>}
        />
        <Route
          path="/blogs/edit/:id"
          element={<ProtectedRoute><EditBlog /></ProtectedRoute>}
        />

        <Route path="/" element={<Navigate to="/blogs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
