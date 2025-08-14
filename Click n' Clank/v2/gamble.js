// gamble.js - Gambling mini-game logic for Click n' Clank v2

// Gambling configuration
const GAMBLING_MODES = {
    safe: {
        winChance: 0.7,
        payout: 1.5,
        name: 'Safe Bet',
        description: '70% chance to win 1.5x',
        color: '#4CAF50'
    },
    risky: {
        winChance: 0.4,
        payout: 3,
        name: 'Risky Bet', 
        description: '40% chance to win 3x',
        color: '#FF9800'
    },
    extreme: {
        winChance: 0.15,
        payout: 8,
        name: 'Extreme Bet',
        description: '15% chance to win 8x',
        color: '#F44336'
    }
};

export class GamblingManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.modal = null;
        this.wagerInput = null;
        this.placeBetBtn = null;
        this.resultDiv = null;
        this.isGambling = false;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.modal = document.getElementById('gambling-modal');
        this.wagerInput = document.getElementById('wager-input');
        this.placeBetBtn = document.getElementById('place-bet');
        this.resultDiv = document.getElementById('gambling-result');
        
        // Initialize wager input max value
        this.updateWagerLimits();
    }

    setupEventListeners() {
        // Modal controls
        const gambleBtn = document.getElementById('gamble-btn');
        const closeBtn = document.getElementById('close-modal');
        
        gambleBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Wager input validation
        this.wagerInput.addEventListener('input', () => this.validateWager());
        this.wagerInput.addEventListener('change', () => this.validateWager());

        // Quick wager buttons
        const wagerButtons = document.querySelectorAll('.wager-btn');
        wagerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const percentage = parseInt(btn.dataset.percentage);
                this.setWagerPercentage(percentage);
            });
        });

        // Odds selection
        const oddsInputs = document.querySelectorAll('input[name="odds"]');
        oddsInputs.forEach(input => {
            input.addEventListener('change', () => this.validateWager());
        });

        // Place bet button
        this.placeBetBtn.addEventListener('click', () => this.placeBet());
    }

    openModal() {
        this.updateWagerLimits();
        this.validateWager();
        this.resultDiv.innerHTML = '';
        this.resultDiv.classList.add('hidden');
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.isGambling = false;
    }

    updateWagerLimits() {
        const maxWager = Math.floor(this.gameState.gears);
        this.wagerInput.max = maxWager;
        
        if (parseInt(this.wagerInput.value) > maxWager) {
            this.wagerInput.value = maxWager;
        }

        // Update percentage button states
        const wagerButtons = document.querySelectorAll('.wager-btn');
        wagerButtons.forEach(btn => {
            const percentage = parseInt(btn.dataset.percentage);
            const amount = Math.floor(this.gameState.gears * (percentage / 100));
            btn.disabled = amount < 1;
            
            if (percentage === 100) {
                btn.textContent = `All In (${Math.floor(this.gameState.gears)})`;
            } else {
                btn.textContent = `${percentage}% (${amount})`;
            }
        });
    }

    setWagerPercentage(percentage) {
        const amount = Math.floor(this.gameState.gears * (percentage / 100));
        this.wagerInput.value = Math.max(1, amount);
        this.validateWager();
    }

    validateWager() {
        const wager = parseInt(this.wagerInput.value);
        const maxWager = Math.floor(this.gameState.gears);
        const minWager = 1;
        
        const isValid = wager >= minWager && wager <= maxWager && !isNaN(wager);
        
        this.placeBetBtn.disabled = !isValid || this.isGambling;
        
        if (wager > maxWager) {
            this.wagerInput.value = maxWager;
        } else if (wager < minWager && this.wagerInput.value !== '') {
            this.wagerInput.value = minWager;
        }

        return isValid;
    }

    getSelectedOdds() {
        const selectedInput = document.querySelector('input[name="odds"]:checked');
        return selectedInput ? selectedInput.value : 'safe';
    }

    async placeBet() {
        if (this.isGambling || !this.validateWager()) {
            return;
        }

        const wager = parseInt(this.wagerInput.value);
        const oddsType = this.getSelectedOdds();
        const odds = GAMBLING_MODES[oddsType];

        if (wager > this.gameState.gears) {
            this.gameState.showNotification('Insufficient gears!');
            return;
        }

        this.isGambling = true;
        this.placeBetBtn.disabled = true;
        this.placeBetBtn.textContent = 'Rolling...';

        // Deduct wager from gears
        this.gameState.gears -= wager;
        this.gameState.updateDisplay();

        // Show rolling animation
        this.showRolling();

        // Wait for suspense
        await this.sleep(2000 + Math.random() * 1000);

        // Determine if win or lose
        const isWin = Math.random() < odds.winChance;
        const result = this.calculateResult(wager, odds, isWin);

        // Update game state
        if (isWin) {
            this.gameState.gears += result.totalPayout;
        }

        // Show result
        this.showResult(result, odds);
        
        // Update display
        this.gameState.updateDisplay();
        this.updateWagerLimits();

        // Reset button
        this.placeBetBtn.disabled = false;
        this.placeBetBtn.textContent = 'Place Bet';
        this.isGambling = false;

        // Play sound effect
        if (isWin) {
            this.gameState.playUpgradeSound(); // Use upgrade sound for wins
        } else {
            this.gameState.playClickSound(); // Use click sound for losses
        }
    }

    calculateResult(wager, odds, isWin) {
        if (isWin) {
            const winnings = Math.round(wager * odds.payout);
            return {
                isWin: true,
                wager: wager,
                winnings: winnings - wager, // Net winnings
                totalPayout: winnings,
                multiplier: odds.payout
            };
        } else {
            return {
                isWin: false,
                wager: wager,
                winnings: 0,
                totalPayout: 0,
                multiplier: 0
            };
        }
    }

    showRolling() {
        this.resultDiv.innerHTML = `
            <div class="rolling-animation">
                <div class="dice-rolling">🎲</div>
                <p class="rolling-text">Rolling the dice...</p>
            </div>
        `;
        this.resultDiv.classList.remove('hidden');
    }

    showResult(result, odds) {
        const resultClass = result.isWin ? 'win' : 'loss';
        const resultIcon = result.isWin ? '🎉' : '💸';
        const resultText = result.isWin ? 'YOU WIN!' : 'YOU LOSE!';
        
        let detailText = '';
        if (result.isWin) {
            detailText = `
                <p class="result-details">
                    Wagered: ${result.wager} gears<br>
                    Won: ${result.winnings} gears<br>
                    Total payout: ${result.totalPayout} gears
                </p>
                <p class="result-multiplier">${odds.payout}x multiplier!</p>
            `;
        } else {
            detailText = `
                <p class="result-details">
                    Lost: ${result.wager} gears<br>
                    Better luck next time!
                </p>
            `;
        }

        this.resultDiv.innerHTML = `
            <div class="result-animation ${resultClass}">
                <div class="result-icon">${resultIcon}</div>
                <h3 class="result-title">${resultText}</h3>
                ${detailText}
                <div class="result-stats">
                    <small>Chance: ${Math.round(odds.winChance * 100)}% | Payout: ${odds.payout}x</small>
                </div>
            </div>
        `;

        this.resultDiv.classList.remove('hidden');

        // Show notification
        if (result.isWin) {
            this.gameState.showNotification(`🎉 Gambling win! +${result.winnings} gears!`);
        } else {
            this.gameState.showNotification(`💸 Gambling loss: -${result.wager} gears`);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Save/load functionality
    getSaveData() {
        return {
            // Currently no persistent gambling state to save
            // Could add gambling history, statistics, etc. in future
        };
    }

    loadSaveData(saveData) {
        // Nothing to load currently
        // Could restore gambling statistics, history, etc.
    }
}