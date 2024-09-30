import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css'
// @ts-ignore
import EditProfile from "./edit_profile.tsx";

interface UserInfo {
    userId: number;
    name: string;
    apartamentNumber: string;
    status: string;
    phone: string | null;
    telegramLogin: string | null;
    vkLogin: string | null;   
}

const API_BASE_URL = 'http://localhost:1234/api/user';

const Profile: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserInfo = async () => {
        const id = 123
        setIsLoading(true);
        try {
            const response = await axios.get<UserInfo>(`${API_BASE_URL}/${id}`);
            setUserInfo(response.data);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке данных пользователя');
            console.error('Ошибка при загрузке данных пользователя:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!userInfo) return <div>Информация о пользователе не найдена</div>;

    return (
      <div className="profile-container">
          <h2>Личный кабинет</h2>
          <div className="user-info">
              <div className="info-row">
                  <div className="label">ФИО:</div>
                  <div>{userInfo.name}</div>
              </div>
              <div className="info-row">
                  <div className="label">Номер квартиры:</div>
                  <div>{userInfo.apartamentNumber}</div>
              </div>
              <div className="info-row">
                  <div className="label">Статус:</div>
                  <div>{userInfo.status}</div>
              </div>
              <div className="info-row">
                  <div className="label">Телефон:</div>
                  <div>{userInfo.phone || 'Не указан'}</div>
              </div>
              <div className="info-row">
                  <div className="label">Telegram:</div>
                  <div>{userInfo.telegramLogin || 'Не указан'}</div>
              </div>
              <div className="info-row">
                  <div className="label">ВКонтакте:</div>
                  <div>{userInfo.vkLogin || 'Не указан'}</div>
              </div>
          </div>
          <EditProfile
            userId={userInfo.userId}
            initialUserInfo={userInfo}
            onUpdate={fetchUserInfo}
          />
      </div>
    );
};

export default Profile;
