import React from 'react';

import styles from '../../styles/Card.module.scss';

export type CardProps = {
  /** URL изображения */
  image: string;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Подзаголовок карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  content?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
};

export const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  content,
  onClick,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={image} alt="card" />
      <div className={styles.card__text}>
        <h3>{title}</h3>
        <span>{subtitle}</span>
        <div className={styles.card__content}>{content}</div>
      </div>
    </div>
  );
};
