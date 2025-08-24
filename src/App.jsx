import React, { useContext } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import ClickSpark from "./Animations/ClickSpark";
import { Toaster } from "react-hot-toast";
import { AdminProvider } from "./Context/useAdmin";

export default function App() {
  return (
    <ClickSpark
      sparkColor="#fff"
      sparkLength={9}
      sparkThickness={2}
      sparkRadius={20}
      sparkCount={7}
    >
      <AdminProvider>
        <RouterProvider router={router} />
      </AdminProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </ClickSpark>
  );
}
