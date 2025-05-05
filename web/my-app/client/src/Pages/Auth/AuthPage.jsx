import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const AuthPage = () => {
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState(location.pathname === "/login");

  const updatePageState = () => {
    setIsLoginPage(location.pathname === "/login");
  };

  React.useEffect(() => {
    updatePageState();
  }, [location.pathname]);

  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden">
      <AnimatePresence initial={false}>
        {isLoginPage ? (
          <>
            <motion.div
              key="login-sidebar"
              className="w-full sm:w-1/3 bg-indigo-950 text-white p-6 sm:p-10 flex flex-col justify-center h-40 sm:h-auto"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.5 }}
            >
              <div className="mb-4 sm:mb-16 ml-4 sm:ml-10">
                <h1 className="text-2xl sm:text-5xl font-bold mb-1 sm:mb-2">Project Name</h1>
                <p className="text-base sm:text-xl text-indigo-200">Welcome back!</p>
              </div>
              <button
                className="hidden lg:block ml-4 sm:ml-10 font-semibold text-white rounded-lg px-4 sm:px-6 py-2 w-28 sm:w-32 outline-1 outline-offset-1 outline-white
                      hover:bg-white hover:text-indigo-950 transition-transform active:scale-95"
              >
                Signup
              </button>
            </motion.div>
            
            <motion.div
              key="login-content"
              className="w-full sm:w-2/3 flex justify-center items-center p-6 sm:p-10 border-t sm:border-l sm:border-t-0 border-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<Login />} />
              </Routes>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              key="signup-content"
              className="w-full sm:w-2/3 flex justify-center items-center p-6 sm:p-10 border-t sm:border-l sm:border-t-0 border-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </motion.div>
            
            <motion.div
              key="signup-sidebar"
              className="w-full sm:w-1/3 bg-indigo-950 text-white p-6 sm:p-10 flex flex-col justify-center h-40 sm:h-auto"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.5 }}
            >
              <div className="max-w-xs mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Project Name</h2>
                <p className="text-xl mb-8">Hello, there!</p>
                <button
                  className="border border-white text-white font-medium py-2.5 px-8 rounded-lg hover:bg-white hover:text-indigo-950 transition-all"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;