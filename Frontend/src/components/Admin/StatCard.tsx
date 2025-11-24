import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  note?: string;
  colorClass?: string;
  icon?: ReactNode;
}

const StatCard = ({
  title,
  value,
  note,
  colorClass = "text-gray-900",
  icon,
}: StatCardProps) => {
  return (
    <div className="flex min-h-[120px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`mt-1 text-xl font-semibold ${colorClass}`}>{value}</p>
        </div>
        {icon}
      </div>
      {note ? (
        <p className="mt-3 text-sm text-green-600">{note}</p>
      ) : (
        <div className="mt-3" />
      )}
    </div>
  );
};

export default StatCard;
