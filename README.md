# Wordly - A Vue.js Word Game 🎮

Wordly is an engaging word-guessing game built with Vue.js, inspired by the popular game Wordle. Test your vocabulary and deduction skills by trying to guess the hidden word within a limited number of attempts!

## 🎯 Features

- 🕹️ Daily word challenges
- ⏱️ Time-based gameplay (10 minutes per game)
- 📊 Game history and statistics
- 🏆 Weekly leaderboard
- 💾 Auto-save game progress
- 🎨 Sleek and responsive design
- 🌙 Dark mode interface
- 🎉 Victory animations

## 🚀 Getting Started

### Prerequisites

- Node.js v20.9.0 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thomas-rx/Wordly-VueJS.git
cd wordly
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VUE_APP_API_URL=your_api_url
VUE_APP_FIREBASE_API_KEY=your_api_key
VUE_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
VUE_APP_FIREBASE_PROJECT_ID=your_project_id
VUE_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VUE_APP_FIREBASE_APP_ID=your_app_id
VUE_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Development

Run the development server:
```bash
npm run serve
```

### Production Build

Create a production build:
```bash
npm run build
```

### Testing

Run the test suite:
```bash
npm run test
```

## 🎮 How to Play

1. Start a new game by clicking "Démarrer une partie"
2. Try to guess the 5-letter word within 6 attempts
3. After each guess:
   - Green tiles indicate correct letters in the right position
   - Yellow tiles indicate correct letters in the wrong position
   - Gray tiles indicate letters not in the word
4. Complete the word before the 10-minute timer runs out!

## 🛠️ Built With

- [Vue.js 3](https://vuejs.org/) - The Progressive JavaScript Framework
- [Vuex](https://vuex.vuejs.org/) - State Management
- [Firebase](https://firebase.google.com/) - Backend & Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Day.js](https://day.js.org/) - Date Management
- [Confetti-js](https://www.npmjs.com/package/confetti-js) - Victory Animations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/thomas-rx/Wordly-VueJS/issues).
