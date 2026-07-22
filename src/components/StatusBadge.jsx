const StatusBadge = ({ status, type = 'default' }) => {
  const getStyles = () => {
    const styles = {
      // User statuses
      verified: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      rejected: 'bg-error/10 text-error',
      inactive: 'bg-gray-100 text-gray-500',
      
      // Job statuses
      open: 'bg-info/10 text-info',
      in_progress: 'bg-primary/10 text-primary',
      completed: 'bg-success/10 text-success',
      cancelled: 'bg-error/10 text-error',
      
      // Payment statuses
      processing: 'bg-warning/10 text-warning',
      
      // Urgency levels
      high: 'bg-error/10 text-error',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-info/10 text-info',
    };
    return styles[status] || 'bg-gray-100 text-gray-500';
  };

  const getLabel = () => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;