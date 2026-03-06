import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import LoggedHome from "./pages/LoggedHome";
import LoggedMarket from "./pages/LoggedMarket";
import LoggedTrade from "./pages/LoggedTrade";
import LoggedWallet from "./pages/LoggedWallet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/dashboard" element={<LoggedHome />} />
          <Route path="/markets" element={<LoggedMarket />} />
          <Route path="/trade" element={<LoggedTrade />} />
          <Route path="/wallet" element={<LoggedWallet />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
