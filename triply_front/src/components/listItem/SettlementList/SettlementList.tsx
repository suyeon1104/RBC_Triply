import React, { useState } from "react";
import { Equal, HelpCircle, ChevronDown } from "lucide-react";
import "./SettlementList.css";
import { getMappedColor } from "../../Avatar/Avatar";

export interface DetailItem {
  settlementId: number;
  userName: string;
  userId?: number | string;
  type: "receive" | "send";
  amount: number;
}

export interface SettlementListProps {
  paidAmount?: number;
  consumedAmount?: number;

  receiveTotal?: number;
  sendTotal?: number;

  receiveDetails?: DetailItem[];
  sendDetails?: DetailItem[];

  emptyMessage?: string;
}

const SettlementList = ({
  paidAmount = 0,
  consumedAmount = 0,

  receiveTotal = 0,
  sendTotal = 0,

  receiveDetails = [],
  sendDetails = [],

  emptyMessage = "정산 내역이 없어요.",
}: SettlementListProps) => {
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const hasSettlement = receiveDetails.length > 0 || sendDetails.length > 0;

  if (!hasSettlement) {
    return (
      <div className="settlement-empty">
        <HelpCircle className="empty-icon" size={64} />
        <p className="empty-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="settlement-list-container">
      {/* 공통 금액 */}
      {/* <div className="settlement-row primary-row">
        <div className="settlement-label">
          <span>결제한 금액</span>
        </div>

        <span className="settlement-value">
          {paidAmount.toLocaleString()}원
        </span>
      </div>

      <div className="settlement-row primary-row">
        <div className="settlement-label">
          <span>소비한 금액</span>
        </div>

        <span className="settlement-value">
          {consumedAmount.toLocaleString()}원
        </span>
      </div> */}

      {/* <div className="settlement-divider" /> */}

      {/* 받을 금액 */}
      {receiveDetails.length > 0 && (
        <>
          <div
            className="settlement-row total-row receive"
            onClick={() => setReceiveOpen((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <div className="settlement-label">
              <Equal size={24} className="icon" />

              <span>받을 금액</span>

              <ChevronDown
                size={20}
                style={{
                  transition: "0.2s",
                  transform: receiveOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>

            <span className="settlement-value total-value receive">
              {receiveTotal.toLocaleString()}원
            </span>
          </div>

          {receiveOpen && (
            <div className="settlement-details">
              {receiveDetails.map((item) => (
                <div key={item.settlementId} className="detail-row">
                  <div className="detail-label">
                    <span
                      className="bullet"
                      style={{
                        backgroundColor: getMappedColor(
                          item.userId || item.userName,
                        ),
                      }}
                    />

                    <span className="user-name">{item.userName}</span>

                    <span className="action-text">에게 받을 금액</span>
                  </div>

                  <span className="detail-value">
                    {item.amount.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* 임시추가 한 라인 */}
      <div className="settlement-divider" />
      {/* 보낼 금액 */}
      {sendDetails.length > 0 && (
        <>
          <div
            className="settlement-row total-row send"
            onClick={() => setSendOpen((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <div className="settlement-label">
              <Equal size={24} className="icon" />

              <span>보낼 금액</span>

              <ChevronDown
                size={20}
                style={{
                  transition: "0.2s",
                  transform: sendOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>

            <span className="settlement-value total-value send">
              {sendTotal.toLocaleString()}원
            </span>
          </div>

          {sendOpen && (
            <div className="settlement-details">
              {sendDetails.map((item) => (
                <div key={item.settlementId} className="detail-row">
                  <div className="detail-label">
                    <span
                      className="bullet"
                      style={{
                        backgroundColor: getMappedColor(
                          item.userId || item.userName,
                        ),
                      }}
                    />

                    <span className="user-name">{item.userName}</span>

                    <span className="action-text">에게 보낼 금액</span>
                  </div>

                  <span className="detail-value">
                    {item.amount.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SettlementList;
