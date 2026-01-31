import { useEffect, useState, type SyntheticEvent} from "react";
import { supabase } from "../libs/supabase";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    supabase.from("blogs").select("*").eq("id", id).single()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
      });
  }, [id]);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    await supabase.from("blogs").update({ title, content }).eq("id", id);
    navigate("/blogs");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Blog</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button>Update</button>
    </form>
  );
}
