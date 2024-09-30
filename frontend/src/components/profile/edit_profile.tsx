import React, { useState } from 'react';
import axios from 'axios';
import './edit_profile.css'

interface UserInfo {
    userId: number;
    name: string;
    apartamentNumber: string;
    status: string;
    phone: string | null;
    telegramLogin: string | null;
    vkLogin: string | null;
}

interface EditProfileProps {
    userId: number;
    initialUserInfo: UserInfo;
    onUpdate: () => void;
}

const API_BASE_URL = 'http://localhost:1234/api/user';


const EditProfile: React.FC<EditProfileProps> = ({ userId, initialUserInfo, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(API_BASE_URL, {
                ...userInfo,
                userId: userId
            });
            toggleModal();
            onUpdate();
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя:', error);
        }
    };

    return (
      <div className="edit-profile-container">
          <button className="edit-button" onClick={toggleModal}>Редактировать данные</button>

          {isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={toggleModal}>&times;</span>
                    <h2>Редактирование данных</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="info-row">
                            <div className="label">ФИО:</div>
                            <input
                              type="text"
                              name="name"
                              value={userInfo.name}
                              onChange={handleChange}
                              className="input-field"
                            />
                        </div>
                        <div className="info-row">
                            <div className="label">Номер квартиры:</div>
                            <input
                              type="text"
                              name="apartamentNumber"
                              value={userInfo.apartamentNumber}
                              onChange={handleChange}
                              className="input-field"
                            />
                        </div>
                        <div className="info-row">
                            <div className="label">Статус:</div>
                            <input
                              type="text"
                              name="status"
                              value={userInfo.status}
                              onChange={handleChange}
                              className="input-field"
                            />
                        </div>
                        <div className="info-row">
                            <div className="label">Телефон:</div>
                            <input
                              type="text"
                              name="phone"
                              value={userInfo.phone || ''}
                              onChange={handleChange}
                              className="input-field"
                            />
                        </div>
                        <div className="info-row">
                            <div className="label">Telegram:</div>
                            <input
                              type="text"
                              name="telegramLogin"
                              value={userInfo.telegramLogin || ''}
                              onChange={handleChange}
                              className="input-field"
                            />
                        </div>
                        <div className="info-row">
                            <div className="label">ВКонтакте:</div>
                            <input
                              type="text"
                              name="vkLogin"
                              value={userInfo.vkLogin || ''}
                              onChange={handleChange}
                              className="input-field"
                            />
                        </div>
                        <button type="submit" className="save-button">Сохранить изменения</button>
                    </form>
                </div>
            </div>
          )}
      </div>
    );
}

export default EditProfile;
