import React, { FC, useState } from 'react';
import './main.css';

const MainPage: FC = () => {
  const [isContactVisible, setContactVisible] = useState(false);

  const toggleContactVisibility = () => {
    setContactVisible(!isContactVisible);
  };

  return (
    <main className="main-container">
      <div className="content">
        <h1>Новости ЖК Level Amurskaya</h1>
        <Home />
      </div>

      {/* Circular Button for Contacts */}
      <button className="contact-button" onClick={toggleContactVisibility}>
        📞
      </button>

      {/* Fixed Contact Window */}
      {isContactVisible && (
        <aside className="contact-window">
          <h3>Контакты менеджеров</h3>
          <ul>
            <li>Скворцова Наталия</li>
                <p>Телефон: +7-495-772-9590 доб.15348</p>
            <li>Тельчарова Анастасия </li>
                <p>Телефон: +7-495-772-9590, доб.28387</p>
          </ul>
          <h3>Контакты студсовета</h3>
          <ul>
            <li><a href="https://vk.com/studsovetamurskaya" target="_blank" rel="noopener noreferrer">Группа Вконтакте</a></li>
            <li><a href="https://t.me/studsovetamurskaya " target="_blank" rel="noopener noreferrer">Канал в Телеграм</a></li>
          </ul>
          <button className="close-button" onClick={toggleContactVisibility}>
            Закрыть
          </button>
        </aside>
      )}
    </main>
  );
};

interface NewsItem {
  title: string;
  date: string;
  image: string;
  description: string;
}

const Home: React.FC = () => {
  const newsItems: NewsItem[]= [
    {
        title: "Выбор студсовета",
        date: "15 октября 2024",
        image: "https://sun9-1.userapi.com/impg/WdkyrMbruncxLIdOcKccfI78DM2Oq4RnakyfvA/kic_42ijqrY.jpg?size=1280x1280&quality=95&sign=ac25f561e9f8ce51333972aea32a2094&type=album",
        description: "Присоединяйтесь к нам на выборах студенческого совета! Ваш голос важен для будущего нашего общежития."
    },
    {
        title: "Квартирник на 22 этаже",
        date: "20 октября 2024 19:00",
        image: "https://cdn-icons-png.flaticon.com/512/195/195168.png",
        description: "Приглашаем всех на квартирник в квартире 523! Отличная музыка, приятная компания и уютная атмосфера."
    },
    {
        title: "Вечер настолок",
        date: "25 октября 2024 20:00",
        image: "https://cdn-icons-png.flaticon.com/512/9435/9435770.png",
        description: "Собираемся в квартире 463 на 16 этаже на вечер настольных игр! Принесите свои любимые игры и хорошее настроение."
    },
    {
        title: "Расписание игр в волейбол",
        date: "Каждую среду",
        image: "https://cdn.mskguru.ru/uploads/comment/f8da697d71e813da529599574c51253387253.jpg",
        description: "Не пропустите еженедельные игры в волейбол во дворе нашего общежития!"
    },
    {
        title: "Открытие нового салона",
        date: "29 сентября 2024",
        image: "https://avatars.mds.yandex.net/get-altay/5098734/2a00000181aff077eb153c6f25a9de2742ab/orig",
        description: "В ЖК открылся новый маникюрный салон \"Level Nails\"! На первое посещение 20% скидка."
    },
    {
        title: "Футбольный турнир",
        date: "5 октября 2024",
        image: "https://cdn-icons-png.flaticon.com/512/1800/1800944.png",
        description: "Приглашаем всех на футбольный турнир во дворе!"
    },
    {
        title: "Баскетбольные игры",
        date: "Каждую пятницу в 16:00",
        image: "https://cdn.mskguru.ru/uploads/comment/c5b54defae91b5b7adf59184a359b0c7131676.jpg",
        description: "Каждую пятницу — баскетбольные игры во дворе!"
    },
    {
        title: "Вечер кино",
        date: "5 ноября 2024 22:00",
        image: "https://e7.pngegg.com/pngimages/84/530/png-clipart-film-clapperboard-computer-icons-cinema-shows-miscellaneous-angle.png",
        description: "Приглашаем всех на вечер кино на 27 этаж в 572 квартиру, приносите с собой попкорн и другие снэки!"
    },
    {
        title: "Открытие коворкинга для студентов ВШЭ в ЖК",
        date: "12 ноября 2024",
        image: "https://sun9-6.userapi.com/impg/0VTx5_KbgMMkY3QzJKYdqxfzMR_lmr-wDD0sPg/73HjB2CDFyI.jpg?size=1142x761&quality=96&sign=a800c27a31366bb6a41f53c876d3ab9d&type=album",
        description: "Скоро не нужно будет надевать наушники, чтобы никто не мешал во время учебы, появится возможность уйти от шумных соседей в новый коворкинг!"
    }
  ];

    return (
      <div className="news-container">
          {newsItems.map((item, index) => (
              <div className="news-item" key={index}>
                  <h3>{item.title}</h3>
                  <img src={item.image} alt={item.title} />
                  <p><strong>Дата:</strong> {item.date}</p>
                  <p>{item.description}</p>
              </div>
          ))}
      </div>
    );
};

export default MainPage;