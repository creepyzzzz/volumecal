import { Plus, Trash2, X } from 'lucide-react';
import { calculateVolume, formatNumber } from '../utils/calculations';

export default function VolumeTable({ rows, onRowsChange }) {
  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      length: '',
      heightReadings: '',
      topReadings: '',
      bedWidth: '',
      volFt3: 0,
      volM3: 0,
    };
    onRowsChange([...rows, newRow]);
  };

  const handleDeleteRow = (id) => {
    onRowsChange(rows.filter(row => row.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all rows?')) {
      onRowsChange([]);
    }
  };

  const handleInputChange = (id, field, value) => {
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        if (updatedRow.length && updatedRow.heightReadings && updatedRow.topReadings && updatedRow.bedWidth) {
          const { volFt3, volM3 } = calculateVolume(
            updatedRow.length,
            updatedRow.heightReadings,
            updatedRow.topReadings,
            updatedRow.bedWidth
          );
          updatedRow.volFt3 = volFt3;
          updatedRow.volM3 = volM3;
        } else {
          updatedRow.volFt3 = 0;
          updatedRow.volM3 = 0;
        }
        
        return updatedRow;
      }
      return row;
    });
    onRowsChange(updatedRows);
  };

  const handleKeyDown = (e, id, field) => {
    if (e.key === ' ' && (field === 'heightReadings' || field === 'topReadings')) {
      e.preventDefault();
      const currentValue = rows.find(r => r.id === id)?.[field] || '';
      handleInputChange(id, field, currentValue + '+');
    }
  };

  const grandTotalFt3 = rows.reduce((sum, row) => sum + (row.volFt3 || 0), 0);
  const grandTotalM3 = rows.reduce((sum, row) => sum + (row.volM3 || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Container with Mobile Scroll */}
      <div className="overflow-x-auto -mx-1">
        <div className="inline-block min-w-full align-middle px-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-14">
                  #
                </th>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px]">
                  Length
                </th>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px]">
                  Height
                </th>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px]">
                  Top
                </th>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px]">
                  Bed
                </th>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[90px]">
                  Vol (ft³)
                </th>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[90px]">
                  Vol (m³)
                </th>
                <th className="px-3 py-3.5 sm:px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center">
                    <div className="text-gray-400 text-sm font-medium">No measurements yet</div>
                    <div className="text-gray-300 text-xs mt-1">Click "Add Crate" to start</div>
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.length}
                        onChange={(e) => handleInputChange(row.id, 'length', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="5.6"
                      />
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.heightReadings}
                        onChange={(e) => handleInputChange(row.id, 'heightReadings', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, row.id, 'heightReadings')}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="5+5+5"
                      />
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.topReadings}
                        onChange={(e) => handleInputChange(row.id, 'topReadings', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, row.id, 'topReadings')}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="4+5+5"
                      />
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.bedWidth}
                        onChange={(e) => handleInputChange(row.id, 'bedWidth', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="5.6"
                      />
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatNumber(row.volFt3)}
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatNumber(row.volM3)}
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="bg-emerald-50/50 border-t-2 border-emerald-200">
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-right text-sm font-bold text-gray-900">
                    Grand Total:
                  </td>
                  <td className="px-3 py-4 sm:px-4 whitespace-nowrap text-sm font-bold text-emerald-700">
                    {formatNumber(grandTotalFt3)} ft³
                  </td>
                  <td className="px-3 py-4 sm:px-4 whitespace-nowrap text-sm font-bold text-emerald-700">
                    {formatNumber(grandTotalM3)} m³
                  </td>
                  <td className="px-3 py-4 sm:px-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-3">
        <button
          onClick={handleAddRow}
          className="inline-flex items-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Crate
        </button>
        <button
          onClick={handleClearAll}
          className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          disabled={rows.length === 0}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </button>
      </div>
    </div>
  );
}
