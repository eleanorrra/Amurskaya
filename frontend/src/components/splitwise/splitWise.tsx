// @ts-ignore
import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select'
import './splitWise.css';

interface SplitViseResponse {
  splitVise: SplitVise;
}

interface SplitVise {
  id: number;
  name: string;
}

interface Contact {
  userId: number;
  name: string;
}

const API_BASE_URL = 'http://localhost:1234/api/split-vise';
const API_CONTACTS_BASE_URL = 'http://localhost:1234/api/contacts'

const SplitWise: React.FC<{ userId: number }> = ({userId}) => {
  const [splitWiseList, setTodoLists] = useState<SplitViseResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const contactOptions = contacts.map(contact => ({
    value: contact.userId,
    label: contact.name
  }));

  useEffect(() => {
    fetchSplitWise();
  }, []);

  const fetchSplitWise = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      setTodoLists(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке списков дел:', error);
    }
  }

  const deleteSplitWise = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchSplitWise();
    } catch (error) {
      console.error('Ошибка при удалении splitwise:', error);
    }
  }

  const createSplitWise = async () => {
    try {
      // @ts-ignore
      const userIds = [...selectedContacts.map(contact => contact.value), userId];
      await axios.post(`${API_BASE_URL}`, {splitVise: {name: newListName}, userIds: userIds});
      setIsModalOpen(false);
      setNewListName('');
      fetchSplitWise()
    } catch (error) {
      console.error('Ошибка при создании списка дел:', error);
    }
  };

  const openAddUserModal = async () => {
    try {
      const response = await axios.get<Contact[]>(`${API_CONTACTS_BASE_URL}/user/${userId}`);
      setContacts(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка при загрузке контактов:', error);
    }
  };


  return (
    <div className="my-splitwise-list">
      <h2>Мои splitWise</h2>
      <ul className="split-wise">
        {splitWiseList.map((list) => (
          <li key={list.splitVise.id} className="split-wise-item">
            <NavLink to={`/split-wise/${list.splitVise.id}`} className="list-link">
              {list.splitVise.name}
            </NavLink>
            <button className="delete-button" onClick={() => deleteSplitWise(list.splitVise.id)}>✖</button>
          </li>
        ))}
      </ul>
      <button className="create-split-wise" onClick={openAddUserModal}>
        Создать новый splitWise
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-split-wise"
        overlayClassName="overlay-split-wise"
      >
        <h2>Создать новый SplitWise</h2>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Название splitWise"
          className="modal-input"
        />
        <Select
          isMulti
          name="contacts"
          options={contactOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={selectedContacts}
          onChange={setSelectedContacts}
          placeholder="Выберите участников"
        />
        <button
          onClick={createSplitWise}
          className="modal-button"
          disabled={!newListName || selectedContacts.length === 0}
        >
          Создать
        </button>
        <button onClick={() => setIsModalOpen(false)} className="modal-button cancel">
          Отмена
        </button>
      </Modal>
    </div>
  );
}

export default SplitWise;
