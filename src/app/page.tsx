"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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


export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newContexto, setNewContexto] = useState("");
  const [newPrioridad, setNewPrioridad] = useState(2);

  // 🔹 Estado del chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");


  // 🔹 Cargar tareas al inicio
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("inserted_at", { ascending: false });

    if (error) console.error(error);
    if (data) setTasks(data as Task[]);
  }

  async function addTask() {
    if (!newTask.trim()) return;
    await supabase.from("tasks").insert([
      { title: newTask, prioridad: newPrioridad, contexto: newContexto },
    ]);
    setNewTask("");
    setNewContexto("");
    setNewPrioridad(2);
    fetchTasks();
  }

  async function toggleTask(id: string, completed: boolean) {
    await supabase.from("tasks").update({ completed: !completed }).eq("id", id);
    fetchTasks();
  }

  async function updatePrioridad(id: string, prioridad: number) {
    await supabase.from("tasks").update({ prioridad }).eq("id", id);
    fetchTasks();
  }

  async function updateContexto(id: string, contexto: string) {
    await supabase.from("tasks").update({ contexto }).eq("id", id);
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  }


  async function fetchMessages() {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("inserted_at", { ascending: true });

    if (!error && data) setMessages(data as ChatMessage[]);
  }

  useEffect(() => {
    fetchMessages();
  }, []);



  async function sendMessage() {
    if (!newMessage.trim()) return;

    // Guardar el mensaje del usuario en DB
    await supabase.from("chat_messages").insert([
      { role: "user", message: newMessage }
    ]);

    setNewMessage("");

    // Refrescar mensajes
    fetchMessages();

    // Aqui llamamos al backend para obtener la respuesta del "assistant"
    const res = await fetch("http://localhost:8000/chat-logic/chat-get", {
      method: "GET",
    });

    const data = await res.json();

    // Guardar respuesta del "assistant"
    await supabase.from("chat_messages").insert([
      { role: "assistant", message: data.mensaje }
    ]);

    fetchTasks()
    fetchMessages();
  }


  return (
    <main className="min-h-screen flex flex-row">
      {/* Panel Izquierdo - ToDo List */}
      <div className="w-1/2 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">📝 To-Do List</h1>

        {/* Formulario nueva tarea */}
        <div className="flex flex-col gap-2 mb-6 w-full">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nueva tarea..."
            className="p-2 border rounded"
          />
          <textarea
            value={newContexto}
            onChange={(e) => setNewContexto(e.target.value)}
            placeholder="Contexto o notas..."
            className="p-2 border rounded"
          />
          <select
            value={newPrioridad}
            onChange={(e) => setNewPrioridad(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={1}>Alta</option>
            <option value={2}>Media</option>
            <option value={3}>Baja</option>
          </select>
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Agregar
          </button>
        </div>

        {/* Lista de tareas */}
        <ul className="w-full">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-white p-4 mb-3 rounded shadow flex flex-col gap-2"
            >
              {/* Header con UID y título */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">#{task.uid}</span>
                <span
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`cursor-pointer font-medium ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Contexto editable */}
              <textarea
                defaultValue={task.contexto ?? ""}
                onBlur={(e) => updateContexto(task.id, e.target.value)}
                placeholder="Agregar contexto..."
                className="w-full p-2 border rounded"
              />

              {/* Selector de prioridad */}
              <div>
                <label className="mr-2">Prioridad:</label>
                <select
                  value={task.prioridad}
                  onChange={(e) =>
                    updatePrioridad(task.id, Number(e.target.value))
                  }
                  className="p-1 border rounded"
                >
                  <option value={1}>Alta</option>
                  <option value={2}>Media</option>
                  <option value={3}>Baja</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel Derecho - Chat */}
        <div className="w-1/2 flex flex-col border-l p-4 bg-white">
          <h2 className="text-xl font-bold mb-4">💬 Chat</h2>

          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded max-w-[80%] ${
                  m.role === "user"
                    ? "bg-blue-100 self-end text-right ml-auto"
                    : "bg-gray-200 self-start mr-auto"
                }`}
              >
                {m.message}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Enviar
            </button>
          </div>
        </div>

    </main>
  );
}
