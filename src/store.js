import {createStore} from "vuex";

export const store = createStore({
    state(){
        return {
            gamesHistory : [],
            statistics : {avgPT : 0, avgAttempts : 0, victoryP : 0}
        }
    },
    getters : {
        getGameHistory(state){
            return state.gamesHistory;
        },
        getStatistics(state){
            return state.statistics;
        }
    },
    mutations: {
        newGame(state, gameState){
            state.gamesHistory.unshift(gameState);
        }
    }
})