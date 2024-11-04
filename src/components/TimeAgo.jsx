import PropTypes from 'prop-types';

export function TimeAgo({ date }) {
    const getTimeAgo = (date) => {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + ' years ago';
      
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + ' months ago';
      
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + ' days ago';
      
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + ' hours ago';
      
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + ' minutes ago';
      
      return Math.floor(seconds) + ' seconds ago';
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