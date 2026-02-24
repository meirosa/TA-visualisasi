import Navbar from "./navbar";
import Home from "./home";
import About from "./about";
import SOP from "./sop";
import Dashboard from "./dashboard";
import Peta from "./peta";
import Footer from "./footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Home />
      <About />
      <SOP />
      <Dashboard />
      <Peta />
      <Footer />
    </>
  );
}
