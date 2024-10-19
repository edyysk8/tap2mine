from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes
import logging

# Configurações de log
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

class Tap2EarnBot:
    def __init__(self, token):
        self.application = ApplicationBuilder().token(token).build()
        
        # Estado inicial do jogo
        self.user_data = {}
        
        self.init_handlers()

    def init_handlers(self):
        self.application.add_handler(CommandHandler('start', self.start))
        self.application.add_handler(CallbackQueryHandler(self.button_handler))

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        user_id = update.effective_user.id
        if user_id not in self.user_data:
            self.user_data[user_id] = {
                'coins': 100,
                'automatic_coins': 0,
                'upgrade_cost': 100,
                'level': 1
            }
        
        message = f"""
        *Bem-vindo ao Tap2Earn!*\n
        Moedas: 💰 {self.user_data[user_id]['coins']}\n
        Nível: {self.user_data[user_id]['level']}\n
        Ganhe moedas clicando abaixo!
        """
        await update.message.reply_text(message, parse_mode='Markdown', reply_markup=self.main_menu_keyboard())

    def main_menu_keyboard(self):
        keyboard = [
            [InlineKeyboardButton("💰 Ganhar moedas", callback_data='earn')],
            [InlineKeyboardButton("⚙️ Upgrades", callback_data='upgrades')]
        ]
        return InlineKeyboardMarkup(keyboard)

    async def button_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()
        
        user_id = query.from_user.id
        if user_id not in self.user_data:
            self.user_data[user_id] = {
                'coins': 100,
                'automatic_coins': 0,
                'upgrade_cost': 100,
                'level': 1
            }

        data = query.data
        if data == 'earn':
            self.user_data[user_id]['coins'] += 1  # Simula ganho de moedas
            coins_message = f"Você ganhou 1 moeda! Total de moedas: 💰 {self.user_data[user_id]['coins']}"
            await query.edit_message_text(coins_message, parse_mode='Markdown', reply_markup=self.main_menu_keyboard())
        elif data == 'upgrades':
            await self.upgrade_handler(update, user_id)

    async def upgrade_handler(self, update: Update, user_id):
        current_cost = self.user_data[user_id]['upgrade_cost']
        if self.user_data[user_id]['coins'] >= current_cost:
            self.user_data[user_id]['coins'] -= current_cost
            self.user_data[user_id]['automatic_coins'] += 1  # Aumenta ganho automático
            self.user_data[user_id]['upgrade_cost'] = int(current_cost * 1.5)  # Aumenta o custo do próximo upgrade
            
            upgrade_message = f"Upgrade comprado! Ganho automático: {self.user_data[user_id]['automatic_coins']} Moedas/segundo\n" \
                              f"Novo custo de upgrade: {self.user_data[user_id]['upgrade_cost']} Moedas."
        else:
            upgrade_message = "Você não tem moedas suficientes para comprar um upgrade."
        
        await update.callback_query.edit_message_text(upgrade_message, parse_mode='Markdown', reply_markup=self.main_menu_keyboard())

    def run(self):
        self.application.run_polling()

if __name__ == '__main__':
    TOKEN = '7134753491:AAGTKIZNy657XmWCDn4NM6b7QBCAUx5cFk0'  # Insira o token do seu bot aqui
    tap2earn_bot = Tap2EarnBot(TOKEN)
    tap2earn_bot.run()
