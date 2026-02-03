import { useEffect, useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { uploadImage } from "../libs/uploadImage";
import { useParams, Link, useNavigate } from "react-router-dom";

const COMMENT_PAGE_SIZE = 5;

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const from = (page - 1) * COMMENT_PAGE_SIZE;
    const to = from + COMMENT_PAGE_SIZE - 1;

    Promise.all([
      supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single(),

      supabase
      .from("comments")
      .select("*", { count: "exact" })
      .eq("blog_id", id)
      .range(from, to),

      supabase.auth.getUser(),
    ]).then(([b, c, u]) => {
      setBlog(b.data);
      setComments(c.data ?? []);
      setTotal(c.count ?? 0);
      setUserId(u.data.user?.id ?? null);
    });
  }, [id, page]);

  async function deleteBlog() {
    if (!window.confirm("Delete this blog post permanently?")) return;
    await supabase
    .from("blogs")
    .delete()
    .eq("id", id);

    navigate("/blogs");
  }

  async function addComment(e: SyntheticEvent) {
    e.preventDefault();

    if (!text.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    if (!window.confirm("Post this comment?")) return;

    const user = await supabase.auth.getUser();
    const image_url = image ? await uploadImage(image, "comment-images") : null;

    const { data } = await supabase.from("comments").insert({
      blog_id: id,
      content: text,
      image_url,
      user_id: user.data.user?.id,
      author_email: user.data.user?.email,
    }).select().single();

    if (data) {setComments(prev => [...prev, data]);
      setTotal(prev => prev + 1);

      const newTotal = total + 1;
      const newLastPage = Math.max(
        1,
        Math.ceil(newTotal / COMMENT_PAGE_SIZE)
      );
      setPage(newLastPage);
    }
    setText("");
    setImage(null);
  }

  if (!blog) return <p className="empty-state">Loading...</p>;

  const isOwner = blog.user_id === userId;
  const totalPages = Math.max(1, Math.ceil(total / COMMENT_PAGE_SIZE));

  function handlePrev(e: SyntheticEvent){
    e.preventDefault();
    setPage(prev => Math.max(prev - 1, 1));
  }

  function handleNext(e: SyntheticEvent){
    e.preventDefault();
    setPage(prev => Math.min(prev + 1, totalPages));
  }

  return (
    <div className="container">
      <h2>{blog.title}</h2>

      <p className="meta">
        By {blog.author_email} ·{" "}
        {new Date(blog.updated_at || blog.created_at).toLocaleDateString()}
      </p>

      {blog.image_url && <img src={blog.image_url} />}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      {isOwner && (
        <div style={{ marginTop: "0.75rem" }}>
          <Link className="primary-btn" to={`/blogs/edit/${blog.id}`}>Edit</Link>{" "}
          <button className="danger-btn" onClick={deleteBlog}>Delete</button>
        </div>
      )}

      <hr />

      <h3>Comments</h3>

      {comments.length === 0 ? (
        <p className="empty-state">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map(c => (
          <div key={c.id} className="blog-card">
            <p className="meta">
              {c.author_email} · {new Date(c.created_at).toLocaleDateString()}
            </p>
            <p>{c.content}</p>
            {c.image_url && <img src={c.image_url} />}
          </div>
        ))
      )}

      <div>
        <button
        className="small-btn" 
        onClick={(handlePrev)}
        disabled={page === 1}>
          Prev
        </button>

        <span className="meta"> Page {page} of {totalPages || 1} </span>
        <button
        className="small-btn"
        disabled={page === totalPages}
        onClick={handleNext}>
          Next
        </button>
      </div>

      {userId && (
        <form onSubmit={addComment}>
          <textarea value={text} onChange={e => setText(e.currentTarget.value)} />
          <input type="file" onChange={e => setImage(e.currentTarget.files?.[0] ?? null)} />
          <button className="small-btn">Comment</button>
        </form>
      )}
    </div>
  );
}
