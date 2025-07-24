import React, { useState, useRef } from "react";
import GridLayout from "react-grid-layout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const text =
  "Reliance Industries Limited (RIL) is an Indian multinational company headquartered in Mumbai, India. RIL's diverse businesses include energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles. The company has shown consistent growth strong fundamentals and market leadership position.";

const pieData = [
  { name: "Retail", value: 35 },
  { name: "Oil & Gas", value: 40 },
  { name: "Telecom", value: 25 },
];

const barData = [
  { name: "2019", revenue: 659651 },
  { name: "2020", revenue: 539238 },
  { name: "2021", revenue: 699962 },
  { name: "2022", revenue: 792756 },
];

const lineData = [
  { name: "Jan", price: 2000 },
  { name: "Feb", price: 2150 },
  { name: "Mar", price: 2300 },
  { name: "Apr", price: 2450 },
  { name: "May", price: 2380 },
  { name: "Jun", price: 2600 },
];

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
  </svg>
);

const App = () => {
  const [layout, setLayout] = useState([
    { i: "text", x: 0, y: 0, w: 12, h: 6, minW: 6, minH: 4 },
    { i: "line", x: 0, y: 6, w: 6, h: 6, minW: 4, minH: 5 },
    { i: "bar", x: 6, y: 6, w: 6, h: 6, minW: 4, minH: 5 },
    { i: "pie", x: 0, y: 12, w: 6, h: 6, minW: 4, minH: 5 },
    { i: "table", x: 6, y: 12, w: 6, h: 6, minW: 4, minH: 5 },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef();

  const handleGenerate = () => {
    if (!inputValue.trim()) return;

    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerated(true);
      setIsGenerating(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const exportPDF = () => {
    const input = printRef.current;
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      // 🏷️ Add Headline
      pdf.setFontSize(18);
      pdf.text(`Custom Report`, pdfWidth / 2, 15, { align: "center" });
      pdf.setFontSize(14);
      pdf.text(`Company: ${inputValue}`, pdfWidth / 2, 23, { align: "center" });

      const contentTop = 30; // 🧠 Leave space for headline

      if (pdfHeight > pageHeight - contentTop) {
        const pages = Math.ceil(pdfHeight / (pageHeight - contentTop));

        for (let i = 0; i < pages; i++) {
          if (i > 0) {
            pdf.addPage();
            pdf.setFontSize(18);
            pdf.text(`Custom Report`, pdfWidth / 2, 15, { align: "center" });
            pdf.setFontSize(14);
            pdf.text(`Company: ${inputValue}`, pdfWidth / 2, 23, { align: "center" });
          }

          pdf.addImage(
            imgData,
            "PNG",
            0,
            contentTop - i * (pageHeight - contentTop),
            pdfWidth,
            pdfHeight
          );
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, contentTop, pdfWidth, pdfHeight);
      }

      pdf.save(`${inputValue.replace(/[^a-zA-Z0-9]/g, '_')}_report.pdf`);
    });
  };


  const resetReport = () => {
    setIsGenerated(false);
    setInputValue("");
  };

  if (!isGenerated && !isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Report Generator
            </h1>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              Generate professional-grade custom reports with visuals, summaries, and data insights.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your topic or keyword (e.g., Sales Summary, Tesla Q2, Market Trends)..."
                className="w-full p-4 pr-16 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:outline-none transition-colors duration-200 text-md"
                rows="3"
              />
              <button
                onClick={handleGenerate}
                disabled={!inputValue.trim()}
                className="absolute bottom-3 right-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <SendIcon />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Reliance Industries", "Apple Inc", "Tesla", "Microsoft", "Google"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Press Enter to generate report • Powered by AI-driven analysis</p>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generating Report</h2>
          <p className="text-gray-600">Analyzing report data for {inputValue}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Custom Report
            </h1>
            <p className="text-gray-600">Generated for: <span className="font-semibold">{inputValue}</span></p>
          </div>
          <div className="flex gap-3">
  <button
    onClick={resetReport}
    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-2xl shadow-md hover:bg-gray-800 transition-all duration-200 text-sm font-semibold"
  >
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    New Report
  </button>

  <button
    onClick={exportPDF}
    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200 text-sm font-semibold"
  >
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 8l-3-3m3 3l3-3m6 6H6a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v9a2 2 0 01-2 2z" />
    </svg>
    Export PDF
  </button>
</div>

        </div>

        <div ref={printRef} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={40}
            width={1200}
            onLayoutChange={(layout) => setLayout(layout)}
            margin={[16, 16]}
          >
            {/* Enhanced Text Block */}
            <div key="text" className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Executive Summary</h2>
              </div>
              <div className="bg-white rounded-lg border border-blue-100 p-4 h-32 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed text-sm">{text}</p>
              </div>
            </div>

            {/* Enhanced Line Chart */}
            <div key="line" className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Stock Price Trend</h2>
              </div>
              <div className="bg-white rounded-lg border border-green-100 p-4" style={{ height: 'calc(100% - 80px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enhanced Bar Chart */}
            <div key="bar" className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Revenue Growth (₹ Crores)</h2>
              </div>
              <div className="bg-white rounded-lg border border-purple-100 p-4" style={{ height: 'calc(100% - 80px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()} Cr`, 'Revenue']}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enhanced Pie Chart */}
            <div key="pie" className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Business Segments</h2>
              </div>
              <div className="bg-white rounded-lg border border-orange-100 p-4" style={{ height: 'calc(100% - 80px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981", "#f59e0b"][index % 3]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enhanced Table */}
            <div key="table" className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Financial Summary</h2>
              </div>
              <div className="bg-white rounded-lg border border-slate-100 overflow-hidden" style={{ height: 'calc(100% - 80px)' }}>
                <div className="overflow-auto h-full">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Year</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Profit</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">2021</td>
                        <td className="px-4 py-3 text-sm text-gray-700">₹5,39,238 Cr</td>
                        <td className="px-4 py-3 text-sm text-gray-700">₹53,739 Cr</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">9.96%</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">2022</td>
                        <td className="px-4 py-3 text-sm text-gray-700">₹6,99,962 Cr</td>
                        <td className="px-4 py-3 text-sm text-gray-700">₹60,705 Cr</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">8.67%</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">2023</td>
                        <td className="px-4 py-3 text-sm text-gray-700">₹7,92,756 Cr</td>
                        <td className="px-4 py-3 text-sm text-gray-700">₹75,476 Cr</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">9.52%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </GridLayout>
        </div>
      </div>
    </div>
  );
};

export default App;