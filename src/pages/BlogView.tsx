import { useEffect, useState } from "react";
import { supabase } from "../libs/supabase";
import { useParams, Link } from "react-router-dom";

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    supabase.from("blogs").select("*").eq("id", id).single()
      .then(({ data }) => setBlog(data));
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
      <Link to={`/blogs/edit/${blog.id}`}>Edit</Link>
    </div>
  );
}
