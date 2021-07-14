import React from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";
import AppRoutes from "./AppRoutes";
import Footer from "./layout/footer";
import Header from "./layout/header";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
