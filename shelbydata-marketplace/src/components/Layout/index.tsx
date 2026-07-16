import { type PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ToastContainer } from "../ToastContainer";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
