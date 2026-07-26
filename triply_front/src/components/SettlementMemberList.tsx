import type { MemberShare } from "../pages/SettlementCreate";

interface Props {
  type: "equal" | "ratio" | "manual";
  members: MemberShare[];
  totalAmount: number;
  setMembers: React.Dispatch<React.SetStateAction<MemberShare[]>>;
}

const SettlementMemberList = ({
  type,
  members,
  totalAmount,
  setMembers,
}: Props) => {
  const handleRatioChange = (userId: number, value: string) => {
    if (value === "") {
      setMembers((prev) =>
        prev.map((member) =>
          member.userId === userId
            ? {
                ...member,
                ratio: "",
                amount: "",
              }
            : member,
        ),
      );

      return;
    }

    const ratio = Number(value);

    setMembers((prev) =>
      prev.map((member) =>
        member.userId === userId
          ? {
              ...member,
              ratio,
              amount: Math.round((totalAmount * ratio) / 100),
            }
          : member,
      ),
    );
  };
  const handleAmountChange = (userId: number, value: string) => {
    if (value === "") {
      setMembers((prev) =>
        prev.map((member) =>
          member.userId === userId
            ? {
                ...member,
                amount: "",
                ratio: "",
              }
            : member,
        ),
      );

      return;
    }

    const amount = Number(value);

    setMembers((prev) =>
      prev.map((member) =>
        member.userId === userId
          ? {
              ...member,
              amount,
              ratio:
                totalAmount === 0
                  ? 0
                  : Number(((amount / totalAmount) * 100).toFixed(2)),
            }
          : member,
      ),
    );
  };

  return (
    <>
      <h4>참가자별 분담 금액</h4>

      <div className="member-list">
        {members.map((member) => (
          <div className="member-card" key={member.userId}>
            <div className="member-left">
              <div className="avatar">{member.userName.slice(0, 1)}</div>

              <div>
                <div className="member-name">
                  {member.userName}
                  {member.me && " (나)"}
                </div>

                <div className="member-desc">
                  {type === "equal" && "균등 분담 적용"}

                  {type === "ratio" && (
                    <>
                      비율 :
                      <input
                        className="ratio-input"
                        type="number"
                        min={0}
                        max={100}
                        value={member.ratio}
                        onChange={(e) =>
                          handleRatioChange(member.userId, e.target.value)
                        }
                      />
                      %
                    </>
                  )}

                  {type === "manual" && "직접 입력"}
                </div>
              </div>
            </div>

            <div className="member-amount">
              {type === "manual" ? (
                <>
                  ₩
                  <input
                    className="amount-input"
                    type="number"
                    min={0}
                    value={member.amount}
                    onChange={(e) =>
                      handleAmountChange(member.userId, e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  ₩{member.amount === "" ? "" : member.amount.toLocaleString()}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SettlementMemberList;
