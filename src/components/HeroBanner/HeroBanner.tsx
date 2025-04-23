import React, { useState, useRef, useEffect } from 'react';
import styles from './HeroBanner.module.css';

interface Video {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: string;
  badge?: string;
}

const HeroBanner: React.FC = () => {
  // Use videos from public folder based on the file listing
  const videoList: Video[] = [
    {
      id: '1',
      title: 'TOOTHPASTE FORMULA',
      subtitle: 'FRESH BREATH',
      description: 'Innovative toothpaste formula that provides long-lasting fresh breath. Protects against cavities and strengthens enamel. The secret is revealed in this video.',
      videoUrl: '/paste1.mp4',
      thumbnailUrl: '/paste1_thumbnail.jpg',
      views: '1.2M',
      badge: '#1 Series Today'
    },
    {
      id: '2',
      title: 'NESQUIK TRUTH',
      subtitle: 'CHOCOLATE FLAVOR',
      description: 'Quick dissolving chocolate drink loved by kids and adults. The perfect start to your day. The secret is revealed in this video.',
      videoUrl: '/neskvik2.mp4',
      thumbnailUrl: '/neskvik2_thumbnail.jpg',
      views: '982K'
    },
    {
      id: '3',
      title: 'NOSE CONTROLLERS',
      subtitle: 'BREATHE FREELY',
      description: 'Revealing how controllers are made out of... The secret manufacturing process the industry doesn\'t want you to know.',
      videoUrl: '/nose3.mp4',
      thumbnailUrl: '/nose3_thumbnail.jpg',
      views: '756K'
    },
    {
      id: '4',
      title: 'CHEETOS...',
      subtitle: 'CORN CHIPS',
      description: 'Crunchy corn chips with rich cheese flavor. Impossible to stop eating once you start. The secret is revealed in this video.',
      videoUrl: '/cheetos4.mp4',
      thumbnailUrl: '/cheetos4_thumbnail.jpg',
      views: '632K'
    },
    {
      id: '4',
      title: 'WELCOME',
      subtitle: 'DIG DEEPLE',
      description: 'they said we were inactive.truth is: we got silenced. the dark puppet masters got nervous.',
      videoUrl: '/welcome.mp4',
      thumbnailUrl: '/welcome_thumbnail.jpg',
      views: '300K'
    },
    {
      id: '5',
      title: 'JEWS MADE 9/11',
      subtitle: 'ACCESS DENIED',
      description: 'ACCESS DENIED',
      videoUrl: '/placeholder.mp4',
      thumbnailUrl: '/coming_soon_thumbnail.jpg',
      views: '---',
      badge: 'ACCESS DENIED'
    },
  ];

  const [currentVideo, setCurrentVideo] = useState<Video>(videoList[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setIsVideoLoaded] = useState(false);
  const [, setAutoplayAttempted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Load the video and show a preview
  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.volume = volume; // Set volume directly
        
        // Show a video frame by seeking slightly into the video
        try {
          await videoRef.current.play();
          videoRef.current.pause();
          // Seek to a frame that shows content (around 0.5 second in)
          videoRef.current.currentTime = 0.5;
          setIsVideoLoaded(true);
        } catch (e) {
          console.log('Autoplay prevented, using fallback');
          // If autoplay is not allowed, still try to show a frame
          videoRef.current.currentTime = 0.5;
          setIsVideoLoaded(true);
        }
        setAutoplayAttempted(true);
      }
    };
    
    loadVideo();
  }, [currentVideo]); // Remove volume from dependencies
  
  // Separate effect to handle volume changes without affecting video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Ensure video thumbnails play for preview - rewritten to avoid blinking
  useEffect(() => {
    // Only set up the thumbnail videos once
    const setupThumbnails = () => {
      const thumbnailVideos = document.querySelectorAll<HTMLVideoElement>(`.${styles.thumbnailVideo}`);
      thumbnailVideos.forEach(video => {
        // Only set up if not already playing
        if (video.paused) {
          // Don't reload if already loaded
          if (video.readyState === 0) {
            video.load();
          }
          video.currentTime = 0.5; // Set to a frame that shows content
          
          // Add error handling to avoid console errors
          const playVideo = () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Ignore autoplay errors, they're expected in some browsers
                setTimeout(playVideo, 1000); // Retry after a second
              });
            }
          };
          
          playVideo();
        }
      });
    };
    
    // Initial setup
    setupThumbnails();
    
    // Also set up a timer to ensure videos continue playing
    const intervalId = setInterval(setupThumbnails, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Run only once on component mount, not on every videoList change

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setIsPlaying(false);
    setIsVideoLoaded(false);
    setAutoplayAttempted(false);
    if (videoRef.current) {
      videoRef.current.load();
      // Auto-scroll to top when selecting a new video
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      // If volume is set to 0, mute the video but don't affect playback
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        // If previously muted, unmute but don't affect playback
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className={`${styles.heroBanner} ${isPlaying ? styles.videoPlaying : ''}`}>
      <div className={styles.videoBackground}>
        <video 
          ref={videoRef}
          muted={!isPlaying || isMuted}
          loop={!isPlaying}
          playsInline
          preload="auto"
          className={styles.videoPlayer}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src={currentVideo.videoUrl} type={currentVideo.videoUrl.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
        </video>
        <div className={`${styles.videoOverlay} ${isPlaying ? styles.playingOverlay : ''}`}></div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.videoInfo}>
          <div className={styles.badgeContainer}>
            <div className={styles.topBadge}>TOP 10</div>
            {currentVideo.badge && <div className={styles.badgeText}>{currentVideo.badge}</div>}
          </div>
          
          <h1 className={styles.videoTitle}>{currentVideo.title}</h1>
          <h2 className={styles.videoSubtitle}>{currentVideo.subtitle}</h2>
          <p className={styles.videoDescription}>{currentVideo.description}</p>

          <div className={styles.actions}>
            <button className={styles.playButton} onClick={handlePlayClick}>
              {isPlaying ? (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor" />
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  <span>Watch</span>
                </>
              )}
            </button>

            <div className={styles.volumeControl}>
              <button className={styles.muteButton} onClick={toggleMute}>
                {isMuted ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
                  </svg>
                ) : volume > 0.5 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
                  </svg>
                ) : volume > 0 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z" fill="currentColor"/>
                  </svg>
                )}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolumeChange} 
                className={styles.volumeSlider}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.videoListSection}>
        <h3 className={styles.sectionTitle}>What to Watch</h3>
        <div className={styles.videoList}>
          {videoList.map((video) => (
            <div 
              key={video.id}
              className={`${styles.videoCard} ${currentVideo.id === video.id ? styles.activeVideo : ''} ${video.id === '5' ? styles.comingSoonCard : ''}`}
              onClick={() => video.id !== '5' && handleVideoSelect(video)}
            >
              <div className={styles.thumbnailContainer}>
                {/* Video preview as thumbnail */}
                <video 
                  className={styles.thumbnailVideo}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  src={video.videoUrl}
                >
                </video>
                <div className={styles.videoViews}>{video.views}</div>
                {video.id === '5' && <div className={styles.comingSoonOverlay}>COMING SOON</div>}
                {video.id !== '5' && (
                  <div className={styles.playIconOverlay}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.videoCardInfo}>
                <h4>{video.title}</h4>
                <p>{video.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner; 