import React, { useMemo, useState } from 'react';

import { Option } from '@entities/multiDropdown/client';

import styles from './MultiDropdown.module.scss';

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Преобразовать выбранные значения в строку. Отображается в дропдауне в качестве выбранного значения */
  pluralizeOptions: (value: Option[]) => string;
  className?: string;
};

export const MultiDropdown: React.FC<MultiDropdownProps> = React.memo(
  ({ options, value, onChange, disabled, pluralizeOptions, className }) => {
    const optState = useMemo(
      () =>
        options.map((option) => {
          option.checked = value.some((o) => o.key === option.key);
          return option;
        }),
      [options, value]
    );
    const [optionsState, setOptionsState] = useState<Option[]>(optState);
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div
        className={`${styles['multi-dropdown']} ${
          className && styles[className]
        }`}
      >
        <button
          className={styles.title}
          disabled={disabled && !value.length}
          onClick={() => setIsOpen(!isOpen)}
        >
          {pluralizeOptions(value)}
        </button>
        {!disabled && isOpen && (
          <ul className={styles.ul}>
            {optionsState.map(({ key, value, checked }) => {
              return (
                <li key={key} className={styles.li}>
                  <button
                    className={checked ? styles.checked : ''}
                    onClick={(e) => {
                      const arr = optionsState.map((el: Option) => {
                        if (el.key === key) {
                          el.checked = !el.checked;
                        }
                        return el;
                      });
                      setOptionsState(arr);
                      onChange(arr.filter((el) => el.checked));
                    }}
                  >
                    {value}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);
