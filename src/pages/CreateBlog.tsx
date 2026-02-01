import { useState, type SyntheticEvent, useEffect } from "react";
import { supabase } from "../libs/supabase";
import { uploadImage } from "../libs/uploadImage";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  /* Warn before leaving */
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (title || content) {
        e.preventDefault();

      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [title, content]);

  async function submit(e: SyntheticEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    if (!window.confirm("Publish this blog post?")) return;

    const user = await supabase.auth.getUser();

    const image_url = image
      ? await uploadImage(image, "blog-images")
      : null;

    await supabase.from("blogs").insert({
      title,
      content, // HTML stored
      image_url,
      user_id: user.data.user?.id,
      author_email: user.data.user?.email,
    });

    navigate("/blogs");
  }

  return (
    <form className="container" onSubmit={submit}>
      <h2>Create Blog</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.currentTarget.value)}
        required
      />

      {/* Editor */}
      <textarea
        placeholder="Content"
        value={content}
        style={{ border: "1px solid #ccc", padding: "0.75rem", minHeight: "150px" }}
        onInput={e => setContent(e.currentTarget.value)}
        required
      />

      <input 
      type="file" 
      onChange={e =>
        setImage(e.currentTarget.files?.[0] ?? null)
        } 
      />

      <button className="primary-btn">Publish</button>
    </form>
  );
}
