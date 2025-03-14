// Импорт игровых данных
import { gameState, boardCells, chanceCards, chestCards } from './gameData.js';

        // DOM элементы
        const boardElement = document.getElementById('board');
        const player1TokenElement = document.getElementById('player1Token');
        const player2TokenElement = document.getElementById('player2Token');
        const player1MoneyElement = document.getElementById('player1Money');
        const player2MoneyElement = document.getElementById('player2Money');
        const rollDiceButton = document.getElementById('rollDiceBtn');
        const buyPropertyButton = document.getElementById('buyPropertyBtn');
        const endTurnButton = document.getElementById('endTurnBtn');
        const dice1Element = document.getElementById('dice1');
        const dice2Element = document.getElementById('dice2');
        const gameLogElement = document.getElementById('gameLog');
        const propertyModal = document.getElementById('propertyModal');
        const modalPropertyName = document.getElementById('modalPropertyName');
        const modalPropertyPrice = document.getElementById('modalPropertyPrice');
        const modalPropertyRent = document.getElementById('modalPropertyRent');
        const modalPropertyOwner = document.getElementById('modalPropertyOwner');
        const modalBuyButton = document.getElementById('modalBuyBtn');
        const modalCloseButton = document.getElementById('modalCloseBtn');
        const closeModalButton = document.getElementById('closeModal');
        const winnerModal = document.getElementById('winnerModal');
        const winnerMessage = document.getElementById('winnerMessage');
        const restartGameButton = document.getElementById('restartGameBtn');

        // Инициализация игры
        function initGame() {
            createBoard();
            updateUI();
            addEventListeners();
            logMessage("Игра началась! Ход игрока 1.");
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
                    // Левый столбец (от Таганской до Бесплатной стоянки)
                    row = 21 - index;
                    col = 1;
                } else if (index <= 30) {
                    // Верхний ряд (от Нового Арбата до Идите в тюрьму)
                    row = 1;
                    col = index - 20;
                } else {
                    // Правый столбец (от Кремлевской наб. до Тверской-2)
                    row = index - 30;
                    col = 11;
                }
                
                cellElement.style.gridRow = `${row}`;
                cellElement.style.gridColumn = `${col}`;
                
                // Добавляем цветную полосу для собственности
                if (cell.type === 'property' || cell.type === 'railroad' || cell.type === 'utility') {
                    const colorStrip = document.createElement('div');
                    colorStrip.classList.add('color-strip');
                    
                    if (cell.type === 'property') {
                        colorStrip.style.backgroundColor = cell.color;
                    } else if (cell.type === 'railroad') {
                        colorStrip.style.backgroundColor = '#000000';
                    } else if (cell.type === 'utility') {
                        colorStrip.style.backgroundColor = '#00b0ff';
                    }
                    
                    cellElement.appendChild(colorStrip);
                }
                
                // Название ячейки
                const titleElement = document.createElement('div');
                titleElement.classList.add('cell-title');
                titleElement.textContent = cell.name;
                cellElement.appendChild(titleElement);
                
                // Цена для собственности
                if (cell.type === 'property' || cell.type === 'railroad' || cell.type === 'utility') {
                    const priceElement = document.createElement('div');
                    priceElement.classList.add('cell-price');
                    priceElement.textContent = `₽${cell.price}`;
                    cellElement.appendChild(priceElement);
                }
                
                // Добавляем обработчик клика для отображения модального окна
                if (cell.type === 'property' || cell.type === 'railroad' || cell.type === 'utility') {
                    cellElement.addEventListener('click', () => showPropertyModal(cell));
                }
                
                boardElement.appendChild(cellElement);
            });
            
            // Первоначальное размещение фишек игроков
            updatePlayerTokens();
        }

        // Обновление UI
        function updateUI() {
            player1MoneyElement.textContent = `₽${gameState.players[0].money}`;
            player2MoneyElement.textContent = `₽${gameState.players[1].money}`;
            
            rollDiceButton.disabled = gameState.hasRolled;
            buyPropertyButton.disabled = !canBuyProperty();
            endTurnButton.disabled = !gameState.hasRolled;
            
            updatePlayerTokens();
            
            // Выделяем текущего игрока
            document.querySelector('.player1').style.opacity = gameState.currentPlayer === 0 ? '1' : '0.7';
            document.querySelector('.player2').style.opacity = gameState.currentPlayer === 1 ? '1' : '0.7';
            
            // Обновляем игровое поле, отмечая собственность игроков
            boardCells.forEach((cell, index) => {
                const cellElement = document.querySelector(`.cell[data-id="${index}"]`);
                
                if (cell.owner !== null) {
                    cellElement.style.border = `2px solid var(--player${cell.owner}-color)`;
                } else {
                    cellElement.style.border = '1px solid var(--border-color)';
                }
            });
        }

        // Обновление положения фишек игроков
        function updatePlayerTokens() {
            const player1Position = gameState.players[0].position;
            const player2Position = gameState.players[1].position;
            
            const player1Cell = document.querySelector(`.cell[data-id="${player1Position}"]`);
            const player2Cell = document.querySelector(`.cell[data-id="${player2Position}"]`);
            
            if (player1Cell && player2Cell) {
                const player1Rect = player1Cell.getBoundingClientRect();
                const player2Rect = player2Cell.getBoundingClientRect();
                const boardRect = boardElement.getBoundingClientRect();
                
                player1TokenElement.style.left = `${player1Rect.left - boardRect.left + 5}px`;
                player1TokenElement.style.top = `${player1Rect.top - boardRect.top + 5}px`;
                
                player2TokenElement.style.left = `${player2Rect.left - boardRect.left + player2Rect.width - 20}px`;
                player2TokenElement.style.top = `${player2Rect.top - boardRect.top + 5}px`;
            }
        }

        // Проверка возможности покупки собственности
        function canBuyProperty() {
            const player = gameState.players[gameState.currentPlayer];
            const cell = boardCells[player.position];
            
            return gameState.hasRolled && 
                  (cell.type === 'property' || cell.type === 'railroad' || cell.type === 'utility') && 
                  cell.owner === null && 
                  player.money >= cell.price;
        }

        // Добавление обработчиков событий
        function addEventListeners() {
            rollDiceButton.addEventListener('click', rollDice);
            buyPropertyButton.addEventListener('click', buyProperty);
            endTurnButton.addEventListener('click', endTurn);
            modalBuyButton.addEventListener('click', buyPropertyFromModal);
            modalCloseButton.addEventListener('click', closePropertyModal);
            closeModalButton.addEventListener('click', closePropertyModal);
            restartGameButton.addEventListener('click', restartGame);
            
            // Обработчик изменения размера окна для обновления положения фишек
            window.addEventListener('resize', updatePlayerTokens);
        }

        // Бросок кубиков
        function rollDice() {
            if (gameState.hasRolled) return;
            
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            
            gameState.dice = [dice1, dice2];
            gameState.hasRolled = true;
            
            dice1Element.textContent = dice1;
            dice2Element.textContent = dice2;
            
            const player = gameState.players[gameState.currentPlayer];
            const diceSum = dice1 + dice2;
            
            logMessage(`${player.name} выбросил ${dice1} и ${dice2} (сумма: ${diceSum})`);
            
            movePlayer(diceSum);
            updateUI();
        }

        // Перемещение игрока
        function movePlayer(spaces) {
            const player = gameState.players[gameState.currentPlayer];
            const oldPosition = player.position;
            
            // Проверка на тюрьму
            if (player.inJail) {
                const dice1 = gameState.dice[0];
                const dice2 = gameState.dice[1];
                
                if (dice1 === dice2) {
                    player.inJail = false;
                    player.jailTurns = 0;
                    logMessage(`${player.name} выбросил дубль и освободился из тюрьмы!`);
                } else {
                    player.jailTurns++;
                    if (player.jailTurns >= 3) {
                        player.inJail = false;
                        player.jailTurns = 0;
                        player.money -= 50;
                        logMessage(`${player.name} заплатил ₽50 и освободился из тюрьмы после 3 ходов.`);
                    } else {
                        logMessage(`${player.name} остается в тюрьме (ход ${player.jailTurns} из 3).`);
                        return;
                    }
                }
            }
            
            player.position = (player.position + spaces) % 40;
            
            // Проверка на прохождение старта
            if (player.position < oldPosition && !player.inJail) {
                player.money += 200;
                logMessage(`${player.name} прошел старт и получил ₽200.`);
            }
            
            // Анимация перемещения фишки
            const tokenElement = gameState.currentPlayer === 0 ? player1TokenElement : player2TokenElement;
            tokenElement.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                handleCellAction();
                updatePlayerTokens();
            }, 500);
        }

        // Обработка действия ячейки
        function handleCellAction() {
            const player = gameState.players[gameState.currentPlayer];
            const cell = boardCells[player.position];
            
            logMessage(`${player.name} попал на поле "${cell.name}"`);
            
            switch (cell.type) {
                case 'property':
                case 'railroad':
                case 'utility':
                    if (cell.owner !== null && cell.owner !== player.id) {
                        payRent(cell);
                    }
                    break;
                    
                case 'tax':
                    player.money -= cell.amount;
                    logMessage(`${player.name} заплатил налог в размере ₽${cell.amount}.`);
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
                
                default:
                    break;
            }
            
            // Проверка на банкротство
            if (player.money < 0) {
                gameOver();
            }
            
            updateUI();
        }

        // Оплата аренды
        function payRent(cell) {
            const player = gameState.players[gameState.currentPlayer];
            const owner = gameState.players[cell.owner - 1];
            
            let rent = cell.rent;
            
            // Удвоение аренды для собственности одного цвета
            if (cell.type === 'property') {
                const sameColorProperties = boardCells.filter(c => 
                    c.type === 'property' && 
                    c.color === cell.color && 
                    c.owner === cell.owner
                );
                
                if (sameColorProperties.length > 1) {
                    rent *= 2;
                }
            }
            
            // Специальные правила для железных дорог
            if (cell.type === 'railroad') {
                const ownedRailroads = boardCells.filter(c => 
                    c.type === 'railroad' && 
                    c.owner === cell.owner
                ).length;
                
                rent = 25 * Math.pow(2, ownedRailroads - 1);
            }
            
            // Специальные правила для коммунальных услуг
            if (cell.type === 'utility') {
                const ownedUtilities = boardCells.filter(c => 
                    c.type === 'utility' && 
                    c.owner === cell.owner
                ).length;
                
                const diceSum = gameState.dice[0] + gameState.dice[1];
                
                if (ownedUtilities === 1) {
                    rent = diceSum * 4;
                } else if (ownedUtilities === 2) {
                    rent = diceSum * 10;
                }
            }
            
            player.money -= rent;
            owner.money += rent;
            
            logMessage(`${player.name} заплатил ₽${rent} аренды игроку ${owner.name}.`);
        }

        // Отправка в тюрьму
        function goToJail() {
            const player = gameState.players[gameState.currentPlayer];
            
            player.position = 10;
            player.inJail = true;
            player.jailTurns = 0;
            
            logMessage(`${player.name} отправляется в тюрьму!`);
            updatePlayerTokens();
        }

        // Покупка собственности
        function buyProperty() {
            const player = gameState.players[gameState.currentPlayer];
            const cell = boardCells[player.position];
            
            if (canBuyProperty()) {
                player.money -= cell.price;
                cell.owner = player.id;
                player.properties.push(cell.id);
                
                logMessage(`${player.name} купил "${cell.name}" за ₽${cell.price}.`);
                updateUI();
            }
        }

        // Покупка собственности из модального окна
        function buyPropertyFromModal() {
            buyProperty();
            closePropertyModal();
        }

        // Вытягивание карты шанса
        function drawChanceCard() {
            const player = gameState.players[gameState.currentPlayer];
            const cardIndex = Math.floor(Math.random() * chanceCards.length);
            const card = chanceCards[cardIndex];
            
            logMessage(`${player.name} вытянул карту Шанс: "${card.text}"`);
            
            handleCard(card);
        }

        // Вытягивание карты общественной казны
        function drawChestCard() {
            const player = gameState.players[gameState.currentPlayer];
            const cardIndex = Math.floor(Math.random() * chestCards.length);
            const card = chestCards[cardIndex];
            
            logMessage(`${player.name} вытянул карту Общественной казны: "${card.text}"`);
            
            handleCard(card);
        }

        // Обработка карты
        function handleCard(card) {
            const player = gameState.players[gameState.currentPlayer];
            
            switch (card.action) {
                case 'collect':
                    player.money += card.amount;
                    logMessage(`${player.name} получает ₽${card.amount}.`);
                    break;
                    
                case 'pay':
                    player.money -= card.amount;
                    logMessage(`${player.name} платит ₽${card.amount}.`);
                    break;
                    
                case 'move':
                    const oldPosition = player.position;
                    player.position = card.destination;
                    
                    // Проверка на прохождение старта
                    if (player.position < oldPosition && card.destination !== 0) {
                        player.money += 200;
                        logMessage(`${player.name} прошел старт и получил ₽200.`);
                    }
                    
                    logMessage(`${player.name} перемещается на поле "${boardCells[card.destination].name}".`);
                    handleCellAction();
                    break;
                    
                case 'goto':
                    if (card.destination === 10) {
                        goToJail();
                    }
                    break;
                    
                case 'forward':
                    player.position = (player.position + card.steps) % 40;
                    logMessage(`${player.name} перемещается на ${card.steps} шагов вперед.`);
                    handleCellAction();
                    break;
                    
                case 'payall':
                    for (let i = 0; i < gameState.players.length; i++) {
                        if (i !== gameState.currentPlayer) {
                            player.money -= card.amount;
                            gameState.players[i].money += card.amount;
                            logMessage(`${player.name} платит ₽${card.amount} игроку ${gameState.players[i].name}.`);
                        }
                    }
                    break;
                    
                case 'collectall':
                    for (let i = 0; i < gameState.players.length; i++) {
                        if (i !== gameState.currentPlayer) {
                            player.money += card.amount;
                            gameState.players[i].money -= card.amount;
                            logMessage(`${player.name} получает ₽${card.amount} от игрока ${gameState.players[i].name}.`);
                        }
                    }
                    break;
                    
                case 'getoutofjail':
                    logMessage(`${player.name} получает карту освобождения из тюрьмы.`);
                    break;
            }
            
            updatePlayerTokens();
        }

        // Завершение хода
        function endTurn() {
            if (!gameState.hasRolled) return;
            
            gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
            gameState.hasRolled = false;
            
            logMessage(`Ход переходит к ${gameState.players[gameState.currentPlayer].name}.`);
            updateUI();
            
            // Проверка на конец игры
            checkGameEnd();
        }

        // Показать модальное окно собственности
        function showPropertyModal(cell) {
            modalPropertyName.textContent = cell.name;
            modalPropertyPrice.textContent = `Цена: ₽${cell.price}`;
            modalPropertyRent.textContent = `Аренда: ₽${cell.rent}`;
            
            if (cell.owner !== null) {
                modalPropertyOwner.textContent = `Владелец: ${gameState.players[cell.owner - 1].name}`;
                modalBuyButton.style.display = 'none';
            } else {
                modalPropertyOwner.textContent = 'Владелец: Нет';
                modalBuyButton.style.display = 'block';
                
                // Проверка возможности покупки
                const player = gameState.players[gameState.currentPlayer];
                const playerPosition = player.position;
                
                if (playerPosition === cell.id && player.money >= cell.price && gameState.hasRolled) {
                    modalBuyButton.disabled = false;
                } else {
                    modalBuyButton.disabled = true;
                }
            }
            
            propertyModal.style.display = 'flex';
        }

        // Закрыть модальное окно собственности
        function closePropertyModal() {
            propertyModal.style.display = 'none';
        }

        // Добавление сообщения в лог
        function logMessage(message) {
            const logEntry = document.createElement('div');
            logEntry.classList.add('log-entry');
            logEntry.textContent = message;
            gameLogElement.insertBefore(logEntry, gameLogElement.firstChild);
        }

        // Проверка на конец игры
        function checkGameEnd() {
            gameState.players.forEach(player => {
                if (player.money < 0) {
                    gameOver();
                }
            });
        }

        // Конец игры
        function gameOver() {
            gameState.gameOver = true;
            
            const player1Money = gameState.players[0].money;
            const player2Money = gameState.players[1].money;
            
            let winnerName;
            
            if (player1Money <= 0) {
                winnerName = gameState.players[1].name;
            } else if (player2Money <= 0) {
                winnerName = gameState.players[0].name;
            } else if (player1Money > player2Money) {
                winnerName = gameState.players[0].name;
            } else if (player2Money > player1Money) {
                winnerName = gameState.players[1].name;
            } else {
                winnerName = "Ничья!";
            }
            
            winnerMessage.textContent = `${winnerName} победил!`;
            winnerModal.style.display = 'flex';
        }

        // Перезапуск игры
        function restartGame() {
            // Сброс игрового состояния
            gameState.players = [
                { id: 1, name: "Игрок 1", money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 },
                { id: 2, name: "Игрок 2", money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0 }
            ];
            
            gameState.currentPlayer = 0;
            gameState.dice = [1, 1];
            gameState.hasRolled = false;
            gameState.gameOver = false;
            
            // Сброс владения собственностью
            boardCells.forEach(cell => {
                if (cell.type === 'property' || cell.type === 'railroad' || cell.type === 'utility') {
                    cell.owner = null;
                }
            });
            
            // Закрытие модальных окон
            winnerModal.style.display = 'none';
            propertyModal.style.display = 'none';
            
            // Обновление UI
            updateUI();
            
            // Очистка лога
            gameLogElement.innerHTML = '';
            
            // Первоначальное сообщение
            logMessage("Игра началась! Ход игрока 1.");
        }

        // Запуск игры
        window.addEventListener('load', initGame);
        window.addEventListener('resize', function() {
            setTimeout(updatePlayerTokens, 100);
        });
