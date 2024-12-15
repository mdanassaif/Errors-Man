import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

export const FeatureDetailSlider = ({ features, activeFeature }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={activeFeature}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-[500px] overflow-hidden rounded-xl"
      >
        <img 
          src={features[activeFeature].detailImage} 
          alt={features[activeFeature].title} 
          className="w-full h-full object-cover rounded-xl shadow-2xl filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
          <div className="text-white">
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-2"
            >
              {features[activeFeature].title}
            </motion.h3>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-200 text-lg"
            >
              {features[activeFeature].description}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

FeatureDetailSlider.propTypes = {
  features: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    detailImage: PropTypes.string.isRequired,
  })).isRequired,
  activeFeature: PropTypes.number.isRequired,
};

export default FeatureDetailSlider;