import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, LogIn, Lock, User, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, password: string, code: string) => Promise<void> | void;
  defaultName?: string;
  defaultCode?: string;
  lockedCode?: boolean;
  busy?: boolean;
  error?: string;
}

const sanitize = (s: string) => s.replace(/[<>"'`]/g, "").slice(0, 40).trim();

export default function JoinRoomModal({
  open, onClose, onSubmit, defaultName = "", defaultCode = "", lockedCode = false, busy, error,
}: Props) {
  const [name, setName] = useState(defaultName);
  const [code, setCode] = useState(defaultCode);
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setCode(defaultCode);
      setPassword("");
      setLocalError("");
    }
  }, [open, defaultName, defaultCode]);

  const handleSubmit = async () => {
    const cleanName = sanitize(name);
    if (!cleanName) { setLocalError("Display name is required"); return; }
    if (!lockedCode && !code.trim()) { setLocalError("Room code is required"); return; }
    if (!password.trim()) { setLocalError("Room password is required"); return; }
    setLocalError("");
    await onSubmit(cleanName, password.trim(), code.trim().toUpperCase());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-strong w-full max-w-md p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <LogIn className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold text-foreground">Join Room</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Enter your details to enter the battle arena.
            </p>

            {(error || localError) && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error || localError}
              </div>
            )}

            <div className="grid gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your display name"
                  maxLength={40}
                  autoFocus
                  className="w-full bg-muted/40 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-border focus:border-primary/50 transition-colors"
                />
              </div>

              {!lockedCode && (
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Room Code (e.g. ABC123)"
                  maxLength={6}
                  className="w-full bg-muted/40 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-border focus:border-primary/50 transition-colors font-mono tracking-widest"
                />
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter room password"
                  type="password"
                  className="w-full bg-muted/40 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-border focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={onClose}
                  disabled={busy}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 text-foreground font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  Join
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
