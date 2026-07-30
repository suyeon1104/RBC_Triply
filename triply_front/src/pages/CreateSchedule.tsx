import React, { useState } from 'react';
import { ArrowLeft, Settings, ChevronDown } from 'lucide-react';

export default function CreateSchedule() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [memo, setMemo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, location, date, startTime, endTime, memo });
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen p-5 flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <button type="button" className="p-1 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={24} className="text-[#333333]" />
          </button>
          <h1 className="text-lg font-bold text-[#1C1C1E] flex-1 text-center mr-6">
            계획 추가하기
          </h1>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3A3C] mb-2">
            카테고리
          </label>
          <div className="relative w-16 h-16 bg-[#7395FF] rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-3xl">❓</span>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 bg-[#3A3A3C] p-1 rounded-full border-2 border-[#F8F9FA] text-white"
            >
              <Settings size={12} />
            </button>
          </div>
        </div>

        {/* 계획 제목 */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3A3C] mb-2">
            계획 제목<span className="text-[#007AFF] ml-0.5">*</span>
          </label>
          <input
            type="text"
            placeholder="계획의 제목을 적어주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-[#1C1C1E] placeholder-[#A0A0A0] focus:outline-none focus:border-[#5882FF]"
          />
        </div>

        {/* 장소 */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3A3C] mb-2">
            장소<span className="text-[#007AFF] ml-0.5">*</span>
          </label>
          <input
            type="text"
            placeholder="장소를 적어주세요."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-[#1C1C1E] placeholder-[#A0A0A0] focus:outline-none focus:border-[#5882FF]"
          />
        </div>

        {/* 날짜 */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3A3C] mb-2">
            날짜<span className="text-[#007AFF] ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-[#1C1C1E] focus:outline-none focus:border-[#5882FF] appearance-none"
            />
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" />
          </div>
        </div>

        {/* 시간 */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3A3C] mb-2">
            시간<span className="text-[#007AFF] ml-0.5">*</span>
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-center text-[#1C1C1E] focus:outline-none focus:border-[#5882FF]"
            />
            <span className="text-[#666666] font-medium">-</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-center text-[#1C1C1E] focus:outline-none focus:border-[#5882FF]"
            />
          </div>
        </div>

        {/* 메모 */}
        <div>
          <label className="block text-sm font-semibold text-[#3A3A3C] mb-2">
            메모
          </label>
          <textarea
            placeholder="공백 포함 200자 이내로 작성할 수 있어요."
            maxLength={200}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={4}
            className="w-full bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 text-sm text-[#1C1C1E] placeholder-[#A0A0A0] focus:outline-none focus:border-[#5882FF] resize-none"
          />
        </div>

        {/* 하단 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#5882FF] hover:bg-[#4770ef] text-white font-bold py-4 rounded-xl transition shadow-sm mt-4"
        >
          계획 추가하기
        </button>
      </form>
    </div>
  );
}