import React from 'react';

const FormInput = ({ label, name, register, type = 'text', error, ...rest }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label htmlFor={name} className="font-semibold text-gray-700 mb-1">{label}</label>}
    <input
      id={name}
      type={type}
      {...register(name)}
      {...rest}
      className={`border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg ${error ? 'border-red-400' : 'border-gray-300'}`}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error.message}</span>}
  </div>
);

export default FormInput;
