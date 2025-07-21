import TicTacToe from "@/components/TicTacToe";

export default function Home() {
  return (
    <div className="min-h-screen background-animation flex items-center justify-center text-white relative overflow-hidden">
      {/* Floating Background Particles */}
      <div className="particle" style={{ top: '10%', left: '10%' }}></div>
      <div className="particle" style={{ top: '20%', right: '15%' }}></div>
      <div className="particle" style={{ bottom: '30%', left: '20%' }}></div>
      <div className="particle" style={{ bottom: '10%', right: '25%' }}></div>
      <div className="particle" style={{ top: '50%', left: '5%' }}></div>
      <div className="particle" style={{ top: '70%', right: '10%' }}></div>
      
      <TicTacToe />
    </div>
  );
}
