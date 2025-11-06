interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
}

const StatsCard = ({
  title,
  value,
  change,
  changeType,
  icon,
}: StatsCardProps) => {
  return (
    <div className="border-dashboard-gray-border relative min-h-[159px] rounded-[20px] border-2 bg-white p-[17px_22px_19px]">
      <h3 className="mb-[20px] max-w-[190px] text-base leading-[18px] font-normal text-black">
        {title}
      </h3>

      <p className="mb-[15px] text-base leading-[10px] font-bold text-black">
        {value}
      </p>

      <p
        className={`text-base leading-[10px] font-medium ${
          changeType === "positive" ? "text-[green]" : "text-[red]"
        }`}
      >
        {change}
      </p>

      <div className="absolute right-[20px] bottom-[61px]">{icon}</div>
    </div>
  );
};
export default StatsCard;
