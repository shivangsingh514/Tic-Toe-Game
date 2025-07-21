import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSound } from "@/hooks/useSound";

type Player = 'X' | 'O';
type Board = (Player | null)[];
type GameResult = 'win' | 'draw' | null;

interface GameState {
  board: Board;
  currentPlayer: Player;
  gameActive: boolean;
  winner: Player | null;
  winningPattern: number[] | null;
  scores: {
    X: number;
    O: number;
    draws: number;
  };
}

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameActive: true,
    winner: null,
    winningPattern: null,
    scores: { X: 0, O: 0, draws: 0 }
  });

  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const { playSound, toggleSound, isSoundEnabled } = useSound();

  // Play start sound when game begins
  useEffect(() => {
    if (!gameStarted) {
      playSound('start');
      setGameStarted(true);
    }
  }, [playSound, gameStarted]);

  const checkWinner = (board: Board): { winner: Player | null; pattern: number[] | null } => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a] as Player, pattern };
      }
    }
    return { winner: null, pattern: null };
  };

  const checkDraw = (board: Board): boolean => {
    return !board.includes(null);
  };

  const handleSquareClick = (index: number) => {
    if (!gameState.gameActive || gameState.board[index]) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const { winner, pattern } = checkWinner(newBoard);
    const isDraw = !winner && checkDraw(newBoard);

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
      gameActive: !winner && !isDraw,
      winner,
      winningPattern: pattern
    }));

    playSound('move');

    if (winner) {
      setGameResult('win');
      setShowModal(true);
      setTimeout(() => playSound('win'), 300); // Delay for better effect
      
      // Update scores
      setGameState(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          [winner]: prev.scores[winner] + 1
        }
      }));
    } else if (isDraw) {
      setGameResult('draw');
      setShowModal(true);
      setTimeout(() => playSound('draw'), 300);
      
      // Update draw count
      setGameState(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          draws: prev.scores.draws + 1
        }
      }));
    }
  };

  const resetGame = () => {
    playSound('reset');
    setGameState(prev => ({
      ...prev,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameActive: true,
      winner: null,
      winningPattern: null
    }));
    setShowModal(false);
    setGameResult(null);
  };

  const newGame = () => {
    playSound('start');
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameActive: true,
      winner: null,
      winningPattern: null,
      scores: { X: 0, O: 0, draws: 0 }
    });
    setShowModal(false);
    setGameResult(null);
  };

  const getGameStatus = () => {
    if (!gameState.gameActive) {
      if (gameState.winner) {
        return `Player ${gameState.winner} wins!`;
      }
      return "It's a draw!";
    }
    return "Game in progress...";
  };

  return (
    <>
      {/* Game Status Display */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium border border-white/20"
        >
          {getGameStatus()}
        </motion.div>
      </div>

      {/* Sound Toggle Button */}
      <div className="fixed top-4 right-4 z-40">
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            const enabled = toggleSound();
            playSound('click');
          }}
          onMouseEnter={() => playSound('hover')}
          className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20 text-white"
          title={isSoundEnabled() ? "Disable sounds" : "Enable sounds"}
        >
          {isSoundEnabled() ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Main Game Container */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        
        {/* Game Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Tic Tac Toe
          </h1>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium">Current Player:</span>
              <motion.div 
                key={gameState.currentPlayer}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  gameState.currentPlayer === 'X' ? 'piece-x' : 'piece-o'
                }`}
              >
                {gameState.currentPlayer}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8 max-w-xs mx-auto"
        >
          {gameState.board.map((cell, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: gameState.gameActive && !cell ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSquareClick(index)}
              onMouseEnter={() => gameState.gameActive && !cell && playSound('hover')}
              className={`game-square w-24 h-24 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-4xl font-bold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 cursor-pointer ${
                gameState.winningPattern?.includes(index) ? 'winning-square' : ''
              }`}
              disabled={!gameState.gameActive || !!cell}
            >
              <AnimatePresence>
                {cell && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`${cell === 'X' ? 'piece-x' : 'piece-o'}`}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </motion.div>

        {/* Game Stats */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-1">Player X</div>
            <div className="text-2xl font-bold piece-x">{gameState.scores.X}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-1">Draws</div>
            <div className="text-2xl font-bold text-gray-400">{gameState.scores.draws}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-1">Player O</div>
            <div className="text-2xl font-bold piece-o">{gameState.scores.O}</div>
          </div>
        </motion.div>

        {/* Game Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex space-x-4"
        >
          <Button 
            onClick={resetGame}
            onMouseEnter={() => playSound('hover')}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Game
          </Button>
          <Button 
            onClick={newGame}
            onMouseEnter={() => playSound('hover')}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Play className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </motion.div>
      </div>

      {/* Win/Draw Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-white max-w-sm">
          <DialogTitle className="sr-only">
            {gameResult === 'win' ? `Player ${gameState.winner} Wins!` : "It's a Draw!"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {gameResult === 'win' 
              ? `Player ${gameState.winner} has won this round of tic-tac-toe.` 
              : 'This round of tic-tac-toe ended in a draw.'}
          </DialogDescription>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-4"
          >
            {/* Winner Display */}
            <div className="mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
              >
                {gameResult === 'win' ? (
                  <span className="text-3xl font-bold text-gray-900">
                    {gameState.winner}
                  </span>
                ) : (
                  <Trophy className="w-8 h-8 text-gray-900" />
                )}
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">
                {gameResult === 'win' ? `Player ${gameState.winner} Wins!` : "It's a Draw!"}
              </h2>
              <p className="text-gray-300">
                {gameResult === 'win' ? 'Congratulations!' : 'Good game!'}
              </p>
            </div>
            
            {/* Modal Actions */}
            <div className="flex space-x-3">
              <Button 
                onClick={resetGame}
                onMouseEnter={() => playSound('hover')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Play Again
              </Button>
              <Button 
                onClick={() => setShowModal(false)}
                onMouseEnter={() => playSound('hover')}
                variant="secondary"
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
