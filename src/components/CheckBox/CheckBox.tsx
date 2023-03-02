import React, { useCallback } from 'react';

import styles from './CheckBox.module.scss';

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (value: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = React.memo(
  ({ onChange, ...props }) => {
    const listener = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
      [onChange]
    );
    return (
      <div className={styles.container__checkbox}>
        <input
          {...props}
          className={styles.checkbox}
          type="checkbox"
          onChange={listener}
        />
        <span className={styles.checkmark}></span>
      </div>
    );
  }
);
