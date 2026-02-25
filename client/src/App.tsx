import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import { useEffect } from "react";
import Contact from "./pages/Contact";
import { Toaster } from "react-hot-toast";

export default function App() {

    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])
    

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#1c1c1e',
                        color: '#e4e4e7',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '14px',
                    },
                    success: { iconTheme: { primary: '#ec4899', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/generate/:id" element={<Generate />} />
                <Route path="/my-generation" element={<MyGeneration />} />
                <Route path="/preview" element={<YtPreview />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />

            </Routes>
            <Footer />
        </>
    );
}