import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import BlogView from "./pages/BlogView";
import EditBlog from "./pages/EditBlog";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
          <Route path="/blogs/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
          <Route path="/blogs/:id" element={<ProtectedRoute><BlogView /></ProtectedRoute>} />
          <Route path="/blogs/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
        </Routes>
      </Router>
    </Provider>
  );
}
