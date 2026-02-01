import { useEffect, useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { uploadImage } from "../libs/uploadImage";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    supabase.from("blogs").select("*").eq("id", id).single()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
      });
  }, [id]);

  async function submit(e: SyntheticEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    if (!window.confirm("Save changes to this blog post?")) return;

    const image_url = image ? await uploadImage(image, "blog-images") : undefined;

    await supabase.from("blogs").update({
      title,
      content,
      ...(image_url && { image_url }),
    }).eq("id", id);

    navigate("/blogs");
  }

  return (
    <form className="container" onSubmit={submit}>
      <h2>Edit Blog</h2>

      <input value={title} onChange={e => setTitle(e.currentTarget.value)} required />

      <textarea
        placeholder="Content"
        value={content}
        style={{ border: "1px solid #ccc", padding: "0.75rem", minHeight: "150px" }}
        onInput={e => setContent(e.currentTarget.value)}
        required
      />

      <input type="file" onChange={e => setImage(e.currentTarget.files?.[0] ?? null)} />

      <button className="primary-btn">Save Changes</button>
    </form>
  );
}
