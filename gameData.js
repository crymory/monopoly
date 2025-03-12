// Игровые данные
const gameState = {
    players: [
        { id: 1, name: "Игрок 1", money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 },
        { id: 2, name: "Игрок 2", money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 }
    ],
    currentPlayer: 0,
    dice: [1, 1],
    hasRolled: false,
    gameOver: false
};

// Игровые ячейки
const boardCells = [
    { id: 0, name: "Старт", type: "start", action: "collect", amount: 200 },
    { id: 1, name: "ул. Тверская", type: "property", price: 60, rent: 2, color: "var(--property-color1)", owner: null },
    { id: 2, name: "Общественная казна", type: "chest", action: "draw" },
    { id: 3, name: "ул. Арбат", type: "property", price: 60, rent: 4, color: "var(--property-color1)", owner: null },
    { id: 4, name: "Налог на доход", type: "tax", amount: 200 },
    { id: 5, name: "Ленинградский вокзал", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 6, name: "ул. Пятницкая", type: "property", price: 100, rent: 6, color: "var(--property-color2)", owner: null },
    { id: 7, name: "Шанс", type: "chance", action: "draw" },
    { id: 8, name: "ул. Пушкинская", type: "property", price: 100, rent: 6, color: "var(--property-color2)", owner: null },
    { id: 9, name: "Кутузовский проспект", type: "property", price: 120, rent: 8, color: "var(--property-color2)", owner: null },
    { id: 10, name: "Тюрьма (Посетитель)", type: "jail", action: "visit" },
    { id: 11, name: "ул. Таганская", type: "property", price: 140, rent: 10, color: "var(--property-color3)", owner: null },
    { id: 12, name: "Электростанция", type: "utility", price: 150, rent: 10, owner: null },
    { id: 13, name: "ул. Сретенка", type: "property", price: 140, rent: 10, color: "var(--property-color3)", owner: null },
    { id: 14, name: "ул. Покровка", type: "property", price: 160, rent: 12, color: "var(--property-color3)", owner: null },
    { id: 15, name: "Казанский вокзал", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 16, name: "Садовое кольцо", type: "property", price: 180, rent: 14, color: "var(--property-color4)", owner: null },
    { id: 17, name: "Общественная казна", type: "chest", action: "draw" },
    { id: 18, name: "Проспект Мира", type: "property", price: 180, rent: 14, color: "var(--property-color4)", owner: null },
    { id: 19, name: "Ленинский проспект", type: "property", price: 200, rent: 16, color: "var(--property-color4)", owner: null },
    { id: 20, name: "Бесплатная стоянка", type: "parking", action: "free" },
    { id: 21, name: "Новый Арбат", type: "property", price: 220, rent: 18, color: "var(--property-color5)", owner: null },
    { id: 22, name: "Шанс", type: "chance", action: "draw" },
    { id: 23, name: "ул. Тверская-Ямская", type: "property", price: 220, rent: 18, color: "var(--property-color5)", owner: null },
    { id: 24, name: "Лубянка", type: "property", price: 240, rent: 20, color: "var(--property-color5)", owner: null },
    { id: 25, name: "Ярославский вокзал", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 26, name: "ул. Маяковского", type: "property", price: 260, rent: 22, color: "var(--property-color6)", owner: null },
    { id: 27, name: "ул. Грузинская", type: "property", price: 260, rent: 22, color: "var(--property-color6)", owner: null },
    { id: 28, name: "Водопроводная компания", type: "utility", price: 150, rent: 10, owner: null },
    { id: 29, name: "Смоленская площадь", type: "property", price: 280, rent: 24, color: "var(--property-color6)", owner: null },
    { id: 30, name: "Идите в тюрьму", type: "gotojail", action: "goto", destination: 10 },
    { id: 31, name: "Кремлевская наб.", type: "property", price: 300, rent: 26, color: "var(--property-color7)", owner: null },
    { id: 32, name: "ул. Остоженка", type: "property", price: 300, rent: 26, color: "var(--property-color7)", owner: null },
    { id: 33, name: "Общественная казна", type: "chest", action: "draw" },
    { id: 34, name: "ул. Рублевка", type: "property", price: 320, rent: 28, color: "var(--property-color7)", owner: null },
    { id: 35, name: "Киевский вокзал", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 36, name: "Шанс", type: "chance", action: "draw" },
    { id: 37, name: "Красная площадь", type: "property", price: 350, rent: 35, color: "var(--property-color8)", owner: null },
    { id: 38, name: "Налог на роскошь", type: "tax", amount: 100 },
    { id: 39, name: "ул. Тверская-2", type: "property", price: 400, rent: 50, color: "var(--property-color8)", owner: null }
];

// Карты шанса
const chanceCards = [
    { text: "Переместитесь на старт", action: "move", destination: 0 },
    { text: "Банк выплачивает вам дивиденды в размере ₽50", action: "collect", amount: 50 },
    { text: "Штраф за превышение скорости ₽15", action: "pay", amount: 15 },
    { text: "Вы выиграли в лотерею! Получите ₽100", action: "collect", amount: 100 },
    { text: "Идите в тюрьму", action: "goto", destination: 10 },
    { text: "Продвиньтесь на 3 клетки вперед", action: "forward", steps: 3 },
    { text: "Отремонтируйте свои владения. Заплатите ₽25", action: "pay", amount: 25 },
    { text: "Вы были избраны председателем совета. Заплатите каждому игроку ₽50", action: "payall", amount: 50 },
    { text: "Переместитесь на Красную площадь", action: "move", destination: 37 },
    { text: "Вы получаете освобождение из тюрьмы", action: "getoutofjail" }
];

// Карты общественной казны
const chestCards = [
    { text: "Возврат налога. Получите ₽20", action: "collect", amount: 20 },
    { text: "Ошибка банка в вашу пользу. Получите ₽200", action: "collect", amount: 200 },
    { text: "Оплатите лечение ₽100", action: "pay", amount: 100 },
    { text: "Оплатите страховку ₽50", action: "pay", amount: 50 },
    { text: "День рождения! Получите ₽10 от каждого игрока", action: "collectall", amount: 10 },
    { text: "Переместитесь на старт", action: "move", destination: 0 },
    { text: "Наследство! Получите ₽100", action: "collect", amount: 100 },
    { text: "Идите в тюрьму", action: "goto", destination: 10 },
    { text: "Выплатите налог на недвижимость ₽40", action: "pay", amount: 40 },
    { text: "Вы получаете освобождение из тюрьмы", action: "getoutofjail" }
];

// Экспорт данных для использования в других файлах
export { gameState, boardCells, chanceCards, chestCards };
