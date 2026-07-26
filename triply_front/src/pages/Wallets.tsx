import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import WalletCard from '../components/WalletCard';
import RecentTransaction from '../components/RecentTransaction';
import '../styles/Wallets.css';
import GNB from '../components/Navigation/GNB/GNB';

const Wallets = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  return (
    <>
      <header>
        <GNB />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <WalletCard />
          </section>

          <section>
            {/* 임시 메뉴 */}
            <div className="wallet-menu">
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
            </div>
          </section>

          <section>
            <RecentTransaction />
          </section>
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

export default Wallets;
