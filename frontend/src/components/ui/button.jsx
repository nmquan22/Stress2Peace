// src/components/ui/button.jsx
const Button = ({ children, onClick, className }) => (
    <button
      onClick={onClick}
      className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
  
  export { Button };
  