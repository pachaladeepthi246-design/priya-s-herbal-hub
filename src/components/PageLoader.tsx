import { Loader2 } from "lucide-react";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-md">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
      <div className="relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/60 backdrop-blur-lg border border-border/50 shadow-xl">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  </div>
);

export default PageLoader;
