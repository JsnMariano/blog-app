import { useEffect, useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { Link } from "react-router-dom";

const PAGE_SIZE = 6;
const DEFAULT_IMAGE = "/default-blog.jpg";

export default function Blogs() {

  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  
  useEffect(() => {

    async function fetchBlogs() {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

    supabase
      .from("blogs")
      .select("*", {count : "exact"})
      .range(from, to)
      .order("created_at", {ascending: false})
      .then(({data, count}) =>{
        setBlogs(data ?? []);
        setTotal(count ?? 0);
      });
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
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Blogs</h2>
        <Link to="/blogs/create">Create Blog</Link>
      </div>

      {blogs.length === 0 ? (
        <p className="empty-state">No posts yet. Be the first!</p>
      ) : (
        <div className="blog-grid">
          {blogs.map(blog => (
            <Link to={`/blogs/${blog.id}`} key={blog.id} className="blog-card">
              <img src={blog.image_url || DEFAULT_IMAGE} alt={blog.title} />
              <div className="blog-card-body">
                <h3>{blog.title}</h3>
                <p className="meta">
                  {blog.author_email} · {new Date(blog.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{marginTop: "1 rem"}}>
        <button
          className="small-btn"
          onClick={handlePrev} 
          disabled={page === 1}>
          Previous
        </button>

        <span className="meta">
          Page {page} of {totalPages || 1} </span>

        <button
          className="small-btn"
          onClick={handleNext}
          disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
