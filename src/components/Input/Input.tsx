import React from 'react';

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
  const handleChange = React.useCallback(
    (e: string) => {
      onChange(e);
    },
    [onChange]
  );
  return (
    <input
      {...props}
      className={`${styles.input} ${
        props?.className && styles[props?.className]
      }`}
      type="text"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};
