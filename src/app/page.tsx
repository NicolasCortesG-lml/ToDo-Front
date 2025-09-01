"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  uid: number;
  title: string;
  completed: boolean;
  prioridad: number;
  contexto: string | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  message: string;
  inserted_at: string;
};

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL;

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  // Declara userEmail justo después de session
  const userEmail = session?.user?.email;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newContexto, setNewContexto] = useState("");
  const [newPrioridad, setNewPrioridad] = useState(2);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [showTour, setShowTour] = useState(false);
  const [tourType, setTourType] = useState<"add" | "delete" | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      } else {
        setSession(data.session);
      }
    });
  }, [router]);

  // Nuevo efecto: carga tareas y mensajes cuando el email esté disponible
  useEffect(() => {
    if (userEmail) {
      fetchTasks();
      fetchMessages();
    }
  }, [userEmail]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchTasks() {
    if (!userEmail) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_email", userEmail) // Solo tareas del usuario
      .order("inserted_at", { ascending: false });

    if (error) console.error(error);
    if (data) setTasks(data as Task[]);
  }

  async function addTask() {
    if (!newTask.trim()) return;
    await supabase.from("tasks").insert([
      {
        title: newTask,
        prioridad: newPrioridad,
        contexto: newContexto,
        user_email: userEmail, // Guarda el email del usuario
      },
    ]);
    setNewTask("");
    setNewContexto("");
    setNewPrioridad(2);
    fetchTasks();
  }

  async function toggleTask(id: string, completed: boolean) {
    await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", id)
      .eq("user_email", userEmail); // Solo modifica si es del usuario
    fetchTasks();
  }

  async function updatePrioridad(id: string, prioridad: number) {
    await supabase
      .from("tasks")
      .update({ prioridad })
      .eq("id", id)
      .eq("user_email", userEmail); // Solo modifica si es del usuario
    fetchTasks();
  }

  async function updateContexto(id: string, contexto: string) {
    await supabase
      .from("tasks")
      .update({ contexto })
      .eq("id", id)
      .eq("user_email", userEmail); // Solo modifica si es del usuario
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail); // Solo elimina si es del usuario
    fetchTasks();
  }

  async function fetchMessages() {
    if (!userEmail) return;
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_email", userEmail) // Solo mensajes del usuario
      .order("inserted_at", { ascending: true });

    if (!error && data) setMessages(data as ChatMessage[]);
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    await supabase.from("chat_messages").insert([
      { role: "user", message: newMessage, user_email: userEmail }
    ]);

    setNewMessage("");
    fetchMessages();

    if (!CHAT_API_URL) {
      console.error("CHAT_API_URL is not defined.");
      return;
    }
    const res = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage, user_email: userEmail }),
    });

    const data = await res.json();

    await supabase.from("chat_messages").insert([
      { role: "assistant", message: data.mensaje, user_email: userEmail }
    ]);

    fetchTasks();
    fetchMessages();

    // Navegación automática si el backend lo indica
    if (
      data.WebStrategy &&
      typeof data.WebStrategy === "object" &&
      "NavigateTo" in data.WebStrategy &&
      typeof data.WebStrategy.NavigateTo === "string"
    ) {
      router.push(data.WebStrategy.NavigateTo);
    }

    // Mostrar tour si el backend lo indica
    if (
      data.WebStrategy &&
      typeof data.WebStrategy === "object" &&
      "Marcador" in data.WebStrategy
    ) {
      if (data.WebStrategy.Marcador === "task_add") {
        setTourType("add");
        setShowTour(true);
      }
      if (data.WebStrategy.Marcador === "delete_chat") {
        setTourType("delete");
        setShowTour(true);
      }
    }
  }

  async function deleteConversation() {
    if (!userEmail) return;
    await supabase
      .from("chat_messages")
      .delete()
      .eq("user_email", userEmail);
    fetchMessages();
  }


  if (!session) return null; // Evita mostrar cosas antes de saber

  return (
    <main className="min-h-screen h-screen flex flex-row" style={{ background: "#121212" }}>
      {/* Left Panel - ToDo List */}
      <div className="w-1/2 h-full p-6 flex flex-col" style={{ background: "#F3F4F6", position: "relative" }}>
        {/* Manual Tour Tooltip for Add Task */}
        {showTour && tourType === "add" && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 100,
              background: "#fff",
              color: "#121212",
              border: "2px solid #2196F3",
              borderRadius: 8,
              padding: "16px 20px",
              boxShadow: "0 4px 16px rgba(33,150,243,0.15)",
              maxWidth: 320
            }}
          >
            <strong>Quick tip:</strong>
            <div style={{ marginTop: 8 }}>
              Fill in the task details below and click <b>Add</b> to create your task!
            </div>
            <button
              style={{
                marginTop: 12,
                background: "#2196F3",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => setShowTour(false)}
            >
              Got it!
            </button>
          </div>
        )}

        {/* New Task Form */}
        <div
          className="flex flex-col gap-2 mb-6 w-full p-4 rounded"
          style={{ background: "#F5F5F5" }}
        >
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#424242" }}>Add a task</h2>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task title..."
            className="p-2 border rounded"
            style={{ color: "#424242" }}
          />
          <textarea
            value={newContexto}
            onChange={(e) => setNewContexto(e.target.value)}
            placeholder="Context or notes..."
            className="p-2 border rounded"
            style={{ color: "#424242" }}
          />
          <select
            value={newPrioridad}
            onChange={(e) => setNewPrioridad(Number(e.target.value))}
            className="p-2 border rounded"
            style={{ color: "#424242" }}
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
          <button
            onClick={() => {
              addTask();
              setShowTour(false); // Oculta el tour al agregar la tarea
            }}
            className="px-4 py-2 rounded font-bold"
            style={{ background: "#2196F3", color: "#fff", fontWeight: "bold" }}
          >
            Add
          </button>
        </div>

        {/* Task List with scroll */}
        <div className="w-full flex-1 overflow-y-auto">
          {/* Title above the list */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold" style={{ color: "#121212" }}>Tasks</h2>
            <span className="text-2xl">👉</span>
          </div>
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 mb-3 rounded shadow flex flex-col gap-2"
                style={{ background: "#E3F2FD", color: "#121212" }}
              >
                {/* Header with ID and title */}
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#000", fontWeight: "bold" }}
                  >
                    ID-{task.uid}
                  </span>
                  <span
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`cursor-pointer font-bold ${
                      task.completed ? "line-through" : ""
                    }`}
                    style={{
                      color: "#000",
                      fontWeight: "bold"
                    }}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 font-bold"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>

                {/* Editable context */}
                <textarea
                  defaultValue={task.contexto ?? ""}
                  onBlur={(e) => updateContexto(task.id, e.target.value)}
                  placeholder="Add context..."
                  className="w-full p-2 border rounded"
                  style={{ background: "#90CAF9", color: "#121212" }}
                />

                {/* Priority selector */}
                <div>
                  <label className="mr-2" style={{ color: "#9E9E9E" }}>Priority:</label>
                  <select
                    value={task.prioridad}
                    onChange={(e) =>
                      updatePrioridad(task.id, Number(e.target.value))
                    }
                    className="p-1 border rounded"
                    style={{ background: "#90CAF9", color: "#121212" }}
                  >
                    <option value={1}>High</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Low</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="w-1/2 h-full flex flex-col border-l p-4" style={{ background: "#F5F5F5", position: "relative" }}>
        {/* Title and icons above chat */}
        <div className="flex items-center gap-3 mb-2" style={{ position: "relative" }}>
          <span className="text-xl font-bold" style={{ color: "#121212" }}>
            Page Assistant
          </span>
          <span className="text-2xl">💬</span>
          <span className="text-2xl ml-auto">🤖</span>
          <button
            id="delete-chat-btn"
            onClick={deleteConversation}
            className="ml-4 px-3 py-1 rounded font-bold"
            style={{ background: "#D32F2F", color: "#fff" }}
            title="Delete conversation"
          >
            🗑️
          </button>
          {/* Manual Tour Tooltip for Delete Chat */}
          {showTour && tourType === "delete" && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                background: "#fff",
                color: "#121212",
                border: "2px solid #D32F2F",
                borderRadius: 8,
                padding: "16px 20px",
                boxShadow: "0 4px 16px rgba(211,47,47,0.15)",
                maxWidth: 320,
                textAlign: "right",
                zIndex: 100
              }}
            >
              <strong>Quick tip:</strong>
              <div style={{ marginTop: 8 }}>
                To delete the entire conversation, click the <b>trash</b> button!
              </div>
              <button
                style={{
                  marginTop: 12,
                  background: "#D32F2F",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
                onClick={() => setShowTour(false)}
              >
                Got it!
              </button>
            </div>
          )}
        </div>
        {/* Chat messages container */}
        <div
          ref={chatContainerRef}
          className="w-full flex-1 overflow-y-auto mb-4 space-y-2 rounded p-2"
          style={{ background: "#E3F2FD" }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded max-w-[70%]`}
                style={{
                  background: m.role === "user" ? "#FFFFFF" : "#F5F5F5",
                  color: "#121212",
                  border: m.role === "user" ? "2px solid #0D47A1" : "none",
                  boxShadow: m.role === "assistant" ? "0 1px 4px rgba(0,0,0,0.1)" : undefined,
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                {m.message}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
            style={{
              background: "#FFFFFF",
              color: "#121212",
              border: "2px solid #2196F3"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded"
            style={{ background: "#2196F3", color: "#fff", fontWeight: "bold" }}
          >
            Send
          </button>
        </div>
      </div>

    </main>
  );
}


