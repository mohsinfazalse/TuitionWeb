// components/ui/toast.tsx
import React from "react";
import { Toaster } from "react-hot-toast";

/**
 * Global toast container. Place it near the root of the app (e.g., in layout).
 */
export const ToastProvider: React.FC = () => {
  return <Toaster position="top-right" reverseOrder={false} />;
};
