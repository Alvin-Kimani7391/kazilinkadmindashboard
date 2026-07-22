const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle = '', trend }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    navy: 'bg-navy/10 text-navy',
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-navy mt-1 truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-success' : 'text-error'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg flex-shrink-0 ${colorClasses[color] || colorClasses.primary}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;