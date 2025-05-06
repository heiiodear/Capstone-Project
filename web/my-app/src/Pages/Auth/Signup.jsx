import React from 'react' 
import {useState} from 'react' 

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    discord: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-950 mb-8 text-center">CREATE ACCOUNT</h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
          <div className="relative">
            <label className="absolute text-xs font-medium text-gray-500 px-2 bg-white left-4 -top-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <label className="absolute text-xs font-medium text-gray-500 px-2 bg-white left-4 -top-2">Tel.</label>
            <input
              type="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <label className="absolute text-xs font-medium text-gray-500 px-2 bg-white left-4 -top-2">Discord Account</label>
            <input
              type="text"
              name="discord"
              value={formData.discord}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <label className="absolute text-xs font-medium text-gray-500 px-2 bg-white left-4 -top-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <label className="absolute text-xs font-medium text-gray-500 px-2 bg-white left-4 -top-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-950 text-white font-medium py-3.5 rounded-lg hover:bg-indigo-900 active:scale-98 transition-all shadow-md"
          >
            SIGN IN
          </button>
        </form>
      </div>
      
      <div className="w-full md:w-1/2 bg-indigo-950 text-white p-8 flex flex-col justify-center">
        <div className="max-w-xs mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Project Name</h2>
          <p className="text-xl mb-8">Hello, there!</p>
          <button className="border border-white text-white font-medium py-2.5 px-8 rounded-full hover:bg-white hover:text-indigo-950 transition-all">
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;