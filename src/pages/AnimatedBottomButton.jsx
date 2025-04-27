import { motion, AnimatePresence } from 'framer-motion';

const AnimatedBottomButton = ({ visible, text, onClick }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            bottom: '10px',
            // left: '50%',
            // transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '400px',
            backgroundColor: '#0088cc',
            color: '#ffffff',
            textAlign: 'center',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            cursor: 'pointer',
          }}
          onClick={onClick}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedBottomButton;