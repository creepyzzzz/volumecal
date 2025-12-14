import { useState, useEffect } from 'react';
import { FileDown, Share2 } from 'lucide-react';
import HeaderForm from './components/HeaderForm';
import VolumeTable from './components/VolumeTable';
import { saveToStorage, loadFromStorage, debounce } from './utils/storage';
import { downloadPDF, sharePDF } from './utils/pdfExport';

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

  const getPDFData = () => {
    return {
      workDetail: workInfo,
      workType,
      rows,
    };
  };

  const handleDownloadPDF = () => {
    if (rows.length === 0) {
      alert('No data to export. Please add at least one row.');
      return;
    }

    downloadPDF(getPDFData());
  };

  const handleSharePDF = async () => {
    if (rows.length === 0) {
      alert('No data to export. Please add at least one row.');
      return;
    }

    await sharePDF(getPDFData());
  };

  const grandTotalFt3 = rows.reduce((sum, row) => sum + (row.volFt3 || 0), 0);
  const grandTotalM3 = rows.reduce((sum, row) => sum + (row.volM3 || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-4 sm:pb-8 safe-area-inset-bottom w-full overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-20 shadow-sm safe-area-inset-top w-full">
        <div className="px-4 py-2 sm:px-6 sm:py-3 safe-area-inset-left safe-area-inset-right max-w-full">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 tracking-tight">Volume Calculator</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6 safe-area-inset-left safe-area-inset-right w-full overflow-x-hidden">
        {/* Header Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
          <HeaderForm
            workInfo={workInfo}
            workType={workType}
            onWorkInfoChange={setWorkInfo}
            onWorkTypeChange={setWorkType}
          />
        </div>

        {/* Volume Table Card */}
        <div className="w-full overflow-x-hidden">
          <VolumeTable rows={rows} onRowsChange={setRows} />
        </div>

        {/* Grand Total Card */}
        {rows.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-lg sm:rounded-xl px-2.5 py-2 sm:px-4 sm:p-4 shadow-lg w-full overflow-hidden" role="region" aria-label="Total volume calculation">
            <div className="text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1">Total Volume</div>
            <div className="text-base sm:text-3xl font-bold mb-0 sm:mb-0.5 leading-tight">{grandTotalFt3.toFixed(2)} ft³</div>
            <div className="text-[10px] sm:text-lg font-medium">{grandTotalM3.toFixed(2)} m³</div>
          </div>
        )}

        {/* Export Buttons */}
        <div className="flex flex-row justify-end gap-2 sm:gap-3 w-full">
          <button
            onClick={handleSharePDF}
            className="inline-flex items-center justify-center px-3 py-1.5 sm:px-5 sm:py-3.5 bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            disabled={rows.length === 0}
            aria-label="Share PDF report"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" aria-hidden="true" />
            Share
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center px-3 py-1.5 sm:px-6 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            disabled={rows.length === 0}
            aria-label="Download PDF report"
          >
            <FileDown className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" aria-hidden="true" />
            Download
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;

