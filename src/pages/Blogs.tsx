import { useEffect, useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { Link } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
}

const PAGE_SIZE = 3;

export default function Blogs() {


  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  
  useEffect(() => {
    async function fetchBlogs() {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const {data, count, error} = await supabase
      .from("blogs")
      .select("id, title", {count : "exact"})
      .range(from, to)
      .order("created_at", {ascending: false});

      if(!error && data){
        setBlogs(data);
        setTotal(count ?? 0);
      }
    }
    fetchBlogs();
  },[page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function handlePrev(e: SyntheticEvent){
    e.preventDefault();
    setPage(prev => Math.max(prev - 1, 1))
  }

  function handleNext(e: SyntheticEvent){
    e.preventDefault();
    setPage(prev => Math.min(prev + 1, totalPages));
  }

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

      <div>
        <button onClick={handlePrev} disabled={page === 1}>
          Previous
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button onClick={handleNext} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
