import { useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    await supabase.from("blogs").insert({ title, content });
    navigate("/blogs");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Blog</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button>Create</button>
    </form>
  );
}
