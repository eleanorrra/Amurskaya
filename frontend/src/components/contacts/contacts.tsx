import axios from 'axios';
import {useEffect, useState} from "react";
import './contacts.css';

// Константа с адресом бэкенда
const API_BASE_URL = 'http://localhost:1234/api/contacts';

// DTO для контакта
interface ContactDTO {
  userId: number;
  name: string;
  apartamentNumber: string;
  status: string;
  phone?: string;
  telegramLogin?: string;
  vkLogin?: string;
}

const Contacts: React.FC<{ userId: number }> = ({userId}) => {
  const [contacts, setContacts] = useState<ContactDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContactId, setNewContactId] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    fetchContacts();
  }, [updateTrigger]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get<ContactDTO[]>(`${API_BASE_URL}/user/${userId}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке контактов:', error);
    }
  };

  const deleteContact = async (contactId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${contactId}/user/${userId}`);
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Ошибка при удалении контакта:', error);
    }
  };

  const addContact = async () => {
    if (!newContactId) return;

    try {
      await axios.post(`${API_BASE_URL}/${newContactId}/user/${userId}`);
      setIsModalOpen(false);
      setNewContactId('');
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Ошибка при добавлении контакта:', error);
    }
  };

  return (
    <div className="contactscontainer">
      <h2>Контакты соседей</h2>
      {contacts.map((contact) => (
        <div key={contact.userId} className="neighbor">
          <div className="circle"></div>
          <div className="info">
            <h3>{contact.name}</h3>
            <p>Квартира: {contact.apartamentNumber}</p>
            <p>Статус: {contact.status}</p>
            {contact.phone && <p>Телефон: {contact.phone}</p>}
            {contact.telegramLogin && <p>Telegram: @{contact.telegramLogin}</p>}
            {contact.vkLogin && <p>ВКонтакте: vk.com/{contact.vkLogin}</p>}
          </div>
          <button className="delete-button" onClick={() => deleteContact(contact.userId)}>✖</button>
        </div>
      ))}
      <button className="add-contact" onClick={() => setIsModalOpen(true)}>Добавить контакт</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Добавить новый контакт</h3>
            <input
              type="number"
              value={newContactId}
              onChange={(e) => setNewContactId(e.target.value)}
              placeholder="Введите ID контакта"
            />
            <button onClick={addContact} className="modal-button">Добавить</button>
            <button onClick={() => setIsModalOpen(false)} className="modal-button cancel">Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
