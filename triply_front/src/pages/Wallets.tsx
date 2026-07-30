import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import WalletCard from '../components/WalletCard';
import RecentTransaction from '../components/RecentTransaction';
import '../styles/Wallets.css';
import GNB from '../components/Navigation/GNB/GNB';
import { Wallet, PiggyBank, DollarSign, WalletCards } from 'lucide-react';

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
              <button onClick={() => navigate('/wallet/manage')}>
                <div className="wallet-menu-icon">
                  <WalletCards size={24} />
                </div>
                <span>계좌 관리</span>
              </button>

              <button onClick={() => navigate('/wallet/history')}>
                <div className="wallet-menu-icon">
                  <Wallet size={24} />
                </div>
                <span>지갑 내역</span>
              </button>

              <button onClick={() => navigate('/wallet/settlement')}>
                <div className="wallet-menu-icon">
                  <PiggyBank size={24} />
                </div>
                <span>정산 리스트</span>
              </button>

              <button onClick={() => navigate('/wallet/exchange')}>
                <div className="wallet-menu-icon">
                  <DollarSign size={24} />
                </div>
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
