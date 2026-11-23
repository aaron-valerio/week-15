"use client";
import { useEffect, useState } from "react";
interface Task { id: number; title: string; category: string; status: string; }
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kuliah");
  const [status, setStatus] = useState("Pending");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const load = async () => { const r = await fetch("/api/tasks"); if (r.ok) setTasks(await r.json()); };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(editingId ? `/api/tasks/${editingId}` : "/api/tasks", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, category, status }), }); if (r.ok) { setMsg(editingId ? "Updated!" : "Created!"); setTitle(""); setEditingId(null); load(); } else setMsg("Gagal (Read-only di Vercel)"); };  const del = async (id: number) => { const r = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (r.ok) { setMsg("Deleted!"); load(); } else setMsg("Gagal hapus");
  };

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h1>Task Manager CRUD</h1>
      {msg && <p style={{ background: "#eef", padding: 10 }}>{msg}</p>}
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input placeholder="Judul tugas" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1, padding: 8 }} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}><option>Kuliah</option><option>Project</option><option>Pribadi</option></select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}><option>Pending</option><option>In Progress</option><option>Selesai</option></select>
        <button type="submit">{editingId ? "Update" : "Tambah"}</button>
      </form>
      <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr><th>ID</th><th>Tugas</th><th>Kategori</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td><td>{t.title}</td><td>{t.category}</td><td>{t.status}</td>
              <td>
                <button onClick={() => { setEditingId(t.id); setTitle(t.title); setCategory(t.category); setStatus(t.status); }}>Edit</button>{" "}
                <button onClick={() => del(t.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
