import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Modal, StyleSheet, Text, View, Pressable } from "react-native";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastConfig = {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

type ToastContextType = {
  showToast: (config: ToastConfig) => void;
  hideToast: () => void;
};

type ToastState = ToastConfig & { visible: boolean };

const ToastContext = createContext<ToastContextType | null>(null);

const TYPE_ICON: Record<ToastType, string> = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
};

function ToastOverlay({
  toast,
  onHide,
}: {
  toast: ToastState;
  onHide: () => void;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={toast.visible}
      statusBarTranslucent
      onRequestClose={onHide}
    >
      <Pressable
        style={styles.overlay}
        onPress={onHide}
      >
        <Pressable onPress={() => { }}>
          <View style={styles.box}>
            {toast.type === "error" || toast.type === "warning" ? <Text style={styles.iconText}>{TYPE_ICON[toast.type]}</Text> : null}
            {!!toast.title && !toast.message && <Text style={styles.title}>{toast.title}</Text>}
            {!!toast.message && (
              <Text style={styles.title}>{toast.message}</Text>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: "info",
    title: "",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback((config: ToastConfig) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ ...config, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, config.duration ?? 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastOverlay toast={toast} onHide={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 14,
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    minWidth: 230,
    maxWidth: 290,
    gap: 6,
  },
  iconText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff"
  }
});
