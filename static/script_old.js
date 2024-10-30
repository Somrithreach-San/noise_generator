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
            sounds.forEach(soundData => {
                const button = document.querySelector(`[data-sound="${soundData.name}"]`);
                if (button) {
                    this.initializeSound(button, soundData);
                }
            });
        } catch (error) {
            console.error('Error initializing sounds:', error);
        }
    }

    initializeSound(button, soundData) {
        const volumeControl = button.parentElement.querySelector('.volume-control');
        const volumeSlider = volumeControl.querySelector('.volume-slider');

        // Create audio element
        const audio = new Audio();
        audio.loop = true;
        
        this.sounds.set(soundData.name, {
            audio: audio,
            isPlaying: false,
            volume: soundData.default_volume,
            data: soundData
        });

        // Button click handler
        button.addEventListener('click', () => this.toggleSound(soundData.name, button, volumeControl));

        // Volume change handler
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            const sound = this.sounds.get(soundData.name);
            sound.volume = volume;
            sound.audio.volume = volume;
        });
    }

    // toggleSound(soundId, button, volumeControl) {
    //     const sound = this.sounds.get(soundId);
        
    //     if (!sound) {
    //         console.error('Sound not found:', soundId);
    //         return;
    //     }
        
    //     if (!sound.isPlaying) {
    //         try {
    //             if (!sound.audio.src) {
    //                 sound.audio.src = `/sounds/${sound.data.file_path}`;
    //             }
                
    //             sound.audio.volume = sound.volume;
    //             sound.audio.play().then(() => {
    //                 sound.isPlaying = true;
    //                 button.classList.add('active');
    //                 volumeControl.classList.remove('hidden');
    //             }).catch(error => {
    //                 console.error('Error playing sound:', error);
    //             });
    //         } catch (error) {
    //             console.error('Error playing sound:', error);
    //         }
    //     } else {
    //         sound.audio.pause();
    //         sound.audio.currentTime = 0;
    //         sound.isPlaying = false;
    //         button.classList.remove('active');
    //         volumeControl.classList.add('hidden');
    //     }
    // }
    async toggleSound(soundId, button, volumeControl) {
        const sound = this.sounds.get(soundId);
        
        if (!sound) {
            console.error('Sound not found:', soundId);
            return;
        }
        
        if (!sound.isPlaying) {
            try {
                if (!sound.audio.src) {
                    sound.audio.src = `/sounds/${sound.data.file_path}`;
                }
                
                sound.audio.volume = sound.volume;
                await sound.audio.play();
                sound.isPlaying=true;

            } catch (error) {
                console.error('Error playing sound:', error);
            }
        } else {
            sound.audio.pause();
            sound.audio.currentTime = 0;
            sound.isPlaying = false;
            button.classList.remove('active');
            volumeControl.classList.add('hidden');
        }
    }

    initializeSound(button, soundData) {
        const volumeControl = button.nextElementSibling;
        const volumeSlider = volumeControl.querySelector('.volume-slider');

        // Create audio element
        const audio = new Audio();
        audio.loop = true;
        
        // Set initial volume
        const initialVolume = soundData.default_volume || 0.5;
        volumeSlider.value = initialVolume * 100;
        
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
                sound.audio.volume = volume;
            }
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const soundManager = new SoundManager();
});
button.addEventListener('click',()=>{
    this.toggleSound(soundData.name, button, volumeControl)
});