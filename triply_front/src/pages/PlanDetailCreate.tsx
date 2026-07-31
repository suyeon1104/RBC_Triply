import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import TopNav from "../components/Navigation/TopNav/TopNav";
import Button from "../components/Button/Button/Button";
import { createSchedule, getSchedule, updateSchedule } from "../api/tripApi";

import "../styles/PlanDetailCreate.css";

interface ScheduleForm {
  scheduleDate: string;
  startTime: string;
  endTime: string;
  scheduleTitle: string;
  schedulePlace: string;
  scheduleDetail: string;
  category: string;
}

const emptyForm: ScheduleForm = {
  scheduleDate: "",
  startTime: "",
  endTime: "",
  scheduleTitle: "",
  schedulePlace: "",
  scheduleDetail: "",
  category: "",
};

const categories = [
  { value: "관광", emoji: "📍", label: "관광" },
  { value: "식사", emoji: "🍽️", label: "식사" },
  { value: "숙소", emoji: "🏨", label: "숙소" },
  { value: "쇼핑", emoji: "🛍️", label: "쇼핑" },
  { value: "이동", emoji: "🚌", label: "이동" },
  { value: "기타", emoji: "✨", label: "기타" },
];

export default function PlanDetailCreate() {
  const { tripId, scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.pathname.endsWith("/new")
    ? "create"
    : location.pathname.includes("/edit")
      ? "edit"
      : "detail";

  const readOnly = mode === "detail";

  const locationState = location.state as {
    startDate?: string;
    endDate?: string;
  };

  const [dateRange] = useState({
    startDate: locationState?.startDate ?? "2026-07-20",
    endDate: locationState?.endDate ?? "2026-07-23",
  });

  const [form, setForm] = useState<ScheduleForm>(emptyForm);

  // 조회 / 수정 페이지 데이터 가져오기
  useEffect(() => {
    if (mode === "create") {
      setForm(emptyForm);
      return;
    }

    if (!scheduleId) return;

    async function fetchSchedule() {
      try {
        const res = await getSchedule(Number(scheduleId));

        setForm(res.data);
      } catch (error) {
        console.error(error);
        alert("일정 정보를 불러오지 못했습니다.");
      }
    }

    fetchSchedule();
  }, [mode, scheduleId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // 생성 / 수정 저장
  async function save() {
    try {
      if (mode === "create") {
        await createSchedule({
          tripId: Number(tripId),
          ...form,
        });

        alert("일정이 추가되었습니다.");

        navigate(`/planner`);
      } else if (mode === "edit") {
        await updateSchedule({
          scheduleId: Number(scheduleId),
          ...form,
        });

        alert("일정이 수정되었습니다.");

        navigate(`/trip/schedule/${scheduleId}`);
      }
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  }

  // 조회 -> 수정 이동
  function goEdit() {
    navigate(`/trip/schedule/${scheduleId}/edit`);
  }

  return (
    <>
      <TopNav
        title={
          mode === "create"
            ? "일정 추가"
            : mode === "edit"
              ? "일정 수정"
              : "일정 상세"
        }
      />

      <main className="page">
        <div className="schedule-container">
          <label>카테고리</label>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item.value}
                type="button"
                disabled={readOnly}
                className={`category-item ${
                  form.category === item.value ? "selected" : ""
                }`}
                onClick={() =>
                  setForm({
                    ...form,
                    category: item.value,
                  })
                }
              >
                <span className="category-emoji">{item.emoji}</span>

                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <label>계획 제목</label>

          <input
            name="scheduleTitle"
            value={form.scheduleTitle}
            onChange={handleChange}
            readOnly={readOnly}
          />

          <label>장소</label>

          <input
            name="schedulePlace"
            value={form.schedulePlace}
            onChange={handleChange}
            readOnly={readOnly}
          />

          <label>날짜</label>

          <input
            type="date"
            name="scheduleDate"
            min={dateRange.startDate}
            max={dateRange.endDate}
            value={form.scheduleDate}
            onChange={handleChange}
            readOnly={readOnly}
          />

          <div className="time-row">
            <div>
              <label>시작 시간</label>

              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>

            <div>
              <label>종료 시간</label>

              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
          </div>

          <label>메모</label>

          <textarea
            rows={5}
            name="scheduleDetail"
            value={form.scheduleDetail}
            onChange={handleChange}
            readOnly={readOnly}
          />

          {mode === "create" && (
            <Button
              className="schedule-btn"
              variant="primary"
              size="l"
              onClick={save}
            >
              계획 추가하기
            </Button>
          )}

          {mode === "detail" && (
            <Button
              className="schedule-btn"
              variant="primary"
              size="l"
              onClick={goEdit}
            >
              계획 편집하기
            </Button>
          )}

          {mode === "edit" && (
            <Button
              className="schedule-btn"
              variant="primary"
              size="l"
              onClick={save}
            >
              계획 편집하기
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
