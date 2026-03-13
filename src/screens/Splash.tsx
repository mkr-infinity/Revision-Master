import React, { useEffect } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

interface SplashProps {
  onComplete?: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const { state } = useAppContext();
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#4c0b8d] via-[#7f13ec] to-[#0ea5e9]"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-10 md:p-14 bg-white/10 dark:bg-black/30 backdrop-blur-2xl rounded-xl border border-white/20 shadow-[0_0_40px_rgba(127,19,236,0.3)] max-w-md w-[90%] mx-auto">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-10"
        >
          <div className="absolute -inset-8 bg-white/30 blur-[40px] rounded-full animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-tr from-white to-cyan-400 blur-md rounded-full opacity-50"></div>
          <div className="relative flex items-center justify-center w-28 h-28 bg-white/10 rounded-[2rem] border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] overflow-hidden">
            <img src={state.user.appIcon || "/app-icon-1.svg"} alt="App Logo" className="w-full h-full object-cover" />
            <Sparkles
              size={24}
              className="absolute -top-2 -right-2 text-yellow-300 animate-bounce"
            />
            <Wand2
              size={20}
              className="absolute -bottom-1 -left-2 text-cyan-300 opacity-80"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center space-y-5"
        >
          <h1 className="text-white tracking-tighter text-5xl md:text-6xl font-bold leading-none">
            Revision
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Master
            </span>
          </h1>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          <p className="text-white/80 text-sm font-medium italic tracking-wide pt-2">
            "The secret of getting ahead is getting started."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Splash;
