import { useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { uploadImage } from "../libs/uploadImage";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    let imageURL: string | null = null;
    if(image){
      imageURL = await uploadImage(image, "blog-images");
    }
    await supabase
    .from("blogs").insert({
      title, 
      content,
      image_url: imageURL
    });
    navigate("/blogs");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Blog</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={e =>
          setImage(e.currentTarget.files?.[0] ?? null)
        }
      />

      <button>Create</button>
    </form>
  );
}
