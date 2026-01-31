import { useEffect, useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { useParams, Link, useNavigate } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  user_id: string;
}

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [{ data: blogData }, { data: userData }] = await Promise.all([
        supabase.from("blogs").select("*").eq("id", id).single(),
        supabase.auth.getUser(),
      ]);

      if (blogData) setBlog(blogData);
      if (userData?.user) setCurrentUserId(userData.user.id);
    }

    fetchData();
  }, [id]);

  async function handleDelete(e: SyntheticEvent) {
    e.preventDefault();

    if (!window.confirm("Delete this blog?")) return;

    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    if (!error) {
      navigate("/blogs");
    }
  }

  if (!blog) return <p>Loading...</p>;

  const isOwner = blog.user_id === currentUserId;

  return (
    <div>
      <h2>{blog.title}</h2>

      {blog.image_url && (
        <img
          src={blog.image_url}
          alt="Blog"
          style={{ maxWidth: "100%" }}
        />
      )}

      <p>{blog.content}</p>

      {/* OWNER-ONLY ACTIONS */}
      {isOwner && (
        <>
          <Link to={`/blogs/edit/${blog.id}`}>Edit</Link>
          {" | "}
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}
