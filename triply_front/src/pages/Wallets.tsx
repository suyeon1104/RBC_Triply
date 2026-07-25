import React, { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import WalletCard from "../components/WalletCard";
import RecentTransaction from "../components/RecentTransaction";
import "../styles/Wallets.css";

const Wallets = () => {
  const [activeTab, setActiveTab] = useState("wallet");
  return (
    <div className="container">
      <Header />

      <main className="main-content">
        <WalletCard />
        {/* 임시 메뉴 */}
        <section className="wallet-menu">
          <button>
            <div className="wallet-menu-icon">💳</div>
            <span>계좌 관리</span>
          </button>

          <button>
            <div className="wallet-menu-icon">📄</div>
            <span>지갑 내역</span>
          </button>

          <button>
            <div className="wallet-menu-icon">🧾</div>
            <span>정산 리스트</span>
          </button>

          <button>
            <div className="wallet-menu-icon">💲</div>
            <span>환율 정보</span>
          </button>
        </section>

        <RecentTransaction />
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Wallets;
