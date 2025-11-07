import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  note?: string;
  colorClass?: string; 
  icon?: ReactNode;
}

const StatCard = ({ title, value, note, colorClass = "text-gray-900", icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[120px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-xl font-semibold mt-1 ${colorClass}`}>{value}</p>
        </div>
        {icon}
      </div>
      {note ? (
        <p className="text-sm text-green-600 mt-3">{note}</p>
      ) : (
        <div className="mt-3" />
      )}
    </div>
  );
};

export default StatCard;


