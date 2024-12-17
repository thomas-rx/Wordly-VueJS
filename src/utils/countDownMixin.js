export default{
  methods : {
    /**
     * Set up the countDown just before the game starts
     */
    startCountDown(){

    },
    /**
     * Callback pour l'événement "end"
     */
    onCountdownEnd() {
      console.log('Le compte à rebours est terminé.');
      // Ajoutez ici toute logique supplémentaire à exécuter lorsque le compte à rebours atteint 0
    },
  }
}