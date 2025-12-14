export default function HeaderForm({ workInfo, workType, onWorkInfoChange, onWorkTypeChange }) {
  return (
    <div className="p-3 sm:p-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 w-full">
        <div>
          <label htmlFor="work-detail" className="block text-sm font-semibold text-gray-900 mb-2.5">
            Work Detail
          </label>
          <textarea
            id="work-detail"
            value={workInfo}
            onChange={(e) => onWorkInfoChange(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 sm:px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all resize-none"
            placeholder="Enter work detail"
            aria-label="Work detail input"
          />
        </div>
        
        <div>
          <label htmlFor="work-type" className="block text-sm font-semibold text-gray-900 mb-2.5">
            Work Type
          </label>
          <select
            id="work-type"
            value={workType}
            onChange={(e) => onWorkTypeChange(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all appearance-none"
            aria-label="Work type selection"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%236B7280\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
          >
            <option value="">Select Type</option>
            <option value="Crate">Crate</option>
            <option value="DRSM">DRSM</option>
          </select>
        </div>
      </div>
    </div>
  );
}

