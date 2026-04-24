import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  INGREDIENTS,
  PRODUCTS,
  type Ingredient,
  type ProductType,
  useCart,
} from "@/store/cart";
import { toast } from "sonner";
import hotdogSimples from "@/assets/hotdog-simples.jpg";
import hotdogCombo from "@/assets/hotdog-combo.jpg";

const IMAGES = { "hotdog-simples": hotdogSimples, "hotdog-combo": hotdogCombo };

const ToastContent = ({ productName, qty }: { productName: string; qty: number }) => (
  <div className="relative flex flex-col w-full">
    <p className="font-semibold">Adicionado ao carrinho!</p>
    <p className="text-sm opacity-90">{qty}x {productName}</p>
    <div className="toast-progress-bar" />
  </div>
);

export function ProductCard({ type, onCheckout }: { type: ProductType; onCheckout?: () => void }) {
  const product = PRODUCTS[type];
  const [ingredients, setIngredients] = useState<Ingredient[]>([...INGREDIENTS]);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  const toggle = (ing: Ingredient) =>
    setIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing],
    );

  const handleAdd = () => {
    addItem({ type, ingredients, quantity: qty });
    toast.success(
      <ToastContent productName={product.name} qty={qty} />,
      {
        duration: 4000,
        action: onCheckout ? {
          label: "Finalizar pedido",
          onClick: onCheckout,
        } : undefined,
      }
    );
    setQty(1);
    setIngredients([...INGREDIENTS]);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group min-w-0 overflow-hidden rounded-2xl bg-card shadow-card transition-smooth hover:shadow-elegant sm:rounded-3xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-square">
        <img
          src={IMAGES[product.image]}
          alt={product.name}
          width={1024}
          height={1024}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/30 via-transparent to-transparent mix-blend-multiply opacity-60" />
        <div className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-primary shadow-card sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:font-display sm:text-sm">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </div>
      </div>

      <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">
        <h3 className="font-display text-base font-bold leading-tight sm:text-xl">{product.name}</h3>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
            Ingredientes
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {INGREDIENTS.map((ing) => (
              <label
                key={ing}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-secondary/50 px-2 py-2 text-xs transition-smooth hover:bg-secondary sm:px-3 sm:text-sm"
              >
                <Checkbox
                  checked={ingredients.includes(ing)}
                  onCheckedChange={() => toggle(ing)}
                />
                <span className="min-w-0 leading-tight">{ing}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="mx-auto flex items-center gap-1 rounded-full bg-secondary p-1 sm:mx-0">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground sm:h-9 sm:w-9"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-display text-sm font-bold sm:text-base">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground sm:h-9 sm:w-9"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleAdd}
            className="h-10 w-full gap-2 bg-gradient-primary text-xs font-semibold shadow-card hover:shadow-glow sm:h-11 sm:flex-1 sm:text-sm"
          >
            <Check className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
