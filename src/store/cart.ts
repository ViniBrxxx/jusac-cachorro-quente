import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProductType = "simples" | "combo";

export const PRODUCTS = {
  simples: { name: "Cachorro-quente simples", price: 9, image: "hotdog-simples" },
  combo: { name: "Combo (cachorro-quente + refrigerante)", price: 12, image: "hotdog-combo" },
} as const;

export const INGREDIENTS = ["Molho", "Batata palha", "Milho", "Queijo", "Salada", "Beterraba"] as const;
export type Ingredient = (typeof INGREDIENTS)[number];

export interface CartItem {
  id: string;
  type: ProductType;
  ingredients: Ingredient[];
  quantity: number;
}

export type PaymentMethod = "pix" | "cash";

export interface AddressData {
  street: string;
  neighborhood: string;
  complement: string;
}

export interface CheckoutData {
  address: AddressData;
  paymentMethod: PaymentMethod;
  changeAmount?: number;
}

interface CartState {
  items: CartItem[];
  checkout: CheckoutData | null;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  setCheckout: (data: CheckoutData | null) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      checkout: null,
      addItem: (item) =>
        set((s) => ({ items: [...s.items, { ...item, id: crypto.randomUUID() }] })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
        })),
      clear: () => set({ items: [], checkout: null }),
      setCheckout: (data) => set({ checkout: data }),
    }),
    { name: "jusac-cart" },
  ),
);

export const itemSubtotal = (item: CartItem) => PRODUCTS[item.type].price * item.quantity;
export const cartTotal = (items: CartItem[]) => items.reduce((s, i) => s + itemSubtotal(i), 0);

export function describeIngredients(selected: Ingredient[]): string {
  if (selected.length === INGREDIENTS.length) return "completo";
  if (selected.length === 0) return "sem ingredientes";
  const missing = INGREDIENTS.filter((i) => !selected.includes(i));
  return missing.map((m) => `sem ${m.toLowerCase()}`).join(", ");
}

export function buildWhatsappMessage(items: CartItem[], checkout: CheckoutData | null): string {
  const lines = ["Olá! Gostaria de fazer um pedido:", ""];
  items.forEach((item) => {
    lines.push(`${item.quantity}x ${PRODUCTS[item.type].name}`);
    lines.push(`Ingredientes: ${describeIngredients(item.ingredients)}`);
    lines.push("");
  });

  const total = cartTotal(items);
  lines.push(`Total: R$ ${total.toFixed(2).replace(".", ",")}`);
  lines.push("");

  if (checkout) {
    lines.push("--- INFORMAÇÕES DE ENTREGA ---");
    lines.push(`Bairro: ${checkout.address.neighborhood}`);
    lines.push(`Rua: ${checkout.address.street}`);
    if (checkout.address.complement) {
      lines.push(`Complemento: ${checkout.address.complement}`);
    }
    lines.push("");
    
    if (checkout.paymentMethod === "pix") {
      lines.push("Forma de pagamento: PIX");
    } else {
      lines.push("Forma de pagamento: Dinheiro");
      if (checkout.changeAmount !== undefined && checkout.changeAmount > 0) {
        lines.push(`Troco desejado: R$ ${checkout.changeAmount.toFixed(2).replace(".", ",")}`);
      } else {
        lines.push("Sem necessidade de troco");
      }
    }
  }

  return lines.join("\n");
}
