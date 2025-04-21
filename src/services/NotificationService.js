class NotificationService {
  constructor() {
    this.audio = null;
    this.soundUrls = [
      '/notification.mp3',
      'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      'https://assets.mixkit.co/active_storage/sfx/943/943-preview.mp3',
      'https://assets.mixkit.co/active_storage/sfx/1626/1626-preview.mp3'
    ];
    this.initializeAudio();
  }

  async initializeAudio() {
    for (const url of this.soundUrls) {
      try {
        const audio = new Audio(url);
        
        // Create a promise that resolves when the audio is loaded
        const loadPromise = new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', () => resolve(), { once: true });
          audio.addEventListener('error', (e) => reject(e), { once: true });
        });

        // Start loading the audio
        audio.load();
        
        // Wait for the audio to be loaded
        await loadPromise;
        
        // Test if audio can be played silently
        audio.volume = 0;
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
        
        this.audio = audio;
        console.log('Successfully initialized audio with URL:', url);
        break; // Stop if we found a working audio source
      } catch (error) {
        console.warn(`Failed to initialize audio with URL ${url}:`, error);
        continue; // Try next URL if available
      }
    }

    if (!this.audio) {
      console.error('Failed to initialize audio with all available URLs');
    }
  }

  async playNotification() {
    if (!this.audio) {
      await this.initializeAudio(); // Try to initialize again if not available
    }

    try {
      if (this.audio) {
        if (this.audio.paused) {
          this.audio.currentTime = 0;
          await this.audio.play();
        } else {
          // If already playing, create a new Audio instance for overlapping sounds
          const tempAudio = new Audio(this.audio.src);
          await tempAudio.play();
        }
      }
    } catch (error) {
      console.error('Failed to play notification sound:', error);
      // If playback fails, try to reinitialize with next URL
      const currentIndex = this.soundUrls.indexOf(this.audio.src);
      if (currentIndex < this.soundUrls.length - 1) {
        this.audio = null;
        await this.initializeAudio();
      }
    }
  }
}

export const notificationService = new NotificationService(); 