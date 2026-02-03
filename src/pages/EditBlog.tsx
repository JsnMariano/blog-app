import { useEffect, useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { uploadImage } from "../libs/uploadImage";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    supabase.from("blogs").select("*").eq("id", id).single()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setCurrentImage(data.image_url);
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

    let image_url: string | null | undefined = undefined;

    if (removeImage) {
      image_url = null;
    } else if (newImage) {
      image_url = await uploadImage(newImage, "blog-images");
    }

    await supabase
      .from("blogs")
      .update({
        title,
        content,
        ...(image_url !== undefined && { image_url }),
      })
      .eq("id", id);

    navigate(`/blogs/${id}`);
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

      {currentImage && !removeImage && (
        <div style={{ marginBottom: "0.75rem" }}>
          <img src={currentImage} alt="Current blog" />
        </div>
      )}

      {currentImage && (
        <label style={{ fontSize: "0.9rem" }}>
          <input
            type="checkbox"
            checked={removeImage}
            onChange={e => setRemoveImage(e.target.checked)}
          />{" "}
          Remove current image
        </label>
      )}

      {!removeImage && (
        <input
          type="file"
          accept="image/*"
          onChange={e =>
            setNewImage(e.currentTarget.files?.[0] ?? null)
          }
        />
      )}

      <button className="primary-btn">Save Changes</button>
    </form>
  );
}
