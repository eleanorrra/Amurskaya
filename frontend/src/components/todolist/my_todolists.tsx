// @ts-ignore
import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './MyTodoLists.css';

interface TodoList {
  id: number;
  name: string;
}

const API_BASE_URL = 'http://localhost:1234/api/todo-list';

const MyToDoLists: React.FC<{ userId: number }> = ({userId}) => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const fetchTodoLists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      setTodoLists(response.data.map((item: any) => item.todoList));
    } catch (error) {
      console.error('Ошибка при загрузке списков дел:', error);
    }
  };

  const deleteTodoList = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchTodoLists();
    } catch (error) {
      console.error('Ошибка при удалении списка дел:', error);
    }
  };

  const createTodoList = async () => {
    try {
      await axios.post(`${API_BASE_URL}`, {name: newListName, userId: userId});
      setIsModalOpen(false);
      setNewListName('');
      fetchTodoLists();
    } catch (error) {
      console.error('Ошибка при создании списка дел:', error);
    }
  };

  return (
    <div className="my-todo-lists">
      <h2>Мои списки дел</h2>
      <ul className="todo-list">
        {todoLists.map((list) => (
          <li key={list.id} className="todo-item">
            <NavLink to={`/todo-list/${list.id}`} className="list-link">
              {list.name}
            </NavLink>
            <button className="delete-button" onClick={() => deleteTodoList(list.id)}>✖</button>
          </li>
        ))}
      </ul>
      <button className="create-list" onClick={() => setIsModalOpen(true)}>
        Создать новый список
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-todo-list"
        overlayClassName="overlay-todo-list"
      >
        <h2>Создать новый список дел</h2>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Название списка"
          className="modal-input"
        />
        <button onClick={createTodoList} className="modal-button">
          Создать
        </button>
        <button onClick={() => setIsModalOpen(false)} className="modal-button cancel">
          Отмена
        </button>
      </Modal>
    </div>
  );
}

export default MyToDoLists;
