import React, { useState } from 'react';
import { auth } from '../config/firebase'; // Your Firebase client config
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         // After signup, sync with MongoDB
//         await fetch(`${process.env.REACT_APP_API_URL}/users/sync`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ 
//             uid: userCredential.user.uid, 
//             email: userCredential.user.email 
//           })
//         });
//       }
//       navigate('/');
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      // PINPOINT: Use the same API_BASE as App.tsx to ensure it hits the server
      const API_URL = "http://localhost:5000/api"; 
      
      await fetch(`${API_URL}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: userCredential.user.uid, 
          email: userCredential.user.email 
        })
      });

      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B151E] p-4">
      <div className="max-w-md w-full bg-[#1D2E3E] rounded-[2rem] p-10 border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-2 text-center">
          {isLogin ? "Welcome Back!" : "Join the Clan"}
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Save your village progress across devices.
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 font-bold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;