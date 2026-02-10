import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import SkillDetail from "./pages/SkillDetail";
import Sources from "./pages/Sources";
import SkillEditor from "./pages/SkillEditor";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AppLayout from "./components/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={() => <AppLayout><Marketplace /></AppLayout>} />
      <Route path="/skills/:id" component={() => <AppLayout><SkillDetail /></AppLayout>} />
      <Route path="/sources" component={() => <AppLayout><Sources /></AppLayout>} />
      <Route path="/editor" component={() => <AppLayout><SkillEditor /></AppLayout>} />
      <Route path="/editor/:id" component={() => <AppLayout><SkillEditor /></AppLayout>} />
      <Route path="/dashboard" component={() => <AppLayout><Dashboard /></AppLayout>} />
      <Route path="/settings" component={() => <AppLayout><Settings /></AppLayout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
