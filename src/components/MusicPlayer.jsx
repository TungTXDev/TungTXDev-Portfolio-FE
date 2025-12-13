import { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import YouTube from 'react-youtube';
import { useMusic } from '@/contexts/MusicContext';
import musicAnimation from '@/animations/playerMusicAnimation.json';

const MusicPlayer = () => {
    const { isPlaying, setIsPlaying, setCurrentSong } = useMusic();
    const lottieRef = useRef(null);
    const youtubePlayerRef = useRef(null);

    // Set bài hát mặc định khi component mount
    useEffect(() => {
        setCurrentSong({
            title: "Âm Thầm Bên Em",
            artist: "Sơn Tùng M-TP",
            youtubeId: "Fa5B7Jt0u38"
        });
    }, [setCurrentSong]);

    // Control Lottie animation based on playing state
    useEffect(() => {
        if (lottieRef.current) {
            if (isPlaying) {
                lottieRef.current.play();
            } else {
                lottieRef.current.pause();
            }
        }
    }, [isPlaying]);

    const onYouTubeReady = (event) => {
        youtubePlayerRef.current = event.target;
        youtubePlayerRef.current.setVolume(50);
    };

    const onYouTubeStateChange = (event) => {
        setIsPlaying(event.data === 1);
    };

    const togglePlay = () => {
        if (!youtubePlayerRef.current) return;
        isPlaying ? youtubePlayerRef.current.pauseVideo() : youtubePlayerRef.current.playVideo();
    };

    return (
        <>
            <button
                onClick={togglePlay}
                className="group fixed bottom-44 right-5 z-40 transition-all duration-300 hover:scale-110"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Button */}
                <div className="relative w-16 h-16 rounded-full backdrop-blur-md bg-black/40 border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 w-full h-full">
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={musicAnimation}
                            loop
                            autoplay={false}
                        />
                    </div>
                </div>
            </button>

            <div className="hidden">
                <YouTube
                    videoId="Fa5B7Jt0u38"
                    opts={{
                        height: '0',
                        width: '0',
                        playerVars: { autoplay: 0, controls: 0 }
                    }}
                    onReady={onYouTubeReady}
                    onStateChange={onYouTubeStateChange}
                />
            </div>
        </>
    );
};

export default MusicPlayer;
