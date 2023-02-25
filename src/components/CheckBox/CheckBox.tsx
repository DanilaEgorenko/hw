import React from 'react';

import styles from '../../styles/CheckBox.module.scss';

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (value: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({ onChange, ...props }) => {
  return (
    <div className={styles.container__checkbox}>
      <input
        {...props}
        className={styles.checkbox}
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.checkmark}></span>
    </div>
  );
};
