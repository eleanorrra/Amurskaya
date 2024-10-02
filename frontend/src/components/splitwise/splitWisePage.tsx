import React, {useEffect, useState} from "react";
import "./splitWisePage.css";
import Modal from 'react-modal';
import Select from "react-select";
import axios from "axios";
import {useParams} from "react-router-dom";
import "./splitWisePage.css";

interface SplitViseResponse {
  splitVise: SplitVise;
  splitViseItems: SplitViseItem[];
  splitViseStatistic: SplitViseStatistic[];
}

interface SplitVise {
  id: number;
  name: string;
}

interface SplitViseItem {
  id: number;
  name: string;
  userPayedId: number;
  price: number;
}

interface SplitViseStatistic {
  userFrom: Contact;
  userTo: Contact;
  debt: number;
}

interface Contact {
  userId: number;
  name: string;
}

interface Balance {
  id: number;
  userIdFrom: number;
  userIdTo: number;
  debt: number;
}

const API_BASE_URL = 'http://localhost:1234/api/split-vise';
const API_USER_URL = 'http://localhost:1234/api/user';
const API_CONTACTS_BASE_URL = 'http://localhost:1234/api/contacts'

const SplitWisePage: React.FC<{ userId: number }> = ({userId}) => {
  const {id} = useParams<{ id: string }>();
  const [splitWiseList, setSplitWiseList] = useState<SplitViseResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newItemName, setNewItemName] = useState('');
  const [buyerContactId, setBuyerContact] = useState<number>()
  const [newItemPrice, setNewItemPrice] = useState();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const [transitionFrom, setTransitionFrom] = useState<number>();
  const [transitionTo, setTransitionTo] = useState<number>();
  const [newBalancePrice, setNewBalancePrice] = useState();
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [balanceList, setBalanceList] = useState<Balance[]>([]);


  const contactOptions = contacts.map(contact => ({
    value: contact.userId,
    label: contact.name
  }));

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchSplitWise(),
        fetchContacts(),
        fetchBalance()
      ]);
    }
    fetchData();
  }, [id]);

  const fetchSplitWise = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}/user/${userId}`);
      setSplitWiseList(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке списков дел:', error);
    }
  }

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}/balance`);
      setBalanceList(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке списков дел:', error);
    }
  }

  const deleteSplitWiseItem = async (itemId: number, id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}/item/${itemId}`);
      fetchSplitWise();
    } catch (error) {
      console.error('Ошибка при удалении splitwise:', error);
    }
  }

  const deleteBalance = async (balanceId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/balance/${balanceId}`);
      fetchSplitWise();
    } catch (error) {
      console.error('Ошибка при удалении splitwise:', error);
    }
  }

  const createSplitWiseItem = async () => {
    try {
      // @ts-ignore
      const userIds: number[] = Array.from(new Set([...selectedContacts.map(contact => contact.value), userId]));
      await axios.post(`${API_BASE_URL}/item`, {
        splitViseItem: {
          name: newItemName,
          splitViseId: id,
          price: newItemPrice,
          userPayedId: buyerContactId.value,
        }, userIds: userIds
      });
      setIsModalOpen(false);
      setNewItemName('');
      fetchSplitWise()
    } catch (error) {
      console.error('Ошибка при создании списка дел:', error);
    }
  };

  const createBalance = async () => {
    try {
      // @ts-ignore
      await axios.post(`${API_BASE_URL}/${id}/balance`,
        {
          splitViseId: id,
          userIdFrom:  transitionTo.value,
          userIdTo:transitionFrom.value,
          debt: newBalancePrice,
        }
      );
      setIsBalanceModalOpen(false);
      fetchSplitWise()
    } catch (error) {
      console.error('Ошибка при создании списка дел:', error);
    }
  }

  const fetchContacts = async () => {
    const response = await axios.get<Contact[]>(`${API_CONTACTS_BASE_URL}/user/${userId}`);
    const userInfo = await axios.get<Contact>(`${API_USER_URL}/${userId}`)
    setContacts(response.data.concat(userInfo.data));
  }

  const openAddUserModal = async () => {
    try {
      fetchContacts();
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка при загрузке контактов:', error);
    }
  };

  const openAddBalanceModal = async () => {
    try {
      fetchBalance();
      setIsBalanceModalOpen(true);
    } catch (error) {
      console.error('Ошибка при загрузке контактов:', error);
    }
  }

  if (!splitWiseList[0]) {
    return <div>Загрузка...</div>;
  }

  const items = splitWiseList[0].splitViseItems ? splitWiseList[0].splitViseItems : [];
  const stat = splitWiseList[0].splitViseStatistic ? splitWiseList[0].splitViseStatistic : [];

  console.log('Весь объект:', splitWiseList[0]);
  console.log('Ключи объекта:', Object.keys(splitWiseList[0]));

  console.log(splitWiseList[0].splitViseStatistic)
  return (
    <div className="my-splitwise-list">
      <h2>Покупки</h2>
      <ul className="split-wise-items">
        {items.map((list) => (
          <li key={list.id} className="split-wise-item">
            <span>
              Покупка от "{contacts.find(contact => contact.userId === list.userPayedId).name}" {list.name} на сумму {list.price} руб.
            </span>
            <button className="delete-button"
                    onClick={() => deleteSplitWiseItem(list.id, splitWiseList[0].splitVise.id)}>✖️
            </button>
          </li>
        ))}
      </ul>
      <button className="create-split-wise-item" onClick={openAddUserModal}>
        Добавить новую покупку
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal-split-wise"
        overlayClassName="overlay-split-wise"
      >
        <h2>Добавить новую оплату</h2>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Название"
          className="modal-input"
          required
        />
        <input
          type="number"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(e.target.value)}
          placeholder="Цена"
          className="modal-input"
          required
        />
        <Select
          name="contacts"
          options={contactOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={buyerContactId}
          onChange={setBuyerContact}
          placeholder="Выберите оплатившего"
        />
        <Select
          isMulti
          name="contacts"
          options={contactOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={selectedContacts}
          onChange={setSelectedContacts}
          placeholder="Выберите на кого разделить оплату"
        />
        <button
          onClick={createSplitWiseItem}
          className="modal-button"
          disabled={!newItemName || !newItemPrice || selectedContacts.length === 0 || !buyerContactId}
        >
          Создать
        </button>
        <button onClick={() => setIsModalOpen(false)} className="modal-button cancel">
          Отмена
        </button>
      </Modal>

<h2>Денежные переводы</h2>
<ul className="balance-transitions">
  {balanceList.map((list) => (
    <li key={list.id} className="balance-item">
      <span>
        Перевод от "{contacts.find(contact => contact.userId === list.userIdFrom).name}" до "{contacts.find(contact => contact.userId === list.userIdTo).name}" на сумму {list.debt} руб.
      </span>
      <button className="delete-button"
              onClick={() => deleteBalance(list.id)}>✖️
      </button>
    </li>
  ))}
</ul>
<button className="create-balance-item" onClick={openAddBalanceModal}>
  Добавить новый перевод
</button>

<Modal
  isOpen={isBalanceModalOpen}
  onRequestClose={() => setIsBalanceModalOpen(false)}
  className="modal-split-wise"
  overlayClassName="overlay-split-wise"
>
  <h2>Добавить новый перевод</h2>
  <input
    type="number"
    value={newBalancePrice}
    onChange={(e) => setNewBalancePrice(e.target.value)}
    placeholder="Цена"
    className="modal-input"
    required
  />
  <Select
    name="contacts"
    options={contactOptions}
    className="basic-multi-select"
    classNamePrefix="select"
    value={transitionFrom}
    onChange={setTransitionFrom}
    placeholder="Выберите того, кто перевел"
  />
  <Select
    name="contacts"
    options={contactOptions}
    className="basic-multi-select"
    classNamePrefix="select"
    value={transitionTo}
    onChange={setTransitionTo}
    placeholder="Выберите того, кому перевел"
  />
  <button
    onClick={createBalance}
    className="modal-button"
    disabled={!transitionTo || !transitionFrom || !newBalancePrice}
  >
    Создать
  </button>
  <button onClick={() => setIsBalanceModalOpen(false)} className="modal-button cancel">
    Отмена
  </button>
</Modal>

<h2>Статистика</h2>
<ul className="split-wise-statistic-items">
  {stat.map((list) => (
    <li key={list.userTo.userId} className="split-wise-item">
      <span>
        "{list.userTo.name}" должен "{list.userFrom.name}": {list.debt} руб."
      </span>
    </li>
  ))}
</ul>


</div>
);
}

export default SplitWisePage;