import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../api'
import './ChatBot.css'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m here to help you with MindSettler services. How can I assist you today?',
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Send to backend
      const conversationHistory = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(0, -1), // exclude the current message
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot')
      }

      const data = await response.json()

      // Add bot response
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.reply },
      ])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to parse text and render links
  const renderMessageWithLinks = (text) => {
    // Split by spaces/newlines to process words individually while preserving whitespace
    const parts = text.split(/(\s+)/)

    return parts.map((part, i) => {
      // Check for external URLs
      if (part.match(/^(https?:\/\/|www\.)/)) {
        let href = part
        if (part.startsWith('www.')) {
          href = `http://${part}`
        }
        // Remove trailing punctuation
        const cleanHref = href.replace(/[.,;!?)]+$/, '')
        const punctuation = part.slice(cleanHref.length)

        return (
          <span key={i}>
            <a
              href={cleanHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007bff', textDecoration: 'underline' }}
            >
              {cleanHref}
            </a>
            {punctuation}
          </span>
        )
      }
      // Check for internal paths (must start with / and have at least 1 letter)
      else if (part.startsWith('/') && part.length > 1 && !part.includes('//')) {
        // Remove trailing punctuation
        const to = part.replace(/[.,;!?)]+$/, '')
        const punctuation = part.slice(to.length)

        // Basic valid path check
        if (/^[\w\-/]+$/.test(to)) {
          return (
            <span key={i}>
              <Link to={to} style={{ color: '#007bff', textDecoration: 'underline' }}>{to}</Link>
              {punctuation}
            </span>
          )
        }
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <>
      {/* Chat Button */}
      <button
        className={`chat-button ${isOpen ? 'chat-button-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>MindSettler Assistant</h3>
            <button
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'
                  }`}
              >
                <div className="message-content">
                  {msg.role === 'assistant'
                    ? renderMessageWithLinks(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot-message">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="chat-send-button"
            >
              {isLoading ? '...' : '➤'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
