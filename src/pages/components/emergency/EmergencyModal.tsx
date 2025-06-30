import React, { useState } from "react";

const EmergencyModal = () => {
  const [form, setForm] = useState({ gender: "male" });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <select
      name="gender"
      value={form.gender}
      onChange={handleChange}
      required
      className="..."
    >
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  );
};

export default EmergencyModal; 