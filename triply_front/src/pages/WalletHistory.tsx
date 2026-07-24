import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import { getWalletHistory } from "../api/walletApi";

import "../styles/WalletHistory.css";
import SettlementButton from "../components/SettlementButton";

export default function WalletHistory() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("wallet");
  const [filter, setFilter] = useState("ALL");
  const [transactions, setTransactions] = useState<any[]>([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getWalletHistory();
      setTransactions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      const itemMonth = new Date(item.transactionAt).getMonth() + 1;

      if (itemMonth !== month) return false;

      switch (filter) {
        case "PAYMENT":
          return item.type === "PAYMENT";

        case "CHARGE":
          return item.type === "CHARGE";

        case "SETTLEMENT":
          return (
            item.type === "SETTLEMENT_IN" || item.type === "SETTLEMENT_OUT"
          );

        default:
          return true;
      }
    });
  }, [transactions, filter, month]);

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};

    filtered.forEach((item) => {
      const key = item.transactionAt.substring(0, 10);

      if (!map[key]) map[key] = [];

      map[key].push(item);
    });

    return Object.entries(map);
  }, [filtered]);

  const getTitle = (item: any) => {
    switch (item.type) {
      case "CHARGE":
        return "지갑 충전";

      case "PAYMENT":
        return `결제 | ${item.merchantName}`;

      case "SETTLEMENT_IN":
        return `정산받음 | ${item.counterpartyName}`;

      case "SETTLEMENT_OUT":
        return `정산보냄 | ${item.counterpartyName}`;

      default:
        return "";
    }
  };

  const getAmount = (item: any) => {
    const sign =
      item.type === "CHARGE" || item.type === "SETTLEMENT_IN" ? "+" : "-";

    return `${sign}${item.amount.toLocaleString()}원`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return "🛍️";

      case "CHARGE":
        return "💰";

      default:
        return "🤝";
    }
  };

  return (
    <div className="container">
      <main className="wallet-history">
        <div className="history-top">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          <h2>지갑 내역</h2>
        </div>

        <div className="month-selector">
          <button onClick={() => month > 1 && setMonth(month - 1)}>&lt;</button>

          <span>{month}월</span>

          <button onClick={() => month < 12 && setMonth(month + 1)}>
            &gt;
          </button>
        </div>

        <div className="filter-row">
          <button
            className={filter === "ALL" ? "selected" : ""}
            onClick={() => setFilter("ALL")}
          >
            전체
          </button>

          <button
            className={filter === "PAYMENT" ? "selected" : ""}
            onClick={() => setFilter("PAYMENT")}
          >
            결제
          </button>

          <button
            className={filter === "CHARGE" ? "selected" : ""}
            onClick={() => setFilter("CHARGE")}
          >
            충전
          </button>

          <button
            className={filter === "SETTLEMENT" ? "selected" : ""}
            onClick={() => setFilter("SETTLEMENT")}
          >
            정산
          </button>
        </div>

        {grouped.length === 0 ? (
          <div className="empty-history">이번 달 거래내역이 없습니다.</div>
        ) : (
          grouped.map(([date, items]) => (
            <div key={date}>
              <div className="history-date">{date.replaceAll("-", ".")}</div>

              <div className="history-card">
                {items.map((item) => (
                  <div key={item.transactionId} className="history-item">
                    <div className="history-icon">{getIcon(item.type)}</div>

                    <div className="history-info">
                      <div className="history-amount">
                        <span
                          className={
                            item.type === "CHARGE" ||
                            item.type === "SETTLEMENT_IN"
                              ? "plus"
                              : "minus"
                          }
                        >
                          {getAmount(item)}
                        </span>

                        {item.foreignAmount && (
                          <span className="foreign">
                            | {item.foreignAmount.toLocaleString()}
                            {item.currency}
                          </span>
                        )}
                      </div>

                      <div className="history-title">{getTitle(item)}</div>
                    </div>

                    {item.type === "PAYMENT" && (
                      <SettlementButton paymentId={item.paymentId} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
