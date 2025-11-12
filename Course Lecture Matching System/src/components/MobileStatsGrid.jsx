function MobileStatsGrid({ children }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {children}
    </div>
  );
}

function MobileStatCard({ icon: Icon, title, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary-100 text-primary-600",
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    neutral: "bg-neutral-100 text-neutral-600"
  };

  return (
    <div className="card mobile-padding">
      <div className="flex items-center space-x-3">
        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-neutral-600 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-neutral-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

export { MobileStatsGrid, MobileStatCard };

