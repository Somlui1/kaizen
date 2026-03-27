import React, { useState, useRef, useCallback } from 'react';
import {
  Printer, ZoomIn, ZoomOut, FileText, CheckSquare,
  Layout, Info, Image as ImageIcon, Trash2, Move,
  Maximize2, MousePointer2, Type, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  "ความปลอดภัย", "ผลิตภายใน", "กระบวนการผลิต", "สภาพแวดล้อม",
  "ประหยัดพลังงาน", "สินค้าคงคลัง", "คุณภาพ", "วัตถุดิบ",
  "สภาพการทำงาน", "กำลังการผลิต", "นวัตกรรม", "อื่นๆ"
];

interface KaizenImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export default function App() {
  const [formData, setFormData] = useState({
    title: "แอปพลิเคชัน SOS Widget",
    name: "นาย วจีประดิษฐ์ พรมพันธ์",
    empId: "10002898",
    dept: "AH",
    section: "IT",
    date: "26/02/26",
    logoUrl: "https://picsum.photos/seed/logo/100/100",
    categories: [false, false, false, false, false, false, false, false, true, false, false, true],
    categoryNames: [...CATEGORIES],
    otherCategoryText: "เพิ่มประสิทธิภาพ",
    evaluators: ["หัวหน้างาน", "โฟร์แมน", "ซุปเปอร์ไวเซอร์", "ผจก.แผนก", "ผจก.ฝ่าย"],
    evaluationCriteria: [
      { label: "ไอเดีย/แนวคิด", a: "16", b: "13", c: "10", d: "5", key: "idea" },
      { label: "ความมุ่งมั่น", a: "8", b: "6", c: "4", d: "2", key: "effort" },
      { label: "ความมีประโยชน์", a: "8", b: "6", c: "4", d: "2", key: "benefit" },
      { label: "ความทนทาน", a: "8", b: "6", c: "4", d: "2", key: "durability" },
      { label: "ประโยชน์อื่นๆ", a: "15", b: "10", b_val: "10", c: "5", d: "0", key: "others" }
    ],
    reason: "1. ปัจจุบันขั้นตอนการแจ้งเหตุฉุกเฉินหรืออุบัติเหตุร้ายแรงในสายการผลิตยังต้องใช้ระบบการสื่อสารหลายขั้นตอน ทำให้เกิดความล่าช้าในการเข้าช่วยเหลือ\n2. การเบิกจ่ายอุปกรณ์ซ่อมบำรุงในคลังสินค้าต้องใช้การเขียนใบเบิกกระดาษ ซึ่งใช้เวลาตรวจสอบนานและสูญหายได้ง่าย",
    currentStatus: "- พนักงานต้องเดินไปแจ้งเหตุที่จุดรักษาความปลอดภัยส่วนกลาง (ใช้เวลาเฉลี่ย 5-10 นาที)\n- หากเป็นช่วงกะดึก บุคลากรที่รับเรื่องมีจำนวนจำกัด ทำให้การประสานงานช้าลง",
    idea: "สร้าง Widget ปุ่ม SOS ไว้บนหน้าจอแท็บเล็ตประจำเครื่องจักรแต่ละจุด เมื่อกดปุ่ม ระบบจะส่งแจ้งเตือนพร้อมระบุพิกัดเครื่องจักรไปที่ทีมช่างทันที",
    result: "ก่อนทำ: การส่งต่อข้อมูลพึ่งพาระบบ Manual (บุคคลแจ้งบุคคล) ใช้เวลาเฉลี่ย 15 นาที\n\nหลังทำ:\n- ลดระยะเวลาแจ้งเหตุเหลือเพียง 10 วินาที\n- ทีมช่วยเหลือสามารถประเมินตำแหน่งและเตรียมอุปกรณ์ที่เกี่ยวข้องได้ตรงจุดก่อนไปถึงหน้างาน",
    scores: {
      idea: "",
      effort: "",
      benefit: "",
      durability: "",
      others: "",
      savings: "0",
      savingsTotal: "",
      total: "0"
    },
    labels: {
      headerTitle: "แบบฟอร์มการเสนอแนะ (KAIZEN SUGGESTION FORM)",
      categoryLabel: "ประเภทของ การไคเซ็น",
      titleLabel: "ชื่อเรื่อง",
      nameLabel: "ชื่อ-นามสกุล",
      empIdLabel: "รหัสพนักงาน",
      deptLabel: "ฝ่าย",
      sectionLabel: "แผนก",
      dateLabel: "วันที่ยื่นเรื่อง",
      reasonLabel: "เหตุผล/ที่มาของการไคเซ็น",
      evaluationHeaderLabel: "สำหรับการประเมินของหัวหน้างาน",
      evaluationResultLabel: "1. ผลการประเมิน",
      gradeA: "A",
      gradeB: "B",
      gradeC: "C",
      gradeD: "D",
      totalScoreLabel: "คะแนนรวม",
      savingsLabel: "จำนวนเงินที่ประหยัดได้",
      totalReceivedLabel: "ได้รับ / คะแนนรวม",
      imagePlaceholderLabel: "พื้นที่สำหรับติดรูปประกอบ (ถ้ามี)",
      currentStatusLabel: "สภาพปัจจุบัน (จากข้อมูลในอดีตที่รวบรวมได้)",
      ideaLabel: "ไอเดีย/แนวคิดในการไคเซ็น",
      resultLabel: "ผลของการไคเซ็น (เปรียบเทียบก่อน-หลัง/ประโยชน์ที่ได้รับจากการนำไปใช้)",
      currencyLabel: "บาท"
    }
  });

  const [images, setImages] = useState<KaizenImage[]>([]);
  const [zoom, setZoom] = useState(0.8);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDirectEdit = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (index: number) => {
    const newCategories = [...formData.categories];
    newCategories[index] = !newCategories[index];
    setFormData(prev => ({ ...prev, categories: newCategories }));
  };

  const handleScoreChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      scores: { ...prev.scores, [field]: value }
    }));
  };

  const handleLabelChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      labels: { ...prev.labels, [key]: value }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: KaizenImage = {
          id: Math.random().toString(36).substr(2, 9),
          src: event.target?.result as string,
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          rotation: 0
        };
        setImages(prev => [...prev, newImage]);
        setActiveImageId(newImage.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImage = (id: string, updates: Partial<KaizenImage>) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (activeImageId === id) setActiveImageId(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sarabun text-slate-900">
      {/* Sidebar Editor */}
      <aside className="no-print w-[380px] h-screen bg-white border-r border-slate-200 overflow-y-auto sticky top-0 shadow-2xl z-50 flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Layout size={24} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Kaizen Pro</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">A4 Precision Document Editor</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Action Toolbar */}
          <section className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <ImageIcon className="text-slate-400 group-hover:text-blue-500" size={24} />
              <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">เพิ่มรูปภาพ</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </button>
            <button
              onClick={() => window.print()}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 group"
            >
              <Printer className="text-white" size={24} />
              <span className="text-xs font-bold text-white">พิมพ์เอกสาร</span>
            </button>
          </section>

          {/* Form Sections */}
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Info size={16} className="text-blue-500" /> ข้อมูลพื้นฐาน
                </h2>
              </div>
              <div className="space-y-3">
                <div className="group">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">ชื่อเรื่อง</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">ชื่อ-นามสกุล</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">รหัสพนักงาน</label>
                    <input
                      type="text"
                      name="empId"
                      value={formData.empId}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">ฝ่าย</label>
                    <input
                      type="text"
                      name="dept"
                      value={formData.dept}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">แผนก</label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">วันที่ยื่นเรื่อง</label>
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">โลโก้</label>
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                      <ImageIcon size={14} /> เลือกโลโก้
                    </button>
                    <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" /> เนื้อหาการไคเซ็น
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">เหตุผล/ที่มา</label>
                  <textarea
                    name="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">สภาพปัจจุบัน</label>
                  <textarea
                    name="currentStatus"
                    rows={3}
                    value={formData.currentStatus}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">ไอเดีย/แนวคิด</label>
                  <textarea
                    name="idea"
                    rows={3}
                    value={formData.idea}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">ผลที่ได้รับ</label>
                  <textarea
                    name="result"
                    rows={3}
                    value={formData.result}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Image Layers */}
            {images.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon size={16} className="text-blue-500" /> เลเยอร์รูปภาพ ({images.length})
                </h2>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {images.map((img, idx) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${activeImageId === img.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}
                        onClick={() => setActiveImageId(img.id)}
                      >
                        <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                          <img src={img.src} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">รูปภาพ #{idx + 1}</p>
                          <p className="text-[10px] text-slate-400">{Math.round(img.width)}x{Math.round(img.height)} px</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteImage(img.id); }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CheckSquare size={16} className="text-blue-500" /> ประเภทการไคเซ็น
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {CATEGORIES.map((cat, i) => (
                  <label key={cat} className="flex items-center gap-2 text-xs font-medium cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.categories[i] ? 'bg-blue-500 border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
                      {formData.categories[i] && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.categories[i]}
                      onChange={() => handleCategoryChange(i)}
                      className="hidden"
                    />
                    <span className={formData.categories[i] ? 'text-blue-600 font-bold' : 'text-slate-500'}>{cat}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zoom Preview</span>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{Math.round(zoom * 100)}%</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">
              <ZoomOut size={18} />
            </button>
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-blue-600"
            />
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">
              <ZoomIn size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 flex justify-center p-10 overflow-y-auto print-area bg-slate-100/50">
        <div
          ref={paperRef}
          className="paper shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out relative"
          style={{ transform: `scale(${zoom})` }}
          onClick={() => setActiveImageId(null)}
        >
          {/* A4 Content Container */}
          <div className="absolute top-[var(--main-margin)] left-[var(--main-margin)] right-[var(--main-margin)] bottom-[var(--main-margin)] border border-black flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <div className="h-[var(--header-height)] border-b border-black flex bg-[#fafafa]">
              <div
                className="w-[11%] flex items-center justify-center p-1 cursor-pointer group relative"
                onClick={() => logoInputRef.current?.click()}
              >
                <img
                  src={formData.logoUrl}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center no-print">
                  <Plus size={16} className="text-white" />
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center px-3 text-[8pt] font-bold text-center">
                <input
                  type="text"
                  value={formData.labels.headerTitle}
                  onChange={(e) => handleLabelChange('headerTitle', e.target.value)}
                  className="w-full bg-transparent outline-none text-center focus:bg-blue-50/50"
                />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-rows-[18fr_14fr_13fr] min-h-0">
              {/* Top Row */}
              <div className="grid grid-cols-[55%_45%] border-b border-black">
                <div className="grid grid-rows-[50%_50%] border-r border-black">
                  {/* Category Grid */}
                  <div className="grid grid-cols-[20%_80%] border-b border-black">
                    <div className="row-span-2 border-r border-b border-black flex items-center justify-center text-center font-bold text-[9pt] p-1">
                      <textarea
                        value={formData.labels.categoryLabel}
                        onChange={(e) => handleLabelChange('categoryLabel', e.target.value)}
                        className="w-full bg-transparent outline-none text-center resize-none h-full flex items-center justify-center leading-tight"
                        rows={2}
                      />
                    </div>
                    <div className="row-span-2 border-b border-black">
                      <div className="grid grid-cols-[28%_28%_44%] grid-rows-4 h-full">
                        {formData.categoryNames.map((cat, i) => (
                          <label key={i} className="blue-cell flex items-center gap-1 cursor-pointer hover:bg-blue-50/30 leading-tight">
                            <input
                              type="checkbox"
                              checked={formData.categories[i]}
                              onChange={() => handleCategoryChange(i)}
                              className="scale-75 cursor-pointer flex-shrink-0"
                            />
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const newNames = [...formData.categoryNames];
                                newNames[i] = e.currentTarget.innerText;
                                handleDirectEdit('categoryNames', newNames);
                              }}
                              className={`text-[5.5pt] bg-transparent outline-none whitespace-nowrap ${i === 11 ? 'inline-block min-w-0' : 'w-full'}`}
                            >
                              {cat}
                            </span>
                            {i === 11 && formData.categories[11] && (
                              <input
                                type="text"
                                value={formData.otherCategoryText}
                                onChange={(e) => handleDirectEdit('otherCategoryText', e.target.value)}
                                className="ml-1 border-b border-black min-w-[30px] text-[6pt] bg-transparent outline-none flex-1"
                              />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Title */}
                    <div className="border-r border-b border-black flex items-center px-2 font-bold text-[9pt]">
                      <input
                        type="text"
                        value={formData.labels.titleLabel}
                        onChange={(e) => handleLabelChange('titleLabel', e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="border-b border-black flex items-center px-2 font-bold text-[9pt] overflow-hidden">
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleDirectEdit('title', e.target.value)}
                        className="w-full bg-transparent outline-none focus:bg-blue-50/50"
                      />
                    </div>
                    {/* Name & ID */}
                    <div className="border-r border-b border-black flex items-center px-2 font-bold text-[9pt]">
                      <input
                        type="text"
                        value={formData.labels.nameLabel}
                        onChange={(e) => handleLabelChange('nameLabel', e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-[60%_20%_20%] border-b border-black">
                      <div className="border-r border-black flex items-center px-2 font-bold text-[9pt]">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleDirectEdit('name', e.target.value)}
                          className="w-full bg-transparent outline-none focus:bg-blue-50/50"
                        />
                      </div>
                      <div className="border-r border-black flex items-center justify-center text-[8pt] font-bold">
                        <input
                          type="text"
                          value={formData.labels.empIdLabel}
                          onChange={(e) => handleLabelChange('empIdLabel', e.target.value)}
                          className="w-full bg-transparent outline-none text-center"
                        />
                      </div>
                      <div className="flex items-center justify-center font-bold text-[9pt]">
                        <input
                          type="text"
                          value={formData.empId}
                          onChange={(e) => handleDirectEdit('empId', e.target.value)}
                          className="w-full bg-transparent outline-none text-center focus:bg-blue-50/50"
                        />
                      </div>
                    </div>
                    {/* Dept & Date */}
                    <div className="border-r border-black flex items-center px-2 font-bold text-[9pt]">
                      <input
                        type="text"
                        value={formData.labels.deptLabel}
                        onChange={(e) => handleLabelChange('deptLabel', e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-[60%_20%_20%]">
                      <div className="grid grid-cols-3 border-r border-black">
                        <div className="border-r border-black flex items-center justify-center font-bold text-[9pt]">
                          <input
                            type="text"
                            value={formData.dept}
                            onChange={(e) => handleDirectEdit('dept', e.target.value)}
                            className="w-full bg-transparent outline-none text-center focus:bg-blue-50/50"
                          />
                        </div>
                        <div className="border-r border-black flex items-center justify-center text-[8pt] font-bold">
                          <input
                            type="text"
                            value={formData.labels.sectionLabel}
                            onChange={(e) => handleLabelChange('sectionLabel', e.target.value)}
                            className="w-full bg-transparent outline-none text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center font-bold text-[9pt]">
                          <input
                            type="text"
                            value={formData.section}
                            onChange={(e) => handleDirectEdit('section', e.target.value)}
                            className="w-full bg-transparent outline-none text-center focus:bg-blue-50/50"
                          />
                        </div>
                      </div>
                      <div className="border-r border-black flex items-center justify-center text-[8.5pt] font-bold">
                        <input
                          type="text"
                          value={formData.labels.dateLabel}
                          onChange={(e) => handleLabelChange('dateLabel', e.target.value)}
                          className="w-full bg-transparent outline-none text-center"
                        />
                      </div>
                      <div className="flex items-center justify-center font-bold text-[9pt]">
                        <input
                          type="text"
                          value={formData.date}
                          onChange={(e) => handleDirectEdit('date', e.target.value)}
                          className="w-full bg-transparent outline-none text-center focus:bg-blue-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reason Section */}
                  <div className="grid grid-rows-[auto_1fr]">
                    <div className="border-b border-black px-2 py-1 font-bold text-[8pt] flex items-center h-[var(--row-h)]">
                      <input
                        type="text"
                        value={formData.labels.reasonLabel}
                        onChange={(e) => handleLabelChange('reasonLabel', e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleDirectEdit('reason', e.currentTarget.innerText)}
                      className="lined-text-area text-[8pt] whitespace-pre-wrap outline-none focus:bg-blue-50/20 h-full break-words overflow-y-auto"
                    >
                      {formData.reason}
                    </div>
                  </div>
                </div>

                {/* Evaluation Column */}
                <div className="grid grid-rows-[60%_40%]">
                  <div className="grid grid-rows-[10%_90%] border-b border-black">
                    <div className="border-b border-black px-2 py-1 text-[7pt] text-slate-400">
                      <input
                        type="text"
                        value={formData.labels.evaluationHeaderLabel}
                        onChange={(e) => handleLabelChange('evaluationHeaderLabel', e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-rows-[11.11%_88.89%]">
                      <div className="grid grid-cols-5 border-b border-black text-[7pt]">
                        {formData.evaluators.map((h, i) => (
                          <div key={i} className="border-r border-black last:border-r-0 flex items-center justify-center">
                            <input
                              type="text"
                              value={h}
                              onChange={(e) => {
                                const newEvaluators = [...formData.evaluators];
                                newEvaluators[i] = e.target.value;
                                handleDirectEdit('evaluators', newEvaluators);
                              }}
                              className="w-full text-center bg-transparent outline-none"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-[40%_10%_10%_10%_10%_20%] grid-rows-8 h-full text-[7pt]">
                        <div className="border-r border-b border-black flex items-center px-2 font-bold text-[8pt]">
                          <input
                            type="text"
                            value={formData.labels.evaluationResultLabel}
                            onChange={(e) => handleLabelChange('evaluationResultLabel', e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </div>
                        {[
                          { key: 'gradeA', val: formData.labels.gradeA },
                          { key: 'gradeB', val: formData.labels.gradeB },
                          { key: 'gradeC', val: formData.labels.gradeC },
                          { key: 'gradeD', val: formData.labels.gradeD }
                        ].map(l => (
                          <div key={l.key} className="border-r border-b border-black flex items-center justify-center font-bold">
                            <input
                              type="text"
                              value={l.val}
                              onChange={(e) => handleLabelChange(l.key, e.target.value)}
                              className="w-full text-center bg-transparent outline-none"
                            />
                          </div>
                        ))}
                        <div className="border-b border-black flex items-center justify-center font-bold">
                          <input
                            type="text"
                            value={formData.labels.totalScoreLabel}
                            onChange={(e) => handleLabelChange('totalScoreLabel', e.target.value)}
                            className="w-full text-center bg-transparent outline-none"
                          />
                        </div>

                        {formData.evaluationCriteria.map((item, idx) => (
                          <React.Fragment key={item.key}>
                            <div className="border-r border-b border-black flex items-center px-2">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const newCriteria = [...formData.evaluationCriteria];
                                  newCriteria[idx].label = e.target.value;
                                  handleDirectEdit('evaluationCriteria', newCriteria);
                                }}
                                className="w-full bg-transparent outline-none"
                              />
                            </div>
                            <div className="border-r border-b border-black flex items-center justify-center">
                              <input
                                type="text"
                                value={item.a}
                                onChange={(e) => {
                                  const newCriteria = [...formData.evaluationCriteria];
                                  newCriteria[idx].a = e.target.value;
                                  handleDirectEdit('evaluationCriteria', newCriteria);
                                }}
                                className="w-full text-center bg-transparent outline-none"
                              />
                            </div>
                            <div className="border-r border-b border-black flex items-center justify-center">
                              <input
                                type="text"
                                value={item.b}
                                onChange={(e) => {
                                  const newCriteria = [...formData.evaluationCriteria];
                                  newCriteria[idx].b = e.target.value;
                                  handleDirectEdit('evaluationCriteria', newCriteria);
                                }}
                                className="w-full text-center bg-transparent outline-none"
                              />
                            </div>
                            <div className="border-r border-b border-black flex items-center justify-center">
                              <input
                                type="text"
                                value={item.c}
                                onChange={(e) => {
                                  const newCriteria = [...formData.evaluationCriteria];
                                  newCriteria[idx].c = e.target.value;
                                  handleDirectEdit('evaluationCriteria', newCriteria);
                                }}
                                className="w-full text-center bg-transparent outline-none"
                              />
                            </div>
                            <div className="border-r border-b border-black flex items-center justify-center">
                              <input
                                type="text"
                                value={item.d}
                                onChange={(e) => {
                                  const newCriteria = [...formData.evaluationCriteria];
                                  newCriteria[idx].d = e.target.value;
                                  handleDirectEdit('evaluationCriteria', newCriteria);
                                }}
                                className="w-full text-center bg-transparent outline-none"
                              />
                            </div>
                            <div className="border-b border-black flex items-center justify-center">
                              <input
                                type="text"
                                value={formData.scores[item.key as keyof typeof formData.scores]}
                                onChange={(e) => handleScoreChange(item.key, e.target.value)}
                                className="w-full h-full text-center outline-none bg-transparent focus:bg-blue-50/50"
                              />
                            </div>
                          </React.Fragment>
                        ))}

                        <div className="border-r border-b border-black flex items-center px-2">
                          <input
                            type="text"
                            value={formData.labels.savingsLabel}
                            onChange={(e) => handleLabelChange('savingsLabel', e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </div>
                        <div className="col-span-4 border-r border-b border-black flex items-center justify-end px-2">
                          <input
                            type="text"
                            value={formData.scores.savings}
                            onChange={(e) => handleScoreChange('savings', e.target.value)}
                            className="w-20 text-right outline-none bg-transparent mr-1 focus:bg-blue-50/50"
                          />
                          <input
                            type="text"
                            value={formData.labels.currencyLabel}
                            onChange={(e) => handleLabelChange('currencyLabel', e.target.value)}
                            className="w-10 bg-transparent outline-none"
                          />
                        </div>
                        <div className="border-b border-black flex items-center justify-center">
                          <input
                            type="text"
                            value={formData.scores.savingsTotal}
                            onChange={(e) => handleScoreChange('savingsTotal', e.target.value)}
                            className="w-full h-full text-center outline-none bg-transparent focus:bg-blue-50/50"
                          />
                        </div>

                        <div className="border-r border-black flex items-center px-2 font-bold text-[8pt]">
                          <input
                            type="text"
                            value={formData.labels.totalReceivedLabel}
                            onChange={(e) => handleLabelChange('totalReceivedLabel', e.target.value)}
                            className="w-full bg-transparent outline-none font-bold"
                          />
                        </div>
                        <div className="col-span-4 border-r border-black flex items-center justify-end px-2 font-bold">
                          <input
                            type="text"
                            value={formData.labels.currencyLabel}
                            onChange={(e) => handleLabelChange('currencyLabel', e.target.value)}
                            className="w-10 bg-transparent outline-none text-right font-bold"
                          />
                        </div>
                        <div className="flex items-center justify-center font-bold">
                          <input
                            type="text"
                            value={formData.scores.total}
                            onChange={(e) => handleScoreChange('total', e.target.value)}
                            className="w-full h-full text-center outline-none bg-transparent focus:bg-blue-50/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#fcfcfc] flex items-center justify-center text-[9pt] font-bold text-slate-200 border-b border-black relative">
                    <input
                      type="text"
                      value={formData.labels.imagePlaceholderLabel}
                      onChange={(e) => handleLabelChange('imagePlaceholderLabel', e.target.value)}
                      className="w-full bg-transparent outline-none text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Middle Row */}
              <div className="grid grid-rows-[auto_1fr_auto_1fr] border-b border-black">
                <div className="border-b border-black px-2 py-1 font-bold text-[8pt] flex items-center h-[var(--row-h)]">
                  <input
                    type="text"
                    value={formData.labels.currentStatusLabel}
                    onChange={(e) => handleLabelChange('currentStatusLabel', e.target.value)}
                    className="w-full bg-transparent outline-none font-bold"
                  />
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleDirectEdit('currentStatus', e.currentTarget.innerText)}
                  className="lined-text-area text-[8pt] whitespace-pre-wrap border-b border-black outline-none focus:bg-blue-50/20 h-full break-words overflow-y-auto"
                >
                  {formData.currentStatus}
                </div>
                <div className="border-b border-black px-2 py-1 font-bold text-[8pt] flex items-center h-[var(--row-h)]">
                  <input
                    type="text"
                    value={formData.labels.ideaLabel}
                    onChange={(e) => handleLabelChange('ideaLabel', e.target.value)}
                    className="w-full bg-transparent outline-none font-bold"
                  />
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleDirectEdit('idea', e.currentTarget.innerText)}
                  className="lined-text-area text-[8pt] whitespace-pre-wrap outline-none focus:bg-blue-50/20 h-full break-words overflow-y-auto"
                >
                  {formData.idea}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-rows-[auto_1fr]">
                <div className="border-b border-black px-2 py-1 font-bold text-[8pt] flex items-center h-[var(--row-h)]">
                  <input
                    type="text"
                    value={formData.labels.resultLabel}
                    onChange={(e) => handleLabelChange('resultLabel', e.target.value)}
                    className="w-full bg-transparent outline-none font-bold"
                  />
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleDirectEdit('result', e.currentTarget.innerText)}
                  className="lined-text-area text-[8pt] whitespace-pre-wrap outline-none focus:bg-blue-50/20 h-full break-words overflow-y-auto"
                >
                  {formData.result}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Images Layer */}
          <div className="absolute inset-0 pointer-events-none">
            {images.map((img) => (
              <motion.div
                key={img.id}
                drag
                dragMomentum={false}
                onDrag={(e, info) => {
                  updateImage(img.id, { x: img.x + info.delta.x / zoom, y: img.y + info.delta.y / zoom });
                }}
                className={`absolute pointer-events-auto cursor-move group ${activeImageId === img.id ? 'z-50' : 'z-10'}`}
                style={{ left: img.x, top: img.y, width: img.width, height: img.height }}
                onClick={(e) => { e.stopPropagation(); setActiveImageId(img.id); }}
              >
                <div className={`w-full h-full relative border-2 transition-all ${activeImageId === img.id ? 'border-blue-500 shadow-xl' : 'border-transparent group-hover:border-blue-300'}`}>
                  <img src={img.src} className="w-full h-full object-contain" draggable={false} />

                  {/* Resize Handle */}
                  {activeImageId === img.id && (
                    <div
                      className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 text-white flex items-center justify-center cursor-nwse-resize rounded-tl-lg"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = img.width;
                        const startHeight = img.height;

                        const onMouseMove = (moveEvent: MouseEvent) => {
                          const deltaX = (moveEvent.clientX - startX) / zoom;
                          const deltaY = (moveEvent.clientY - startY) / zoom;
                          updateImage(img.id, {
                            width: Math.max(50, startWidth + deltaX),
                            height: Math.max(50, startHeight + deltaY)
                          });
                        };

                        const onMouseUp = () => {
                          window.removeEventListener('mousemove', onMouseMove);
                          window.removeEventListener('mouseup', onMouseUp);
                        };

                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                      }}
                    >
                      <Maximize2 size={12} />
                    </div>
                  )}

                  {/* Delete Button */}
                  {activeImageId === img.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteImage(img.id); }}
                      className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Tooltip for Active Image */}
      {activeImageId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="no-print fixed bottom-10 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-6 z-[100]"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <ImageIcon size={16} /> Image Controls
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">W:</span>
              <input
                type="number"
                value={Math.round(images.find(i => i.id === activeImageId)?.width || 0)}
                onChange={(e) => updateImage(activeImageId, { width: parseInt(e.target.value) })}
                className="w-16 p-1 border rounded text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">H:</span>
              <input
                type="number"
                value={Math.round(images.find(i => i.id === activeImageId)?.height || 0)}
                onChange={(e) => updateImage(activeImageId, { height: parseInt(e.target.value) })}
                className="w-16 p-1 border rounded text-xs"
              />
            </div>
          </div>
          <button
            onClick={() => deleteImage(activeImageId)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setActiveImageId(null)}
            className="bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
          >
            Done
          </button>
        </motion.div>
      )}
    </div>
  );
}
