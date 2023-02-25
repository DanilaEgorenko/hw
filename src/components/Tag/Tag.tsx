import styles from '../../styles/Tag.module.scss';

export interface ITag {
  title: string;
}

export const Tag: React.FC<ITag> = ({ title }) => {
  return <div className={styles.tag}>{title}</div>;
};
