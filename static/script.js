class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.init();
    }

    async init() {
        try {
            // Fetch all sounds from the API
            const response = await fetch('/api/sounds');
            const sounds = await response.json();
            
            // Initialize each sound button
            const soundButtons = document.querySelectorAll('.sound-button');
            console.log(soundButtons);
            soundButtons.forEach((soundButtons) => {
                console.log(soundButtons); // Log each button to confirm it’s selected correctly
            });
            soundButtons.forEach(button => {
                const soundName = button.getAttribute('data-sound');
                const soundData = sounds.find(s => s.name === soundName);
                if (soundData) {
                    this.initializeSound(button, soundData);
                }
            });
        } catch (error) {
            console.error('Error initializing sounds:', error);
        }
    }

    initializeSound(button, soundData) {
        // Create audio element
        const audio = new Audio();
        audio.loop = true;
        
        // Get volume control elements
        const volumeControl = button.parentElement.querySelector('.volume-control');
        const volumeSlider = volumeControl.querySelector('.volume-slider');
        
        // Set initial volume
        const initialVolume = soundData.default_volume || 0.5;
        volumeSlider.value = initialVolume * 100;
        
        // Store sound data
        this.sounds.set(soundData.name, {
            audio: audio,
            isPlaying: false,
            volume: initialVolume,
            data: soundData
        });

        // Button click handler
        button.addEventListener('click', () => {
            this.toggleSound(soundData.name, button, volumeControl);
        });

        // Volume change handler
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            const sound = this.sounds.get(soundData.name);
            if (sound) {
                sound.volume = volume;
                if (sound.audio) {
                    sound.audio.volume = volume;
                }
            }
        });
    }

    async toggleSound(soundId, button, volumeControl) {

        const sound = this.sounds.get(soundId);
        
        if (!sound) {
            console.error('Sound not found:', soundId);
            return;
        }
        
        try {
            if (!sound.isPlaying) {
                if (!sound.audio.src) {
                    sound.audio.src = `${sound.data.file_path}`;
                }
                sound.audio.volume = sound.volume;
                await sound.audio.play();
                sound.isPlaying = true;
                button.classList.add('active');
                volumeControl.classList.remove('hidden');
            } else {
                sound.audio.pause();
                sound.audio.currentTime = 0;
                sound.isPlaying = false;
                button.classList.remove('active');
                volumeControl.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error toggling sound:', error);
        }
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const soundManager = new SoundManager();
});

