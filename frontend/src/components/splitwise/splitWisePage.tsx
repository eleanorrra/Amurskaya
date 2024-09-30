import React from "react";
import "./splitWisePage.css";

const SplitWisePage: React.FC<{ myUserId: number }> = ({myUserId}) => {
    const [items, setItems] = useState<Item[]>([]);
    const [totalOwe, setTotalOwe] = useState(0);
    const [totalOwed, setTotalOwed] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCost, setNewItemCost] = useState<number | ''>('');
    const [selectedPerson, setSelectedPerson] = useState('');
    
    const contacts = ['Alice', 'Bob', 'Charlie']; // Example contacts

    const addItem = () => {
        if (newItemName && newItemCost) {
            const newItem: Item = { name: newItemName, cost: Number(newItemCost) };
            setItems([...items, newItem]);
            setTotalOwe(totalOwe + newItem.cost); // Update total owed
            setNewItemName('');
            setNewItemCost('');
            setModalVisible(false);
        }
    };

    const removeItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        // Update total owed
        const removedCost = items[index].cost;
        setTotalOwe(totalOwe - removedCost);
    };

    return (
        <div className="splitwise-container">
            <h1>Splitwise</h1>
            <div className="fixed-window">
                <p><strong>Сколько я должна:</strong> {totalOwe} ₽</p>
                <p><strong>Сколько должны мне:</strong> {totalOwed} ₽</p>
            </div>
            <ul className="item-list">
                {items.map((item, index) => (
                    <li key={index} className="item">
                        <span>{item.name}</span>
                        <span>{item.cost} ₽</span>
                        <button className="delete-button" onClick={() => removeItem(index)}>Удалить</button>
                    </li>
                ))}
            </ul>
            <button className="add-item-button" onClick={() => setModalVisible(true)}>Добавить покупку</button>

            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Добавить покупку</h2>
                        <input 
                            type="text" 
                            placeholder="Название" 
                            value={newItemName} 
                            onChange={(e) => setNewItemName(e.target.value)} 
                        />
                        <input 
                            type="number" 
                            placeholder="Стоимость" 
                            value={newItemCost} 
                            onChange={(e) => setNewItemCost(e.target.value)} 
                        />
                        <select value={selectedPerson} onChange={(e) => setSelectedPerson(e.target.value)}>
                            <option value="">Выберите на кого рассчитать стоимость</option>
                            {contacts.map((contact, index) => (
                                <option key={index} value={contact}>{contact}</option>
                            ))}
                        </select>
                        <div className="modal-buttons">
                            <button className="add-button" onClick={addItem}>Добавить</button>
                            <button className="cancel-button" onClick={() => setModalVisible(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SplitWisePage;
