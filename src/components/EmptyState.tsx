
import { Search } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No conversations found</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        Try searching with a different name or start a new conversation
      </p>
    </div>
  );
};
