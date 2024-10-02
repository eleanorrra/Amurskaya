import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import './my_todolists.css';

interface TodoListItem {
  id: number;
  name: string;
  done: boolean;
  userId: number;
}

interface TodoList {
  id: number;
  name: string;
}

interface TodoListResponse {
  todoList: TodoList;
  todoListItems: TodoListItem[];
  done: boolean;
}

interface Contact {
  userId: number;
  name: string;
}

const API_BASE_URL = 'http://localhost:1234/api/todo-list';
const API_USER_URL = 'http://localhost:1234/api/user';
const API_CONTACTS_BASE_URL = 'http://localhost:1234/api/contacts'

const TodoListPage: React.FC<{ myUserId: number }> = ({myUserId}) => {
  const {id} = useParams<{ id: string }>();
  const [todoListData, setTodoListData] = useState<TodoListResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    fetchTodoListData();
  }, [id]);

  const fetchTodoListData = async () => {
    try {
      const response = await axios.get<TodoListResponse>(`${API_BASE_URL}/${id}`);
      const todoListResponse = response.data;

      setTodoListData(
        todoListResponse,
      );
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const toggleItemStatus = async (itemId: number, currentStatus: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/item/${itemId}/status/${!currentStatus}`);
      fetchTodoListData()
    } catch (error) {
      console.error('Ошибка при изменении статуса элемента:', error);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/item/${itemId}`);
      fetchTodoListData()
    } catch (error) {
      console.error('Ошибка при удалении элемента:', error);
    }
  };

  const openAddUserModal = async () => {
    try {
      const response = await axios.get<Contact[]>(`${API_CONTACTS_BASE_URL}/user/${myUserId}`);
      const userInfo = await axios.get<Contact>(`${API_USER_URL}/${myUserId}`);
      const allContacts = response.data.concat(userInfo.data)
      setContacts(allContacts);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка при загрузке контактов:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    //setSelectedContactId('');
    setTaskName('');
  };

  const addUserToTodoList = async (e) => {
    e.preventDefault();
    if (!selectedContactId || !taskName) {
      alert('Пожалуйста, выберите контакт и введите название задачи');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/item`, {
        userId: selectedContactId,
        name: taskName,
        todoListId: firstTodoListData.todoList.id
      });
      fetchTodoListData();
      closeModal();
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  };

  if (!todoListData) {
    return <div>Загрузка...</div>;
  }
  const firstTodoListData = todoListData[0]
  console.log(firstTodoListData)
  console.log(contacts)
  return (
    <div className="todo-list-page">
      <h1>{firstTodoListData.todoList.name}</h1>
      <ul className="todo-items">
        {firstTodoListData.todoListItems.map((item) => (
          <li key={item.id} className="todo-item">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItemStatus(item.id, item.done)}
            />
            <span className={item.done ? 'done' : ''}>
              {item.name} ({contacts.find(contact => contact.userId === item.userId).name})
            </span>
            <button onClick={() => deleteItem(item.id)} className="delete-button">✖</button>
          </li>
        ))}
      </ul>
      <button className="add-user-button" onClick={openAddUserModal}>
        Добавить задачу
      </button>


      {isModalOpen && (
        <div className="modal-todo-list">
          <div className="modal-content">
            <h2>Добавить новую задачу</h2>
            <form onSubmit={addUserToTodoList}>
              <select
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(Number(e.target.value))}
                required
                className="basic-multi-select"
                classNamePrefix="select"
              >
                <option value="">Выберите контакт</option>
                {contacts.map((contact) => (
                  <option key={contact.userId} value={contact.userId}>
                    {contact.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Название задачи"
                className="modal-input"
                required
              />
              <button type="submit" disabled={!selectedContactId || !taskName} className='modal-button'>
                Добавить
              </button>
              <button type="button" onClick={closeModal} className='modal-button cancel'>
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoListPage;