import React from "react";
import "./../styles/Pricing.css";

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h2 className="pricing-title">Choose Your Plan</h2>

      <div className="pricing-cards">
        {/* Free Plan */}
        <div className="pricing-card">
          <h3>Free</h3>
          <p className="price">$0 / month</p>
          <p>✔ 150 Fast Tokens (Daily Reset)</p>
          <p>✔ 1 Collection</p>
          <p>✔ 200 Realtime Actions</p>
          
        </div>

        {/* Apprentice Plan */}
        <div className="pricing-card premium">
          <h3>Apprentice</h3>
          <p className="price">$10 / month</p>
          <p>✔ 8,500 Fast Tokens (Monthly)</p>
          <p>✔ Unlimited Collections</p>
          <p>✔ Unlimited Realtime Actions</p>
          <button className="subscribe-btn">Subscribe</button>
        </div>

        {/* Artisan Unlimited Plan */}
        <div className="pricing-card">
          <h3>Artisan Unlimited</h3>
          <p className="price">$24 / month</p>
          <p>✔ 25,000 Fast Tokens</p>
          <p>✔ Unlimited Realtime Actions</p>
          <p>✔ Unlimited Collections</p>
          <button className="subscribe-btn">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
