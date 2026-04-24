import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, Heart, Sparkles } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ENCONTRÃO JUSAC — Pedidos de Cachorro-Quente" },
      {
        name: "description",
        content:
          "Faça seu pedido de cachorro-quente do ENCONTRÃO JUSAC. Juventude: vocação de amor e santidade.",
      },
      { property: "og:title", content: "ENCONTRÃO JUSAC — Pedidos" },
      {
        property: "og:description",
        content: "Cachorro-quente e combos. Monte seu pedido e finalize pelo WhatsApp.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [cartOpen, setCartOpen] = useState(false);

  const scrollToOrder = () => {
    document.getElementById("pedido")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckout = () => {
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" richColors />

      {/* Floating cart */}
      <div className="fixed right-4 top-4 z-50">
        <CartDrawer openCheckout={cartOpen} onOpenCheckout={setCartOpen} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero px-4 pb-20 pt-16 text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            JUSAC • Juventude Unida a Serviço de Amor e Cristo
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl font-black leading-none tracking-tighter sm:text-6xl md:text-7xl"
          >
            ENCONTRÃO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-md font-display text-lg italic opacity-90 sm:text-xl"
          >
            Juventude: vocação de amor e santidade
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Button
              onClick={scrollToOrder}
              size="lg"
              className="h-14 gap-2 rounded-full bg-white px-8 font-display text-base font-bold text-primary shadow-elegant transition-smooth hover:scale-105 hover:bg-white"
            >
              Fazer Pedido
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full text-background"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,32 C240,80 480,80 720,48 C960,16 1200,16 1440,48 L1440,80 L0,80 Z"
          />
        </svg>
      </section>

      {/* Products */}
      <section id="pedido" className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Monte seu pedido</h2>
            <p className="mt-2 text-muted-foreground">
              Escolha, personalize e adicione ao carrinho
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProductCard type="simples" onCheckout={handleCheckout} />
            <ProductCard type="combo" onCheckout={handleCheckout} />
          </div>
        </div>
      </section>

      <footer className="px-4 pb-10 pt-4 text-center text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-1.5">
          Feito com <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> pela JUSAC
        </p>
      </footer>
    </div>
  );
}
