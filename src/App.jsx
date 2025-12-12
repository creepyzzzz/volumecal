import { useState, useEffect } from 'react';
import { FileDown } from 'lucide-react';
import HeaderForm from './components/HeaderForm';
import VolumeTable from './components/VolumeTable';
import { saveToStorage, loadFromStorage, debounce } from './utils/storage';
import { generatePDF } from './utils/pdfExport';

function App() {
  const [workInfo, setWorkInfo] = useState('');
  const [workType, setWorkType] = useState('');
  const [rows, setRows] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      // Handle migration from old format
      if (savedData.workName || savedData.siteLocation) {
        const combined = [savedData.workName, savedData.siteLocation].filter(Boolean).join('\n');
        setWorkInfo(combined || '');
      } else {
        setWorkInfo(savedData.workInfo || '');
      }
      setWorkType(savedData.workType || '');
      setRows(savedData.rows || []);
    }
  }, []);

  // Debounced save function
  const debouncedSave = debounce((data) => {
    saveToStorage(data);
  }, 300);

  // Auto-save whenever data changes
  useEffect(() => {
    const dataToSave = {
      workInfo,
      workType,
      rows,
    };
    debouncedSave(dataToSave);
  }, [workInfo, workType, rows]);

  const handleExportPDF = () => {
    if (rows.length === 0) {
      alert('No data to export. Please add at least one row.');
      return;
    }

    // Split workInfo into name and location (first line = name, rest = location)
    const lines = workInfo.split('\n').filter(Boolean);
    const workName = lines[0] || '';
    const siteLocation = lines.slice(1).join(', ') || lines[0] || '';
    const date = new Date().toLocaleDateString();

    generatePDF({
      workName,
      siteLocation,
      workType,
      date,
      rows,
    });
  };

  const grandTotalFt3 = rows.reduce((sum, row) => sum + (row.volFt3 || 0), 0);
  const grandTotalM3 = rows.reduce((sum, row) => sum + (row.volM3 || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8 safe-area-inset-bottom">
      {/* Header */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-20 shadow-sm safe-area-inset-top">
        <div className="px-4 py-2 sm:px-6 sm:py-3">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 tracking-tight">Volume Calculator</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <HeaderForm
            workInfo={workInfo}
            workType={workType}
            onWorkInfoChange={setWorkInfo}
            onWorkTypeChange={setWorkType}
          />
        </div>

        {/* Volume Table Card */}
        <VolumeTable rows={rows} onRowsChange={setRows} />

        {/* Grand Total Card */}
        {rows.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
            <div className="text-xs font-medium opacity-90 mb-1.5">Total Volume</div>
            <div className="text-2xl sm:text-3xl font-bold mb-0.5">{grandTotalFt3.toFixed(2)} ft³</div>
            <div className="text-base sm:text-lg font-medium opacity-95">{grandTotalM3.toFixed(2)} m³</div>
          </div>
        )}

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-semibold rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            disabled={rows.length === 0}
          >
            <FileDown className="h-5 w-5 mr-2" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

