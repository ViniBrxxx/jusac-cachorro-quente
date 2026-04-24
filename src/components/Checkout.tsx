import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useCart, cartTotal, buildWhatsappMessage, CheckoutData, PaymentMethod, AddressData } from "@/store/cart";
import { motion } from "framer-motion";

type CheckoutStep = "neighborhood" | "street" | "complement" | "payment" | "cashNeedChange" | "cashChangeAmount";

interface CheckoutProps {
  items: any[];
  total: number;
  onBack: () => void;
}

export function Checkout({ items, total, onBack }: CheckoutProps) {
  const setCheckout = useCart((s) => s.setCheckout);
  const [step, setStep] = useState<CheckoutStep>("neighborhood");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [needsChange, setNeedsChange] = useState<boolean | null>(null);
  const [changeAmount, setChangeAmount] = useState("");
  const [notes, setNotes] = useState<number[]>([]);
  const [noteInput, setNoteInput] = useState("");

  const handleConfirmNeighborhood = () => {
    if (neighborhood.trim()) {
      setStep("street");
    }
  };

  const handleConfirmStreet = () => {
    if (street.trim()) {
      setStep("complement");
    }
  };

  const handleConfirmComplement = () => {
    setStep("payment");
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "cash") {
      setStep("cashNeedChange");
    } else {
      finalizeOrder();
    }
  };

  const handleCashNeedChange = (answer: boolean) => {
    setNeedsChange(answer);
    if (!answer) {
      finalizeOrder();
    } else {
      setStep("cashChangeAmount");
    }
  };

  const handleConfirmCashChange = () => {
    const change = parseFloat(changeAmount || "0");
    const sumNotes = notes.reduce((s, n) => s + n, 0);
    const computed = sumNotes > 0 ? sumNotes - total : change;
    if (computed > -1) {
      finalizeOrder();
    }
  };

  const finalizeOrder = () => {
    const address: AddressData = {
      street,
      neighborhood,
      complement,
    };

    const sumNotes = notes.reduce((s, n) => s + n, 0);
    const parsedChangeInput = parseFloat(changeAmount || "0");
    const changeValue = needsChange
      ? sumNotes > 0
        ? Math.max(0, sumNotes - total)
        : parsedChangeInput
      : undefined;

    const checkout: CheckoutData = {
      address,
      paymentMethod,
      ...(paymentMethod === "cash" && needsChange && { changeAmount: changeValue }),
    };
    setCheckout(checkout);

    const msg = encodeURIComponent(buildWhatsappMessage(items, checkout));
    window.open(`https://wa.me/5586999120173?text=${msg}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* STEP 1: NEIGHBORHOOD */}
      {step === "neighborhood" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Qual é o seu bairro?</h3>
            <div className="space-y-2">
              <Label htmlFor="neighborhood" className="text-sm">
                Nome do bairro
              </Label>
              <Input
                id="neighborhood"
                placeholder="Ex: Centro"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="h-10"
                autoFocus
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onBack}
              variant="outline"
              className="h-10 flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={handleConfirmNeighborhood}
              disabled={!neighborhood.trim()}
              className="h-10 flex-1 bg-success text-success-foreground hover:bg-success/90"
            >
              Próximo
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: STREET */}
      {step === "street" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Qual é a sua rua?</h3>
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm">
                Rua, avenida ou travessa
              </Label>
              <Input
                id="street"
                placeholder="Ex: Rua das Flores"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="h-10"
                autoFocus
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setStep("neighborhood")}
              variant="outline"
              className="h-10 flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={handleConfirmStreet}
              disabled={!street.trim()}
              className="h-10 flex-1 bg-success text-success-foreground hover:bg-success/90"
            >
              Próximo
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: COMPLEMENT */}
      {step === "complement" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Algum complemento?</h3>
            <div className="space-y-2">
              <Label htmlFor="complement" className="text-sm">
                Quadra, bloco, número, apto etc... (opcional)
              </Label>
              <Input
                id="complement"
                placeholder="Ex: Quadra 5, Bloco A, Apto 502"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="h-10"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                Se não tiver complemento, pode deixar em branco
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setStep("street")}
              variant="outline"
              className="h-10 flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={handleConfirmComplement}
              className="h-10 flex-1 bg-success text-success-foreground hover:bg-success/90"
            >
              Próximo
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: PAYMENT METHOD */}
      {step === "payment" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Escolha a forma de pagamento</h3>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer font-medium text-base">
                  PIX
                  <p className="text-xs text-muted-foreground font-normal mt-0.5">
                    Chave PIX: 86 99912-0173
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary/50 transition-colors mt-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer font-medium text-base">
                  Dinheiro
                  <p className="text-xs text-muted-foreground font-normal mt-0.5">
                    Informe na próxima etapa
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setStep("complement")}
              variant="outline"
              className="h-10 flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={handleConfirmPayment}
              className="h-10 flex-1 bg-success text-success-foreground hover:bg-success/90"
            >
              {paymentMethod === "cash" ? "Próximo" : "Confirmar"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: CASH - NEED CHANGE? */}
      {step === "cashNeedChange" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Vai precisar de troco?</h3>
            
            <div className="mb-6 rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">Total do pedido</p>
              <p className="font-display text-2xl font-bold text-primary">
                R$ {total.toFixed(2).replace(".", ",")}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleCashNeedChange(false)}
                variant="outline"
                className="h-10 flex-1 border-2"
              >
                Não
              </Button>
              <Button
                onClick={() => handleCashNeedChange(true)}
                className="h-10 flex-1 bg-success text-success-foreground hover:bg-success/90"
              >
                Sim
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setStep("payment")}
              variant="outline"
              className="h-10 flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 6: CASH - CHANGE AMOUNT */}
      {step === "cashChangeAmount" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Quanto de troco você vai precisar?</h3>

            <div className="mb-6 rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">Total do pedido</p>
              <p className="font-display text-2xl font-bold text-primary">R$ {total.toFixed(2).replace('.', ',')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="changeAmount" className="text-sm">Valor do troco desejado</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <Input id="changeAmount" type="number" step="0.01" min="0" placeholder="0,00" value={changeAmount} onChange={(e) => setChangeAmount(e.target.value)} className="h-10 pl-8" autoFocus />
              </div>
            </div>

            {/* Mini calculadora de troco */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium">Calcule seu troco</h4>
              <p className="text-xs text-muted-foreground">Adicione as notas que você tem em mãos</p>

              <div className="mt-3 flex items-center gap-2">
                <Input placeholder="Ex: 200" type="number" min="0" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} className="h-9 w-full" />
                <Button onClick={() => { const v = parseFloat(noteInput || '0'); if (v > 0) { setNotes((s) => [...s, v]); setNoteInput(''); } }} className="h-9">Adicionar</Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[200,100,50,20,10,5,2].map((n) => (
                  <button key={n} onClick={() => setNotes((s) => [...s, n])} className="rounded-full border px-3 py-1 text-sm hover:bg-secondary/50" type="button">R$ {n}</button>
                ))}
              </div>

              {notes.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Notas adicionadas:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {notes.map((n, i) => (
                      <div key={i} className="inline-flex items-center gap-2 rounded-full bg-card border px-3 py-1">
                        <span>R$ {n.toFixed(2).replace('.', ',')}</span>
                        <button onClick={() => setNotes((s) => s.filter((_, idx) => idx !== i))} className="text-destructive">×</button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <p className="text-sm">Total em mãos: <span className="font-medium">R$ {notes.reduce((s,n)=>s+n,0).toFixed(2).replace('.', ',')}</span></p>
                    <p className="text-sm">
                      {notes.reduce((s,n)=>s+n,0) - total < 0 ? (
                        <span className="font-display font-bold">Você não precisa de troco</span>
                      ) : (
                        <>
                          O seu troco é de: <span className="font-display font-bold">R$ {(notes.reduce((s,n)=>s+n,0)-total).toFixed(2).replace('.', ',')}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => setStep('cashNeedChange')} variant="outline" className="h-10 flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
            <Button onClick={handleConfirmCashChange} disabled={!(changeAmount || notes.length>0)} className="h-10 flex-1 bg-success text-success-foreground hover:bg-success/90">
              <MessageCircle className="h-4 w-4 mr-2" /> Finalizar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
