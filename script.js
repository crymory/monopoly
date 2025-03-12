// Переменная для хранения выбранного игрока (1 или 2)
let selectedPlayer = null;

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

// Игровые ячейки с брендами и компаниями вместо улиц
const boardCells = [
    { id: 0, name: "Старт", type: "start", action: "collect", amount: 200 },
    { id: 1, name: "Магнит", type: "property", price: 60, rent: 2, color: "var(--property-color1)", owner: null },
    { id: 2, name: "Общественная казна", type: "chest", action: "draw" },
    { id: 3, name: "Черкизово", type: "property", price: 60, rent: 4, color: "var(--property-color1)", owner: null },
    { id: 4, name: "Налог на доход", type: "tax", amount: 200 },
    { id: 5, name: "Яндекс", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 6, name: "Microsoft", type: "property", price: 100, rent: 6, color: "var(--property-color2)", owner: null },
    { id: 7, name: "Шанс", type: "chance", action: "draw" },
    { id: 8, name: "Google", type: "property", price: 100, rent: 6, color: "var(--property-color2)", owner: null },
    { id: 9, name: "Amazon", type: "property", price: 120, rent: 8, color: "var(--property-color2)", owner: null },
    { id: 10, name: "Тюрьма (Посетитель)", type: "jail", action: "visit" },
    { id: 11, name: "L'Oréal", type: "property", price: 140, rent: 10, color: "var(--property-color3)", owner: null },
    { id: 12, name: "Газпром", type: "utility", price: 150, rent: 10, owner: null },
    { id: 13, name: "Adidas", type: "property", price: 140, rent: 10, color: "var(--property-color3)", owner: null },
    { id: 14, name: "Nike", type: "property", price: 160, rent: 12, color: "var(--property-color3)", owner: null },
    { id: 15, name: "Сбербанк", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 16, name: "BMW", type: "property", price: 180, rent: 14, color: "var(--property-color4)", owner: null },
    { id: 17, name: "Общественная казна", type: "chest", action: "draw" },
    { id: 18, name: "Mercedes", type: "property", price: 180, rent: 14, color: "var(--property-color4)", owner: null },
    { id: 19, name: "Tesla", type: "property", price: 200, rent: 16, color: "var(--property-color4)", owner: null },
    { id: 20, name: "Бесплатная стоянка", type: "parking", action: "free" },
    { id: 21, name: "Coca-Cola", type: "property", price: 220, rent: 18, color: "var(--property-color5)", owner: null },
    { id: 22, name: "Шанс", type: "chance", action: "draw" },
    { id: 23, name: "Pepsi", type: "property", price: 220, rent: 18, color: "var(--property-color5)", owner: null },
    { id: 24, name: "Red Bull", type: "property", price: 240, rent: 20, color: "var(--property-color5)", owner: null },
    { id: 25, name: "Netflix", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 26, name: "Disney", type: "property", price: 260, rent: 22, color: "var(--property-color6)", owner: null },
    { id: 27, name: "Sony", type: "property", price: 260, rent: 22, color: "var(--property-color6)", owner: null },
    { id: 28, name: "Роснефть", type: "utility", price: 150, rent: 10, owner: null },
    { id: 29, name: "Nintendo", type: "property", price: 280, rent: 24, color: "var(--property-color6)", owner: null },
    { id: 30, name: "Идите в тюрьму", type: "gotojail", action: "goto", destination: 10 },
    { id: 31, name: "VISA", type: "property", price: 300, rent: 26, color: "var(--property-color7)", owner: null },
    { id: 32, name: "MasterCard", type: "property", price: 300, rent: 26, color: "var(--property-color7)", owner: null },
    { id: 33, name: "Общественная казна", type: "chest", action: "draw" },
    { id: 34, name: "AmEx", type: "property", price: 320, rent: 28, color: "var(--property-color7)", owner: null },
    { id: 35, name: "ВТБ", type: "railroad", price: 200, rent: 25, owner: null },
    { id: 36, name: "Шанс", type: "chance", action: "draw" },
    { id: 37, name: "Rolex", type: "property", price: 350, rent: 35, color: "var(--property-color8)", owner: null },
    { id: 38, name: "Налог на роскошь", type: "tax", amount: 100 },
    { id: 39, name: "Louis Vuitton", type: "property", price: 400, rent: 50, color: "var(--property-color8)", owner: null }
];

// Карты шанса
const chanceCards = [
    { text: "Переместитесь на старт", action: "move", destination: 0 },
    { text: "Банк выплачивает вам дивиденды в размере ₽50", action: "collect", amount: 50 },
    { text: "Штраф за неправильное декларирование ₽15", action: "pay", amount: 15 },
    { text: "Ваши акции выросли! Получите ₽100", action: "collect", amount: 100 },
    { text: "Идите в тюрьму за неуплату налогов", action: "goto", destination: 10 },
    { text: "Продвиньтесь на 3 клетки вперед", action: "forward", steps: 3 },
    { text: "Оплатите ремонт офисов. Заплатите ₽25", action: "pay", amount: 25 },
    { text: "Вы были избраны главой совета директоров. Заплатите каждому игроку ₽50", action: "payall", amount: 50 },
    { text: "Переместитесь на компанию Rolex", action: "move", destination: 37 },
    { text: "Вы получаете освобождение из тюрьмы благодаря связям", action: "getoutofjail" }
];

// Карты общественной казны
const chestCards = [
    { text: "Возврат налога. Получите ₽20", action: "collect", amount: 20 },
    { text: "Ошибка банка в вашу пользу. Получите ₽200", action: "collect", amount: 200 },
    { text: "Оплатите медицинскую страховку ₽100", action: "pay", amount: 100 },
    { text: "Оплатите бизнес-страховку ₽50", action: "pay", amount: 50 },
    { text: "IPO вашей компании! Получите ₽10 от каждого игрока", action: "collectall", amount: 10 },
    { text: "Переместитесь на старт", action: "move", destination: 0 },
    { text: "Вы выиграли бизнес-конкурс! Получите ₽100", action: "collect", amount: 100 },
    { text: "Идите в тюрьму за инсайдерскую торговлю", action: "goto", destination: 10 },
    { text: "Выплатите налог на имущество ₽40", action: "pay", amount: 40 },
    { text: "Вы получаете освобождение из тюрьмы благодаря хорошим адвокатам", action: "getoutofjail" }
];

// Функция для выбора игрока
function selectPlayer(playerId) {
    selectedPlayer = playerId;
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('currentPlayerLabel').textContent = `Игрок ${playerId}`;
    
    // Инициализируем игру
    initGame();
}

// Отслеживаем состояние игры (для синхронизации обоих игроков)
let gameData = {
    state: gameState,
    boardCells: boardCells
};

// Функция для сохранения состояния игры в localStorage
function saveGameState() {
    gameData = {
        state: gameState,
        boardCells: boardCells
    };
    localStorage.setItem('monopolyGameData', JSON.stringify(gameData));
}

// Функция для загрузки состояния игры из localStorage
function loadGameState() {
    const savedData = localStorage.getItem('monopolyGameData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Обновляем состояние игры
        Object.assign(gameState, parsedData.state);
        
        // Обновляем ячейки доски
        boardCells.forEach((cell, index) => {
            if (parsedData.boardCells[index] && parsedData.boardCells[index].owner !== undefined) {
                cell.owner = parsedData.boardCells[index].owner;
            }
        });
    }
}

// DOM элементы
let boardElement;
let player1TokenElement;
let player2TokenElement;
let player1MoneyElement;
let player2MoneyElement;
let rollDiceButton;
let buyPropertyButton;
let endTurnButton;
let dice1Element;
let dice2Element;
let gameLogElement;
let propertyModal;
let modalPropertyName;
let modalPropertyPrice;
let modalPropertyRent;
let modalPropertyOwner;
let modalBuyButton;
let modalCloseButton;
let closeModalButton;
let winnerModal;
let winnerMessage;
let restartGameButton;

// Инициализация игры
function initGame() {
    // Загружаем элементы DOM
    boardElement = document.getElementById('board');
    player1TokenElement = document.getElementById('player1Token');
    player2TokenElement = document.getElementById('player2Token');
    player1MoneyElement = document.getElementById('player1Money');
    player2MoneyElement = document.getElementById('player2Money');
    rollDiceButton = document.getElementById('rollDiceBtn');
    buyPropertyButton = document.getElementById('buyPropertyBtn');
    endTurnButton = document.getElementById('endTurnBtn');
    dice1Element = document.getElementById('dice1');
    dice2Element = document.getElementById('dice2');
    gameLogElement = document.getElementById('gameLog');
    propertyModal = document.getElementById('propertyModal');
    modalPropertyName = document.getElementById('modalPropertyName');
    modalPropertyPrice = document.getElementById('modalPropertyPrice');
    modalPropertyRent = document.getElementById('modalPropertyRent');
    modalPropertyOwner = document.getElementById('modalPropertyOwner');
    modalBuyButton = document.getElementById('modalBuyBtn');
    modalCloseButton = document.getElementById('modalCloseBtn');
    closeModalButton = document.getElementById('closeModal');
    winnerModal = document.getElementById('winnerModal');
    winnerMessage = document.getElementById('winnerMessage');
    restartGameButton = document.getElementById('restartGameBtn');

    // Загружаем предыдущее состояние игры
    loadGameState();
    
    createBoard();
    updateUI();
    addEventListeners();
    
    // Если это новая игра, добавляем начальное сообщение
    if (gameLogElement.childElementCount === 0) {
        logMessage("Игра началась! Ход игрока 1.");
    }
    
    // Установка интервала для обновления состояния игры
    setInterval(syncGameState, 1000);
}

// Функция синхронизации состояния игры
function syncGameState() {
    // Загружаем актуальное состояние игры
    loadGameState();
    updateUI();
}

// Создание игрового поля
function createBoard() {
    boardElement.innerHTML = '';
    
    // Создаем пустые ячейки для центра доски
    for (let row = 1; row < 10; row++) {
        for (let col = 1; col < 10; col++) {
            const centerCell = document.createElement('div');
            centerCell.classList.add('center-cell');
            centerCell.style.gridRow = `${row + 1}`;
            centerCell.style.gridColumn = `${col + 1}`;
            centerCell.style.backgroundColor = 'var(--light-color)';
            centerCell.style.border = 'none';
            boardElement.appendChild(centerCell);
        }
    }
    
    // Создаем игровые ячейки
    boardCells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.id = cell.id;
        
        let row, col;
        
        // Определяем положение ячейки
        if (index <= 10) {
            // Нижний ряд (от Старта до Тюрьмы)
            row = 11;
            col = 11 - index;
        } else if (index <= 20) {
            // Левый столбец (от L'Oréal до Бесплатной стоянки)
            row = 21 - index;
            col = 1;
        } else if (index <= 30) {
            // Верхний ряд (от Coca-Cola до Идите в тюрьму)
            row = 1;
            col = index - 20;
        } else {
            // Правый столбец (от VISA до Louis Vuitton)
            row = index - 30;
            col = 11;
        }
        
        cellElement.style.gridRow = `${row}`;
        cellElement.style.gridColumn = `${col}`;
        
        // Добавляем цвет для собственности
        if (cell.type === 'property' || cell.type === 'railroad' || cell.type === 'utility') {
            const colorStrip = document.createElement('div');
            colorStrip.classList.add('color-strip');
            
            if (cell.type === 'property') {
                colorStrip.style.backgroundColor = cell.color;
            } else if (cell.type === 'railroad') {
                colorStrip.style.backgroundColor = 'var(--railroad-color)';
            } else if (cell.type === 'utility') {
                colorStrip.style.backgroundColor = 'var(--utility-color)';
            }
            
            cellElement.appendChild(colorStrip);
            
            // Отмечаем владельца собственности
            if (cell.owner !== null) {
                cellElement.classList.add(`owned-by-player${cell.owner}`);
            }
        }
        
        // Добавляем название ячейки
        const nameElement = document.createElement('div');
        nameElement.classList.add('cell-name');
        nameElement.textContent = cell.name;
        cellElement.appendChild(nameElement);
        
        // Добавляем цену для покупаемых ячеек
        if (cell.price) {
            const priceElement = document.createElement('div');
            priceElement.classList.add('cell-price');
            priceElement.textContent = `₽${cell.price}`;
            cellElement.appendChild(priceElement);
        }
        
        // Добавляем обработчик клика для отображения информации о ячейке
        cellElement.addEventListener('click', () => showPropertyInfo(cell));
        
        boardElement.appendChild(cellElement);
    });
    
    // Добавляем фишки игроков
    boardElement.appendChild(player1TokenElement);
    boardElement.appendChild(player2TokenElement);
    
    // Обновляем позиции фишек
    updateTokenPositions();
}

// Показать информацию о ячейке
function showPropertyInfo(property) {
    // Если это не покупаемая собственность, просто выводим информацию в лог
    if (property.type !== 'property' && property.type !== 'railroad' && property.type !== 'utility') {
        logMessage(`${property.name}: ${getPropertyTypeText(property)}`);
        return;
    }
    
    // Заполняем модальное окно информацией о ячейке
    modalPropertyName.textContent = property.name;
    modalPropertyPrice.textContent = `Цена: ₽${property.price}`;
    modalPropertyRent.textContent = `Аренда: ₽${property.rent}`;
    
    let ownerText = "Нет владельца";
    if (property.owner !== null) {
        ownerText = `Владелец: Игрок ${property.owner}`;
    }
    modalPropertyOwner.textContent = ownerText;
    
    // Показываем или скрываем кнопку покупки
    if (property.owner === null && gameState.currentPlayer === selectedPlayer - 1 && !gameState.hasRolled) {
        modalBuyButton.style.display = 'none';
    } else if (property.owner === null && gameState.currentPlayer === selectedPlayer - 1 && gameState.hasRolled) {
        const currentPlayer = gameState.players[gameState.currentPlayer];
        if (currentPlayer.position === property.id && currentPlayer.money >= property.price) {
            modalBuyButton.style.display = 'block';
        } else {
            modalBuyButton.style.display = 'none';
        }
    } else {
        modalBuyButton.style.display = 'none';
    }
    
    // Устанавливаем данные текущей ячейки для кнопки покупки
    modalBuyButton.dataset.propertyId = property.id;
    
    // Показываем модальное окно
    propertyModal.style.display = 'block';
}

// Получить текстовое описание типа ячейки
function getPropertyTypeText(property) {
    switch (property.type) {
        case 'start':
            return "Начальная ячейка. Получите ₽200, проходя мимо.";
        case 'property':
            return "Компания, которую можно купить.";
        case 'chest':
            return "Возьмите карту Общественной казны.";
        case 'tax':
            return `Заплатите налог в размере ₽${property.amount}.`;
        case 'railroad':
            return "Транспортная компания, которую можно купить.";
        case 'utility':
            return "Коммунальная служба, которую можно купить.";
        case 'chance':
            return "Возьмите карту Шанса.";
        case 'jail':
            return "Тюрьма (Посетитель).";
        case 'gotojail':
            return "Отправляйтесь в тюрьму.";
        case 'parking':
            return "Бесплатная стоянка.";
        default:
            return "Обычная ячейка.";
    }
}

// Обновление позиций фишек игроков
function updateTokenPositions() {
    const player1Position = gameState.players[0].position;
    const player2Position = gameState.players[1].position;
    
    const player1Cell = document.querySelector(`.cell[data-id="${player1Position}"]`);
    const player2Cell = document.querySelector(`.cell[data-id="${player2Position}"]`);
    
    if (player1Cell) {
        const rect = player1Cell.getBoundingClientRect();
        const boardRect = boardElement.getBoundingClientRect();
        
        player1TokenElement.style.left = `${rect.left - boardRect.left + rect.width / 4}px`;
        player1TokenElement.style.top = `${rect.top - boardRect.top + rect.height / 4}px`;
    }
    
    if (player2Cell) {
        const rect = player2Cell.getBoundingClientRect();
        const boardRect = boardElement.getBoundingClientRect();
        
        player2TokenElement.style.left = `${rect.left - boardRect.left + rect.width * 3 / 4}px`;
        player2TokenElement.style.top = `${rect.top - boardRect.top + rect.height * 3 / 4}px`;
    }
}

// Обновление пользовательского интерфейса
function updateUI() {
    // Обновляем отображение денег
    player1MoneyElement.textContent = `₽${gameState.players[0].money}`;
    player2MoneyElement.textContent = `₽${gameState.players[1].money}`;
    
    // Обновляем позиции фишек
    updateTokenPositions();
    
    // Обновляем свойства на доске
    boardCells.forEach((cell, index) => {
        const cellElement = document.querySelector(`.cell[data-id="${index}"]`);
        if (cellElement) {
            cellElement.classList.remove('owned-by-player1', 'owned-by-player2');
            if (cell.owner !== null) {
                cellElement.classList.add(`owned-by-player${cell.owner}`);
            }
        }
    });
    
    // Обновляем доступность кнопок в зависимости от текущего хода и игрока
    if (gameState.currentPlayer === selectedPlayer - 1) {
        rollDiceButton.disabled = gameState.hasRolled;
        endTurnButton.disabled = !gameState.hasRolled;
        
        const currentPlayer = gameState.players[gameState.currentPlayer];
        const currentCell = boardCells[currentPlayer.position];
        
        buyPropertyButton.disabled = !(gameState.hasRolled && 
                                    (currentCell.type === 'property' || 
                                     currentCell.type === 'railroad' || 
                                     currentCell.type === 'utility') && 
                                    currentCell.owner === null && 
                                    currentPlayer.money >= currentCell.price);
    } else {
        rollDiceButton.disabled = true;
        buyPropertyButton.disabled = true;
        endTurnButton.disabled = true;
    }
    
    // Обновляем отображение кубиков
    dice1Element.textContent = gameState.dice[0];
    dice2Element.textContent = gameState.dice[1];
    
    // Проверяем, закончилась ли игра
    if (gameState.gameOver) {
        let winner;
        if (gameState.players[0].money <= 0) {
            winner = gameState.players[1];
        } else if (gameState.players[1].money <= 0) {
            winner = gameState.players[0];
        } else {
            const totalAssets0 = calculateTotalAssets(0);
            const totalAssets1 = calculateTotalAssets(1);
            winner = totalAssets0 > totalAssets1 ? gameState.players[0] : gameState.players[1];
        }
        
        winnerMessage.textContent = `${winner.name} выиграл с ₽${winner.money}!`;
        winnerModal.style.display = 'block';
    }
}

// Рассчитать общую стоимость активов игрока
function calculateTotalAssets(playerIndex) {
    const player = gameState.players[playerIndex];
    let totalAssets = player.money;
    
    // Добавляем стоимость всех собственностей
    boardCells.forEach(cell => {
        if (cell.owner === player.id) {
            totalAssets += cell.price;
        }
    });
    
    return totalAssets;
}

// Добавление события клика для кнопок
function addEventListeners() {
    rollDiceButton.addEventListener('click', rollDice);
    buyPropertyButton.addEventListener('click', buyProperty);
    endTurnButton.addEventListener('click', endTurn);
    modalBuyButton.addEventListener('click', () => {
        const propertyId = parseInt(modalBuyButton.dataset.propertyId);
        buyPropertyById(propertyId);
        propertyModal.style.display = 'none';
    });
    modalCloseButton.addEventListener('click', () => {
        propertyModal.style.display = 'none';
    });
    closeModalButton.addEventListener('click', () => {
        propertyModal.style.display = 'none';
    });
    restartGameButton.addEventListener('click', restartGame);
}

// Бросить кубики
function rollDice() {
    if (gameState.currentPlayer !== selectedPlayer - 1 || gameState.hasRolled) return;
    
    // Генерируем случайные значения кубиков
    gameState.dice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
    ];
    gameState.hasRolled = true;
    
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const diceSum = gameState.dice[0] + gameState.dice[1];
    
    logMessage(`${currentPlayer.name} бросает кубики и выбрасывает ${diceSum} (${gameState.dice[0]} + ${gameState.dice[1]}).`);
    
    // Проверяем, находится ли игрок в тюрьме
    if (currentPlayer.inJail) {
        if (gameState.dice[0] === gameState.dice[1]) {
            currentPlayer.inJail = false;
            currentPlayer.jailTurns = 0;
            logMessage(`${currentPlayer.name} выбрасывает дубль и выходит из тюрьмы!`);
        } else {
            currentPlayer.jailTurns++;
            if (currentPlayer.jailTurns >= 3) {
                currentPlayer.inJail = false;
                currentPlayer.jailTurns = 0;
                logMessage(`${currentPlayer.name} отсидел 3 хода в тюрьме и выходит на свободу.`);
                movePlayer(diceSum);
            } else {
                logMessage(`${currentPlayer.name} остается в тюрьме (ход ${currentPlayer.jailTurns} из 3).`);
            }
        }
    } else {
        movePlayer(diceSum);
    }
    
    updateUI();
    saveGameState();
}

// Переместить игрока
function movePlayer(steps) {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const oldPosition = currentPlayer.position;
    
    // Новая позиция с учетом перехода через Старт
    currentPlayer.position = (currentPlayer.position + steps) % 40;
    
    logMessage(`${currentPlayer.name} перемещается с ${boardCells[oldPosition].name} на ${boardCells[currentPlayer.position].name}.`);
    
    // Проверяем, прошел ли игрок через Старт
    if (currentPlayer.position < oldPosition && oldPosition + steps >= 40) {
        currentPlayer.money += 200;
        logMessage(`${currentPlayer.name} проходит через Старт и получает ₽200.`);
    }
    
    // Обрабатываем ячейку, на которую попал игрок
    handleCellAction();
}

// Обработка действия ячейки
function handleCellAction() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const currentCell = boardCells[currentPlayer.position];
    
    switch (currentCell.type) {
        case 'tax':
            payTax(currentCell.amount);
            break;
        case 'chance':
            drawChanceCard();
            break;
        case 'chest':
            drawChestCard();
            break;
        case 'gotojail':
            goToJail();
            break;
        case 'property':
        case 'railroad':
        case 'utility':
            if (currentCell.owner !== null && currentCell.owner !== currentPlayer.id) {
                payRent();
            }
            break;
    }
}

// Заплатить налог
function payTax(amount) {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    currentPlayer.money -= amount;
    logMessage(`${currentPlayer.name} платит налог в размере ₽${amount}.`);
    
    // Проверяем банкротство
    checkBankruptcy();
}

// Заплатить аренду
function payRent() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const currentCell = boardCells[currentPlayer.position];
    const owner = gameState.players.find(p => p.id === currentCell.owner);
    
    let rentAmount = currentCell.rent;
    
    // Увеличиваем аренду для железных дорог в зависимости от количества принадлежащих владельцу
    if (currentCell.type === 'railroad') {
        const railroadsOwned = boardCells.filter(cell => 
            cell.type === 'railroad' && cell.owner === owner.id
        ).length;
        
        rentAmount = 25 * Math.pow(2, railroadsOwned - 1);
    }
    
    // Увеличиваем аренду для коммунальных служб в зависимости от броска кубиков
    if (currentCell.type === 'utility') {
        const utilitiesOwned = boardCells.filter(cell => 
            cell.type === 'utility' && cell.owner === owner.id
        ).length;
        
        const diceSum = gameState.dice[0] + gameState.dice[1];
        
        if (utilitiesOwned === 1) {
            rentAmount = diceSum * 4;
        } else if (utilitiesOwned === 2) {
            rentAmount = diceSum * 10;
        }
    }
    
    currentPlayer.money -= rentAmount;
    owner.money += rentAmount;
    
    logMessage(`${currentPlayer.name} платит ₽${rentAmount} аренды ${owner.name} за ${currentCell.name}.`);
    
    // Проверяем банкротство
    checkBankruptcy();
}

// Купить недвижимость
function buyProperty() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const currentCell = boardCells[currentPlayer.position];
    
    if (currentCell.owner !== null || currentPlayer.money < currentCell.price) {
        return;
    }
    
    currentPlayer.money -= currentCell.price;
    currentCell.owner = currentPlayer.id;
    currentPlayer.properties.push(currentCell.id);
    
    logMessage(`${currentPlayer.name} покупает ${currentCell.name} за ₽${currentCell.price}.`);
    
    updateUI();
    saveGameState();
}

// Купить собственность по ID
function buyPropertyById(propertyId) {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const property = boardCells[propertyId];
    
    if (property.owner !== null || currentPlayer.money < property.price) {
        return;
    }
    
    currentPlayer.money -= property.price;
    property.owner = currentPlayer.id;
    currentPlayer.properties.push(property.id);
    
    logMessage(`${currentPlayer.name} покупает ${property.name} за ₽${property.price}.`);
    
    updateUI();
    saveGameState();
}

// Переход в тюрьму
function goToJail() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    currentPlayer.position = 10;
    currentPlayer.inJail = true;
    currentPlayer.jailTurns = 0;
    
    logMessage(`${currentPlayer.name} отправляется в тюрьму!`);
}

// Взять карту Шанса
function drawChanceCard() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const cardIndex = Math.floor(Math.random() * chanceCards.length);
    const card = chanceCards[cardIndex];
    
    logMessage(`${currentPlayer.name} берет карту Шанса: ${card.text}`);
    
    handleCardAction(card);
}

// Взять карту Общественной казны
function drawChestCard() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const cardIndex = Math.floor(Math.random() * chestCards.length);
    const card = chestCards[cardIndex];
    
    logMessage(`${currentPlayer.name} берет карту Общественной казны: ${card.text}`);
    
    handleCardAction(card);
}

// Обработать действие карты
function handleCardAction(card) {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    switch (card.action) {
        case 'move':
            // Перемещение на конкретную ячейку
            const oldPosition = currentPlayer.position;
            currentPlayer.position = card.destination;
            
            // Если прошел через старт
            if (card.destination < oldPosition && card.destination !== 10) {
                currentPlayer.money += 200;
                logMessage(`${currentPlayer.name} проходит через Старт и получает ₽200.`);
            }
            
            logMessage(`${currentPlayer.name} перемещается на ${boardCells[card.destination].name}.`);
            handleCellAction();
            break;
        case 'collect':
            // Получить деньги
            currentPlayer.money += card.amount;
            logMessage(`${currentPlayer.name} получает ₽${card.amount}.`);
            break;
        case 'pay':
            // Заплатить деньги
            currentPlayer.money -= card.amount;
            logMessage(`${currentPlayer.name} платит ₽${card.amount}.`);
            checkBankruptcy();
            break;
        case 'goto':
            // Перейти на ячейку
            currentPlayer.position = card.destination;
            if (card.destination === 10) {
                currentPlayer.inJail = true;
                currentPlayer.jailTurns = 0;
                logMessage(`${currentPlayer.name} отправляется в тюрьму!`);
            } else {
                logMessage(`${currentPlayer.name} перемещается на ${boardCells[card.destination].name}.`);
                handleCellAction();
            }
            break;
        case 'forward':
            // Продвинуться вперед на несколько шагов
            currentPlayer.position = (currentPlayer.position + card.steps) % 40;
            logMessage(`${currentPlayer.name} продвигается на ${card.steps} ячеек вперед.`);
            handleCellAction();
            break;
        case 'payall':
            // Заплатить всем игрокам
            gameState.players.forEach(player => {
                if (player.id !== currentPlayer.id) {
                    currentPlayer.money -= card.amount;
                    player.money += card.amount;
                    logMessage(`${currentPlayer.name} платит ₽${card.amount} игроку ${player.name}.`);
                }
            });
            checkBankruptcy();
            break;
        case 'collectall':
            // Получить деньги от всех игроков
            gameState.players.forEach(player => {
                if (player.id !== currentPlayer.id) {
                    player.money -= card.amount;
                    currentPlayer.money += card.amount;
                    logMessage(`${currentPlayer.name} получает ₽${card.amount} от игрока ${player.name}.`);
                }
            });
            // Проверяем банкротство других игроков
            gameState.players.forEach((player, index) => {
                if (index !== gameState.currentPlayer) {
                    checkPlayerBankruptcy(index);
                }
            });
            break;
        case 'getoutofjail':
            // Получить карту освобождения из тюрьмы
            currentPlayer.hasJailCard = true;
            logMessage(`${currentPlayer.name} получает карту освобождения из тюрьмы.`);
            break;
    }
}

// Проверка на банкротство
function checkBankruptcy() {
    checkPlayerBankruptcy(gameState.currentPlayer);
}

// Проверка на банкротство конкретного игрока
function checkPlayerBankruptcy(playerIndex) {
    const player = gameState.players[playerIndex];
    
    if (player.money <= 0) {
        // Игрок банкрот
        gameState.gameOver = true;
        const winner = gameState.players.find(p => p.id !== player.id);
        logMessage(`${player.name} обанкротился! ${winner.name} выигрывает игру!`);
        
        // Показываем модальное окно с победителем
        winnerMessage.textContent = `${winner.name} выиграл с ₽${winner.money}!`;
        winnerModal.style.display = 'block';
    }
}

// Завершить ход
function endTurn() {
    if (gameState.currentPlayer !== selectedPlayer - 1 || !gameState.hasRolled) return;
    
    // Переход к следующему игроку
    gameState.currentPlayer = (gameState.currentPlayer + 1) % 2;
    gameState.hasRolled = false;
    
    logMessage(`Ход переходит к ${gameState.players[gameState.currentPlayer].name}.`);
    
    updateUI();
    saveGameState();
}

// Перезапуск игры
function restartGame() {
    // Сбрасываем состояние игры
    gameState.players = [
        { id: 1, name: "Игрок 1", money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 },
        { id: 2, name: "Игрок 2", money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 }
    ];
    gameState.currentPlayer = 0;
    gameState.dice = [1, 1];
    gameState.hasRolled = false;
    gameState.gameOver = false;
    
    // Сбрасываем владельцев собственности
    boardCells.forEach(cell => {
        if (cell.owner !== undefined) {
            cell.owner = null;
        }
    });
    
    // Очищаем лог
    gameLogElement.innerHTML = '';
    logMessage("Новая игра началась! Ход игрока 1.");
    
    // Скрываем модальное окно победителя
    winnerModal.style.display = 'none';
    
    updateUI();
    saveGameState();
}

// Логирование сообщений
function logMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('log-message');
    messageElement.textContent = message;
    gameLogElement.appendChild(messageElement);
    gameLogElement.scrollTop = gameLogElement.scrollHeight;
}

// Инициализируем страницу при загрузке
window.addEventListener('load', () => {
    // Проверяем, есть ли сохраненная игра
    const savedData = localStorage.getItem('monopolyGameData');
    
    // Если игра начата и есть выбранный игрок, переходим к игре
    if (selectedPlayer !== null && savedData) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        document.getElementById('currentPlayerLabel').textContent = `Игрок ${selectedPlayer}`;
        initGame();
    }
});
