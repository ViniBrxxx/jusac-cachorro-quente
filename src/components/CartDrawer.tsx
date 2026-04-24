import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Minus, Plus, MessageCircle } from "lucide-react";
import {
  useCart,
  PRODUCTS,
  itemSubtotal,
  cartTotal,
  describeIngredients,
  buildWhatsappMessage,
} from "@/store/cart";
import { Checkout } from "@/components/Checkout";
import { AnimatePresence, motion } from "framer-motion";
import hotdogSimples from "@/assets/hotdog-simples.jpg";
import hotdogCombo from "@/assets/hotdog-combo.jpg";
import { useState } from "react";

const IMAGES = { "hotdog-simples": hotdogSimples, "hotdog-combo": hotdogCombo };

export function CartDrawer({ openCheckout = false, onOpenCheckout }: { openCheckout?: boolean; onOpenCheckout?: (open: boolean) => void }) {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQty = useCart((s) => s.updateQty);
  const clear = useCart((s) => s.clear);
  const total = cartTotal(items);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const [isCheckout, setIsCheckout] = useState(openCheckout);
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsCheckout(false);
    }
    onOpenCheckout?.(open);
  };

  return (
    <Sheet open={openCheckout} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir carrinho"
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-primary shadow-card transition-smooth hover:scale-105 hover:shadow-glow"
        >
          <ShoppingCart className="h-5 w-5" />
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground shadow-card"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="font-display text-2xl">
            {isCheckout ? "Finalizar pedido" : "Seu carrinho"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isCheckout ? (
            <Checkout
              items={items}
              total={total}
              onBack={() => setIsCheckout(false)}
            />
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <ShoppingCart className="mb-3 h-12 w-12 opacity-30" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const product = PRODUCTS[item.type];
                  return (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-3 rounded-2xl bg-card p-3 shadow-card"
                    >
                      <img
                        src={IMAGES[product.image]}
                        alt={product.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-1 flex-col">
                        <h4 className="text-sm font-semibold leading-tight">{product.name}</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {describeIngredients(item.ingredients)}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 rounded-full bg-secondary p-0.5">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-card text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground"
                              aria-label="Diminuir"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-card text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground"
                              aria-label="Aumentar"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-display font-bold text-primary">
                            R$ {itemSubtotal(item).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start text-muted-foreground transition-smooth hover:text-destructive"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {!isCheckout && items.length > 0 && (
          <div className="border-t bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-primary">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Button
              onClick={() => setIsCheckout(true)}
              className="h-12 w-full gap-2 bg-success text-success-foreground hover:bg-success/90"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              Finalizar pedido
            </Button>
            <button
              onClick={clear}
              className="mt-2 w-full text-xs text-muted-foreground hover:text-destructive"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
