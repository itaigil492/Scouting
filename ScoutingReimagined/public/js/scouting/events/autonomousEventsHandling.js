function autonomous_start() {
    autonomousStartTime = gameVideo.currentTime;
    generateAllEvents();
    initializeEvents();
}