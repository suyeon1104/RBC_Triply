import { useState } from "react";
// 프로젝트 구조에 맞게 경로만 조정해주세요 (예: src/pages/ApiTester.tsx 라면 이 경로 그대로 사용 가능)
import axiosInstance from "../api/axiosInstance";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Preset {
  label: string;
  method: Method;
  path: string;
  needsAuth: boolean;
  sampleBody?: Record<string, unknown>;
}

// 명세서(5번 사진)에 있던 항목들 위주로 프리셋 구성. 팀 명세 확정될 때마다 여기에 추가하면 됨.
const PRESETS: Preset[] = [
  {
    label: "회원가입 (POST /auth/join)",
    method: "POST",
    path: "/auth/join",
    needsAuth: false,
    sampleBody: {
      loginId: "test",
      loginPw: "1234",
      userName: "홍길동",
      userPhone: "01012345678",
    },
  },
  {
    label: "로그인 (POST /auth/login)",
    method: "POST",
    path: "/auth/login",
    needsAuth: false,
    sampleBody: { loginId: "test", loginPw: "1234" },
  },
  {
    label: "아이디 중복확인 (POST /auth/idCheck)",
    method: "POST",
    path: "/auth/idCheck",
    needsAuth: false,
    sampleBody: { loginId: "test" },
  },
  {
    label: "회원정보 조회 (GET /getProfile)",
    method: "GET",
    path: "/getProfile",
    needsAuth: true,
  },
  {
    label: "회원정보 수정 (PATCH /patchProfile)",
    method: "PATCH",
    path: "/patchProfile",
    needsAuth: true,
    sampleBody: { userName: "홍홍홍", userPhone: "01044445555" },
  },
  {
    label: "그룹 목록 조회 (GET /group/list)",
    method: "GET",
    path: "/group/list",
    needsAuth: true,
  },
  {
    label: "그룹 생성 (POST /group/create)",
    method: "POST",
    path: "/group/create",
    needsAuth: true,
    sampleBody: { groupName: "부산 여행" },
  },
  {
    label: "여행계획 조회 (GET /travel/plan)",
    method: "GET",
    path: "/travel/plan",
    needsAuth: true,
  },
  {
    label: "여행계획 추가 (POST /travel/plan)",
    method: "POST",
    path: "/travel/plan",
    needsAuth: true,
    sampleBody: {
      groupId: 1,
      title: "부산역 도착",
      startTime: "2026-08-10T09:00:00",
      endTime: "2026-08-10T10:00:00",
    },
  },
  {
    label: "결제 등록 (POST /settlement/payment)",
    method: "POST",
    path: "/settlement/payment",
    needsAuth: true,
    sampleBody: { groupId: 1, category: "식비", amount: 25000, memo: "해운대 점심" },
  },
  {
    label: "정산 요약 조회 (GET /settlement/summary)",
    method: "GET",
    path: "/settlement/summary",
    needsAuth: true,
  },
  {
    label: "지갑 조회 (GET /wallet)",
    method: "GET",
    path: "/wallet",
    needsAuth: true,
  },
  {
    label: "지갑 충전 (POST /wallet/charge)",
    method: "POST",
    path: "/wallet/charge",
    needsAuth: true,
    sampleBody: { amount: 50000 },
  },
];

interface HistoryItem {
  id: number;
  time: string;
  method: Method;
  path: string;
  status: number | null;
  ok: boolean;
  data: unknown;
}

export default function ApiTester() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [method, setMethod] = useState<Method>(PRESETS[0].method);
  const [path, setPath] = useState(PRESETS[0].path);
  const [body, setBody] = useState(
    PRESETS[0].sampleBody ? JSON.stringify(PRESETS[0].sampleBody, null, 2) : ""
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handlePresetChange = (idx: number) => {
    const preset = PRESETS[idx];
    setPresetIndex(idx);
    setMethod(preset.method);
    setPath(preset.path);
    setBody(preset.sampleBody ? JSON.stringify(preset.sampleBody, null, 2) : "");
    setResponse(null);
    setErrorMsg(null);
    setStatus(null);
  };

  const handleSend = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResponse(null);
    setStatus(null);

    let parsedBody: unknown = undefined;
    if (body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        setErrorMsg("요청 body가 올바른 JSON 형식이 아닙니다.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axiosInstance.request({
        method,
        url: path,
        data: method === "GET" || method === "DELETE" ? undefined : parsedBody,
        params: method === "GET" ? parsedBody : undefined,
      });
      setResponse(res.data);
      setStatus(res.status);
      setHistory((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          method,
          path,
          status: res.status,
          ok: true,
          data: res.data,
        },
        ...prev,
      ]);
    } catch (err: any) {
      const resStatus = err?.response?.status ?? null;
      const resData = err?.response?.data ?? err?.message ?? "알 수 없는 오류";
      setStatus(resStatus);
      setResponse(resData);
      setErrorMsg(
        resStatus
          ? `요청 실패 (status ${resStatus})`
          : "네트워크 오류 또는 서버 응답 없음"
      );
      setHistory((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          method,
          path,
          status: resStatus,
          ok: false,
          data: resData,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const methodColor: Record<Method, string> = {
    GET: "#2563eb",
    POST: "#16a34a",
    PUT: "#d97706",
    PATCH: "#9333ea",
    DELETE: "#dc2626",
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        color: "#1f2937",
      }}
    >
      <h2 style={{ marginBottom: 4 }}>API 테스터</h2>
      <p style={{ color: "#6b7280", marginTop: 0, fontSize: 13 }}>
        현재 axiosInstance 설정(baseURL, 토큰 인터셉터) 그대로 사용해서 실제 요청을 보냅니다.
        로그인 API를 먼저 호출해서 토큰이 로컬스토리지에 저장된 상태여야 인증이 필요한 요청이 성공해요.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>엔드포인트 선택</label>
        <select
          value={presetIndex}
          onChange={(e) => handlePresetChange(Number(e.target.value))}
          style={{
            display: "block",
            width: "100%",
            padding: "8px 10px",
            marginTop: 6,
            borderRadius: 6,
            border: "1px solid #d1d5db",
          }}
        >
          {PRESETS.map((p, idx) => (
            <option key={p.path + p.method} value={idx}>
              {p.label} {p.needsAuth ? "🔒" : ""}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as Method)}
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontWeight: 700,
            color: methodColor[method],
            minWidth: 100,
          }}
        >
          {(["GET", "POST", "PUT", "PATCH", "DELETE"] as Method[]).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/auth/login"
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "8px 20px",
            borderRadius: 6,
            border: "none",
            background: loading ? "#9ca3af" : "#111827",
            color: "white",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "요청 중..." : "실행"}
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>
          Request Body (JSON, GET/DELETE는 query params로 전송)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontFamily: "monospace",
            fontSize: 13,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Response</label>
          {status !== null && (
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 12,
                background: status >= 200 && status < 300 ? "#dcfce7" : "#fee2e2",
                color: status >= 200 && status < 300 ? "#15803d" : "#b91c1c",
                fontWeight: 700,
              }}
            >
              status {status}
            </span>
          )}
        </div>
        {errorMsg && (
          <div style={{ color: "#b91c1c", fontSize: 13, marginBottom: 6 }}>{errorMsg}</div>
        )}
        <pre
          style={{
            background: "#111827",
            color: "#e5e7eb",
            padding: 12,
            borderRadius: 6,
            fontSize: 12,
            overflowX: "auto",
            minHeight: 60,
          }}
        >
          {response !== null ? JSON.stringify(response, null, 2) : "// 요청을 보내면 여기에 결과가 표시됩니다"}
        </pre>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600 }}>요청 히스토리</label>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {history.length === 0 && (
            <div style={{ fontSize: 13, color: "#9ca3af" }}>아직 보낸 요청이 없습니다.</div>
          )}
          {history.map((h) => (
            <div
              key={h.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 6,
                background: h.ok ? "#f9fafb" : "#fef2f2",
                border: "1px solid #e5e7eb",
              }}
            >
              <span>
                <span style={{ color: methodColor[h.method], fontWeight: 700 }}>
                  {h.method}
                </span>{" "}
                {h.path}
              </span>
              <span>
                {h.status ?? "ERR"} · {h.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
