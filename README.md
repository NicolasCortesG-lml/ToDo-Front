# Todo-AI

Todo-AI is a productivity web app built with [Next.js](https://nextjs.org) and [Supabase](https://supabase.com) that combines a smart to-do list with an AI-powered chat assistant.  
You can manage your tasks, set priorities, add context, and interact with an assistant to help organize your workflow.

## Features

- **Personal To-Do List:** Add, edit, complete, and delete tasks. Each task can have a priority and context.
- **User Authentication:** Secure login using Supabase Auth.
- **AI Chat Assistant:** Chat with an assistant to get help, automate actions, and receive tips.
- **Contextual Actions:** The assistant can trigger UI tours and navigate the app based on your conversation.
- **Persistent Data:** All tasks and chat history are stored per user in Supabase.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials and chat API endpoint.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/chat-logic/chat-get
```

## Project Structure

- `src/app/page.tsx` — Main app page with to-do list and chat assistant.
- `supabase` — Database and authentication.
- `.env.local` — Environment variables (not committed).

## Deployment

You can deploy this app on [Vercel](https://vercel.com/) or any platform that supports Next.js.  
Make sure to set your environment variables in your deployment settings.

## License

MIT

---

For questions or contributions, feel free to open an issue or pull request on the [GitHub repository](https://github.com/yourusername/todo-ai).
