"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { useSession } from "@clerk/nextjs";

type supabaseContext = {
    supabase: SupabaseClient | null;
    isLoaded: boolean;
}
const Context = createContext<supabaseContext>({
    supabase: null,
    isLoaded: false,
})
export default function SupabaseProvider({
    children
}: {
    children: React.ReactNode
}) {

    const {session} = useSession()
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

   useEffect(() => {
  const setup = async () => {
    try {
      const token = await session?.getToken(); 

      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        }
      );

      setSupabase(client);
      setIsLoaded(true);
    } catch (err) {
      console.error("❌ Supabase init error:", err);
    }
  };

  setup();
}, [session]);



   return <Context.Provider value={{supabase, isLoaded}}>
    {!isLoaded ? (
  <div className="flex items-center justify-center min-h-screen text-gray-500">
    Connecting to Supabase...
  </div>
) : (
  children
)}
   </Context.Provider>

}

export const useSupabase = () => {
    const context = useContext(Context)
    if(context === undefined) {
        throw new Error("useSupabse needs to be inside provider")
    }

    return context;
}