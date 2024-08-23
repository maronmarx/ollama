import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import 'animate.css';

const BotMessageWithInput = ({ message, onSend, botTyping }) => {
  const [showInput, setShowInput] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [words, setWords] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Fonction pour diviser le texte en mots
    const splitWords = () => {
      const text = message.text;
      const wordsArray = text.split(' ');
      setWords(wordsArray);
    };
    splitWords();
  }, [message]);

  useEffect(() => {
    setIsTyping(botTyping);
  }, [botTyping]);

  const handleSend = () => {
    if (userInput.trim() === '') {
      return; // Ne pas envoyer de message vide
    }
    onSend(userInput);
    setUserInput('');
    setShowInput(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleChange = (event) => {
    setUserInput(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm mb-4">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </div>
      {isTyping && <div className="text-sm italic text-gray-500 mb-4">Bot est en train de taper...</div>}
      <div className="flex items-center p-4">
        {showInput && (
          <div className="flex items-center w-full space-x-2">
            <textarea 
              ref={textareaRef}
              className="message-input w-full p-2 rounded-md focus:outline-none resize-none overflow-y-auto bg-gray-100"
              placeholder="Type your message..."
              value={userInput}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`message-submit p-2 rounded-md transition-colors duration-300 ${
                userInput.trim() ? 'bg-blue-100 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSend}
              disabled={userInput.trim() === ''}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BotMessageWithInput;
