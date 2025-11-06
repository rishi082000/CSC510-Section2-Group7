import React from "react";
import DriverLoginForm from "../../components/driver/DriverLoginForm";
import "../../styles/DriverLoginPage.css";

export default function DriverLoginPage() {
  return (
    <div className="wolfcafe-page">
      <div className="wolfcafe-container">
        <h1 className="wolfcafe-title">
          Pack<span className="accent">Eats</span> Driver Login
        </h1>
        <DriverLoginForm />
      </div>
    </div>
  );
}
