import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// @ts-ignore
import styles from './header.module.css';

const Header: React.FC = () => {
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);

  const toggleNotifications = () => {
    setNotificationsVisible(!isNotificationsVisible);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Главная
        </NavLink>
        <NavLink
          to="/contacts"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Мои контакты
        </NavLink>
        <NavLink
          to="/todo-list"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Список дел
        </NavLink>
        <NavLink
          to="/split-wise"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Splitwise
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Личный кабинет
        </NavLink>
        
        {/* Notification Button */}
        <button className={styles.notificationButton} onClick={toggleNotifications}>
          🔔
        </button>

        {/* Notifications Window */}
        {isNotificationsVisible && (
          <div className={styles.notificationsWindow}>
            <h4>Уведомления</h4>
            <div className={styles.notificationItem}>
              <span>Оплата за коммунальные услуги</span><br />
              <span className={styles.notificationDate}>Дата: 17.10.24</span>
            </div>
            <div className={styles.notificationItem}>
              <span>Оплата за проживание</span><br />
              <span className={styles.notificationDate}>Дата: 25.10.24</span>
            </div>
            <button className={styles.closeButton} onClick={toggleNotifications}>Закрыть</button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;