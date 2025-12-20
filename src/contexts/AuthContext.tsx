import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type AppRole = "super_admin" | "admin" | "user";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  roles: AppRole[];
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: any;
  created_at: string;
  payment_method?: string;
  shipping_address?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "created_at">) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setOrders([]);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError) throw profileError;

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      const roles = rolesData?.map((r) => r.role as AppRole) || ["user"];

      setUser({
        id: userId,
        email: profile.email || "",
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        roles,
      });

      // Fetch orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Welcome back!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Account created successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone,
          avatar_url: data.avatar_url,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      setUser((prev) => (prev ? { ...prev, ...data } : null));
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const addOrder = async (order: Omit<Order, "id" | "created_at">): Promise<string | null> => {
    if (!session?.user) return null;

    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          order_number: order.order_number,
          status: order.status,
          total_amount: order.total_amount,
          items: order.items,
          payment_method: order.payment_method,
          shipping_address: order.shipping_address,
        })
        .select()
        .single();

      if (error) throw error;

      setOrders((prev) => [data, ...prev]);
      return data.id;
    } catch (error: any) {
      console.error("Error creating order:", error);
      return null;
    }
  };

  const isAdmin = user?.roles?.some((r) => r === "admin" || r === "super_admin") || false;
  const isSuperAdmin = user?.roles?.includes("super_admin") || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        isAdmin,
        isSuperAdmin,
        login,
        signup,
        logout,
        updateProfile,
        orders,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};