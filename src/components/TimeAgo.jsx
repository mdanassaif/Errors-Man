import PropTypes from 'prop-types';


// simple logic but workable : )
export function TimeAgo({ date }) {
    const getTimeAgo = (date) => {
      const timeIntervals = [
        { seconds: 31536000, label: 'year' },
        { seconds: 2592000, label: 'month' },
        { seconds: 86400, label: 'day' },
        { seconds: 3600, label: 'hour' },
        { seconds: 60, label: 'minute' },
        { seconds: 1, label: 'second' }
      ];
  
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
      for (const { seconds: intervalSeconds, label } of timeIntervals) {
        const interval = Math.floor(seconds / intervalSeconds);
        if (interval >= 1) {
          return `${interval} ${label}${interval !== 1 ? 's' : ''} ago`;
        }
      }
  
      return 'just now';
    };
  
    return (
      <span title={new Date(date).toLocaleString()} className="text-sm text-gray-500">
        {getTimeAgo(date)}
      </span>
    );
  }
  
  TimeAgo.propTypes = {
    date: PropTypes.string.isRequired,
  };