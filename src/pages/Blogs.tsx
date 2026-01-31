import { useEffect, useState } from "react";
import { supabase } from "../libs/supabase";
import { Link } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    supabase.from("blogs").select("id,title").then(({ data }) => {
      if (data) setBlogs(data);
    });
  }, []);

  return (
    <div>
      <h2>Blogs</h2>
      <Link to="/blogs/create">Create Blog</Link>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
