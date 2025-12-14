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
    // Handle spacebar for Height and Top fields (works on mobile and desktop)
    if ((field === 'heightReadings' || field === 'topReadings') && 
        (e.key === ' ' || e.key === 'Space' || e.keyCode === 32)) {
      e.preventDefault();
      e.stopPropagation();
      const currentValue = rows.find(r => r.id === id)?.[field] || '';
      handleInputChange(id, field, currentValue + '+');
      return false;
    }
  };

  const handleKeyUp = (e, id, field) => {
    // Additional handler for mobile keyboards
    if ((field === 'heightReadings' || field === 'topReadings') && 
        (e.key === ' ' || e.key === 'Space' || e.keyCode === 32)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const handleBeforeInput = (e, id, field) => {
    // Handle spacebar before input is inserted (better for mobile)
    if ((field === 'heightReadings' || field === 'topReadings') && e.data === ' ') {
      e.preventDefault();
      const currentValue = rows.find(r => r.id === id)?.[field] || '';
      handleInputChange(id, field, currentValue + '+');
      return false;
    }
  };

  const handleInputChangeWithSpace = (e, id, field) => {
    // Intercept space characters in onChange and convert to +
    if (field === 'heightReadings' || field === 'topReadings') {
      const value = e.target.value;
      // Check if space was just added
      const lastChar = value[value.length - 1];
      if (lastChar === ' ') {
        // Replace space with +
        const newValue = value.slice(0, -1) + '+';
        handleInputChange(id, field, newValue);
        return;
      }
    }
    // Normal change handler
    handleInputChange(id, field, e.target.value);
  };

  const grandTotalFt3 = rows.reduce((sum, row) => sum + (row.volFt3 || 0), 0);
  const grandTotalM3 = rows.reduce((sum, row) => sum + (row.volM3 || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      {/* Table Container with Mobile Scroll */}
      <div className="overflow-x-auto overscroll-x-contain w-full">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs sm:text-xs font-bold text-gray-900 uppercase tracking-wider w-10 sm:w-14">
                  #
                </th>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs sm:text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[85px] sm:min-w-[100px]">
                  Length
                </th>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs sm:text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[95px] sm:min-w-[120px]">
                  Height
                </th>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs sm:text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[95px] sm:min-w-[120px]">
                  Top
                </th>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs sm:text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[85px] sm:min-w-[100px]">
                  Bed
                </th>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs sm:text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[80px] sm:min-w-[90px]">
                  Vol (ft³)
                </th>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs sm:text-xs font-bold text-gray-900 uppercase tracking-wider min-w-[80px] sm:min-w-[90px]">
                  Vol (m³)
                </th>
                <th scope="col" className="px-2.5 py-3.5 sm:px-3 sm:py-3.5 text-left text-xs font-bold text-gray-900 uppercase tracking-wider w-12 sm:w-16">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length === 0 ? (
                <tr>
                    <td colSpan="8" className="px-4 py-8 sm:py-12 text-center">
                      <div className="text-gray-600 text-xs sm:text-sm font-medium">No measurements yet</div>
                      <div className="text-gray-500 text-[10px] sm:text-xs mt-1">Click "Add" to start</div>
                    </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap text-sm sm:text-sm font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap">
                      <label htmlFor={`length-${row.id}`} className="sr-only">Length for row {index + 1}</label>
                      <input
                        id={`length-${row.id}`}
                        type="text"
                        value={row.length}
                        onChange={(e) => handleInputChange(row.id, 'length', e.target.value)}
                        className="w-full px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="5.6"
                        aria-label={`Length for row ${index + 1}`}
                      />
                    </td>
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap">
                      <label htmlFor={`height-${row.id}`} className="sr-only">Height for row {index + 1}</label>
                      <input
                        id={`height-${row.id}`}
                        type="text"
                        value={row.heightReadings}
                        onChange={(e) => handleInputChangeWithSpace(e, row.id, 'heightReadings')}
                        onKeyDown={(e) => handleKeyDown(e, row.id, 'heightReadings')}
                        onKeyUp={(e) => handleKeyUp(e, row.id, 'heightReadings')}
                        onBeforeInput={(e) => handleBeforeInput(e, row.id, 'heightReadings')}
                        className="w-full px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="5+5+5"
                        aria-label={`Height readings for row ${index + 1}. Press space to add plus sign.`}
                      />
                    </td>
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap">
                      <label htmlFor={`top-${row.id}`} className="sr-only">Top for row {index + 1}</label>
                      <input
                        id={`top-${row.id}`}
                        type="text"
                        value={row.topReadings}
                        onChange={(e) => handleInputChangeWithSpace(e, row.id, 'topReadings')}
                        onKeyDown={(e) => handleKeyDown(e, row.id, 'topReadings')}
                        onKeyUp={(e) => handleKeyUp(e, row.id, 'topReadings')}
                        onBeforeInput={(e) => handleBeforeInput(e, row.id, 'topReadings')}
                        className="w-full px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="4+5+5"
                        aria-label={`Top readings for row ${index + 1}. Press space to add plus sign.`}
                      />
                    </td>
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap">
                      <label htmlFor={`bed-${row.id}`} className="sr-only">Bed for row {index + 1}</label>
                      <input
                        id={`bed-${row.id}`}
                        type="text"
                        value={row.bedWidth}
                        onChange={(e) => handleInputChange(row.id, 'bedWidth', e.target.value)}
                        className="w-full px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="5.6"
                        aria-label={`Bed width for row ${index + 1}`}
                      />
                    </td>
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap text-sm sm:text-sm font-semibold text-gray-900">
                      {formatNumber(row.volFt3)}
                    </td>
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap text-sm sm:text-sm font-semibold text-gray-900">
                      {formatNumber(row.volM3)}
                    </td>
                    <td className="px-2.5 py-3 sm:px-3 sm:py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-gray-600 hover:text-red-600 p-1 sm:p-1.5 rounded-lg hover:bg-red-50 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        aria-label={`Delete row ${index + 1}`}
                        title={`Delete row ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="bg-emerald-100 border-t-2 border-emerald-300">
                <tr>
                  <td colSpan="5" className="px-2.5 py-3 sm:px-4 sm:py-4 text-right text-sm sm:text-sm font-bold text-gray-900">
                    Grand Total:
                  </td>
                  <td className="px-2.5 py-3 sm:px-3 sm:py-4 whitespace-nowrap text-sm sm:text-sm font-bold text-emerald-800">
                    {formatNumber(grandTotalFt3)} ft³
                  </td>
                  <td className="px-2.5 py-3 sm:px-3 sm:py-4 whitespace-nowrap text-sm sm:text-sm font-bold text-emerald-800">
                    {formatNumber(grandTotalM3)} m³
                  </td>
                  <td className="px-2.5 py-3 sm:px-3 sm:py-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-row gap-2 sm:gap-3 w-full">
        <button
          onClick={handleAddRow}
          className="inline-flex items-center justify-center px-3 py-1.5 sm:px-5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all active:scale-95 flex-1 sm:flex-initial"
          aria-label="Add new row"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
          Add
        </button>
        <button
          onClick={handleClearAll}
          className="inline-flex items-center justify-center px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-1 sm:flex-initial"
          disabled={rows.length === 0}
          aria-label="Clear all rows"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
          Clear All
        </button>
      </div>
    </div>
  );
}
