import { motion } from "framer-motion";

export default function AnimatedLogo() {
  return (
    <motion.div
      className="text-3xl font-bold flex items-center"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <span className="text-cyan-400">🤖</span>
      <span className="ml-2 bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">Neural Nexus</span>
    </motion.div>
  );
}
