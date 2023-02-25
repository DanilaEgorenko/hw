import React from 'react';

import styles from '../../styles/Button.module.scss';
import { Loader } from '../Loader/Loader';
import { LoaderSize } from '../Loader/Loader';

export type ButtonProps = React.PropsWithChildren<{
  /**
   * Если true, то внутри кнопки вместе с children отображается компонент Loader
   * Также кнопка должна переходить в состояние disabled
   */
  loading?: boolean;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  loading,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${
        loading || props?.disabled ? `${styles.button_disabled}` : ''
      } ${className && styles[className]}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader className="loader-color_white" size={LoaderSize.s} />}
      {children}
    </button>
  );
};
