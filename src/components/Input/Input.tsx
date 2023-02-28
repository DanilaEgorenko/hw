import React, { useEffect, useState } from 'react';

import styles from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
};

export const Input: React.FC<InputProps> = ({ value, onChange, ...props }) => {
  const [val, setVal] = useState('');
  useEffect(() => {
    setVal(value);
  }, [value]);
  return (
    <input
      {...props}
      className={`${styles.input} ${
        props?.className && styles[props?.className]
      }`}
      type="text"
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
        return onChange(e.target.value);
      }}
    />
  );
};
