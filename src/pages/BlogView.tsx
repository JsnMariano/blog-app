import { useEffect, useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { useParams, Link, useNavigate } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
}

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setBlog(data));
  }, [id]);

  async function handleDelete(e: SyntheticEvent) {
    e.preventDefault();

    if (!window.confirm("Delete this blog?")) return;

    await supabase.from("blogs").delete().eq("id", id);
    navigate("/blogs");
  }

  if (!blog) return <p>Loading...</p>;

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

      <Link to={`/blogs/edit/${blog.id}`}>Edit</Link>
      {" | "}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
