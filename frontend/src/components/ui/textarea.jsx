// src/components/ui/textarea.jsx
const Textarea = ({ rows, placeholder, value, onChange }) => (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
  
  export { Textarea };
  