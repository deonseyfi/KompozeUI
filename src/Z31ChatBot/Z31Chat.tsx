import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fade,
  Button,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import WebLogo from "../newlogo4.png";
import RobotBase from "../assets/z31body.png";
import RobotEyes from "../assets/eyes.png";
import RobotMouth from "../assets/mouth.png";
import RobotLights from "../assets/chestlights.png";
import RobotNameLight from "../assets/z31name.png";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  date: Date;
  preview: string;
}

// Animated Robot Component
const AnimatedRobot: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Base robot image */}
      <Box
        component="img"
        src={RobotBase}
        alt="Z31"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* Eyes with blinking animation */}
      <Box
        component="img"
        src={RobotEyes}
        alt="Eyes"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          animation: "blink 4s infinite",
        }}
      />

      {/* Mouth with talking animation */}
      <Box
        component="img"
        src={RobotMouth}
        alt="Mouth"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          animation: "talk 2s infinite",
        }}
      />

      {/* Chest lights with pulsing animation */}
      <Box
        component="img"
        src={RobotLights}
        alt="Lights"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          animation: "pulse 1.5s infinite",
        }}
      />

      {/* Name light with glow animation */}
      <Box
        component="img"
        src={RobotNameLight}
        alt="Z31 Name"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          animation: "glow 2s infinite alternate",
        }}
      />
    </Box>
  );
};

const Z31Chat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Z31, your AI assistant for analyzing Twitter accounts. I can help you understand tweet patterns, sentiment analysis, engagement metrics, and more. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Elon Musk Analysis",
      date: new Date(Date.now() - 86400000),
      preview: "Tweet sentiment analysis for @elonmusk...",
    },
    {
      id: "2",
      title: "Crypto Influencers",
      date: new Date(Date.now() - 172800000),
      preview: "Comparing engagement rates across...",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        text:
          data.response ||
          "I'll help you analyze that Twitter data. Could you provide more specific details about what you'd like to know?",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm Z31, your AI assistant for analyzing Twitter accounts. I can help you understand tweet patterns, sentiment analysis, engagement metrics, and more. What would you like to know?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
  };

  const handleBackToSite = () => {
    navigate("/"); // Navigate back to main site
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "#000",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {/* Mobile Menu Button */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          top: 16,
          left: sidebarOpen ? 296 : 16, // Move right when sidebar is open (280px sidebar + 16px)
          transition: "left 0.3s ease",
          zIndex: 1301,
        }}
      >
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{
            bgcolor: "#1a1a1a",
            border: "1px solid #333",
            color: "#fff",
            "&:hover": {
              bgcolor: "#222",
            },
          }}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "280px", md: "280px" },
          bgcolor: "#0a0a0a",
          borderRight: "1px solid #222",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          position: { xs: "fixed", md: "relative" },
          left: { xs: sidebarOpen ? 0 : "-280px", md: 0 },
          transition: "left 0.3s ease",
          zIndex: 1200,
        }}
      >
        {/* Back to Site Button */}
        <Button
          onClick={handleBackToSite}
          startIcon={<ArrowBackIcon />}
          sx={{
            m: 2,
            mb: 1,
            color: "#fff",
            bgcolor: "#1a1a1a",
            border: "1px solid #333",
            justifyContent: "flex-start",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#222",
              borderColor: "#444",
            },
          }}
        >
          Back to Dashboard
        </Button>

        {/* New Chat Button */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Button
            fullWidth
            onClick={handleNewChat}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#ff6b35",
              color: "white",
              textTransform: "none",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#ff6b35",
              },
            }}
          >
            New Chat
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#222" }} />

        {/* Chat History */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#666",
              fontWeight: 600,
              letterSpacing: "0.05em",
              mb: 2,
              px: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <HistoryIcon sx={{ fontSize: 16 }} />
            RECENT CHATS
          </Typography>

          {chatSessions.map((session) => (
            <Box
              key={session.id}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: "#1a1a1a",
                border: "1px solid transparent",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "#222",
                  borderColor: "#333",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "#fff",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {session.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#666",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {session.preview}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "#555", mt: 0.5 }}>
                {session.date.toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Z31 Branding */}
        <Box
          sx={{
            borderTop: "1px solid #222",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src={WebLogo}
              alt="Z31"
              sx={{
                height: 36,
                width: "auto",
              }}
            />
            <Box>
              <Typography
                sx={{ fontSize: "1rem", fontWeight: 600, color: "#fff" }}
              >
                Z31 Analytics
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#666" }}>
                Twitter Intelligence AI
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <Box
          onClick={() => setSidebarOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1100,
          }}
        />
      )}

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#111",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top Header with Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            borderBottom: "1px solid #222",
            bgcolor: "#0a0a0a",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              component="img"
              src={WebLogo}
              alt="Z31 Logo"
              sx={{
                height: { xs: 48, sm: 60 },
                width: "auto",
                filter: "drop-shadow(0 0 20px rgba(255, 107, 0, 0.3))",
              }}
            />
          </Box>
        </Box>

        {/* Chat Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            zIndex: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#0a0a0a",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#333",
              borderRadius: "4px",
              "&:hover": {
                background: "#444",
              },
            },
          }}
        >
          <Box sx={{ maxWidth: "900px", mx: "auto", position: "relative" }}>
            {messages.length === 1 && (
              <Fade in={true} timeout={500}>
                <Box sx={{ mb: 6, mt: 8 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      mb: 2,
                      textAlign: "center",
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                    }}
                  >
                    What can I analyze for you?
                  </Typography>
                  <Typography
                    sx={{
                      color: "#888",
                      textAlign: "center",
                      mb: 6,
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Ask me about any Twitter account, trends, or analytics
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr",
                        md: "repeat(2, 1fr)",
                      },
                      gap: { xs: 1.5, sm: 2 },
                      maxWidth: "700px",
                      mx: "auto",
                    }}
                  >
                    {[
                      {
                        title: "Account Analysis",
                        desc: "Analyze @elonmusk's recent tweets",
                        icon: "👤",
                      },
                      {
                        title: "Sentiment Tracking",
                        desc: "What's the sentiment around $BTC?",
                        icon: "📊",
                      },
                      {
                        title: "Trend Discovery",
                        desc: "Show trending crypto topics today",
                        icon: "🔥",
                      },
                      {
                        title: "Compare Accounts",
                        desc: "Compare @naval vs @pmarca",
                        icon: "⚔️",
                      },
                    ].map((item, index) => (
                      <Box
                        key={index}
                        onClick={() => setInputValue(item.desc)}
                        sx={{
                          p: { xs: 2, sm: 3 },
                          border: "1px solid #333",
                          borderRadius: 2,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          bgcolor: "#1a1a1a",
                          "&:hover": {
                            borderColor: "#ff6b35",
                            bgcolor: "#1f1f1f",
                            transform: { xs: "none", sm: "translateY(-2px)" },
                            boxShadow: {
                              xs: "none",
                              sm: "0 4px 20px rgba(255, 107, 0, 0.2)",
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1.5, sm: 2 },
                          }}
                        >
                          <Typography
                            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                          >
                            {item.icon}
                          </Typography>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: "#fff",
                                mb: 0.5,
                                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                color: "#888",
                              }}
                            >
                              {item.desc}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Fade>
            )}

            {messages.map((message, index) => (
              <Fade in={true} timeout={300} key={message.id}>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 3 },
                    mb: { xs: 3, sm: 4 },
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {message.sender === "bot" ? (
                      <AnimatedRobot size={40} />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          bgcolor: "#333",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        U
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ flex: 1, maxWidth: "80%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {message.sender === "bot" ? "Z31" : "You"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          color: "#666",
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        color: "#fff",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            ))}

            {isLoading && (
              <Fade in={true}>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 3 },
                    mb: { xs: 3, sm: 4 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AnimatedRobot size={40} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        color: "#fff",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Z31
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Box className="typing-dot" />
                      <Box
                        className="typing-dot"
                        sx={{ animationDelay: "0.2s" }}
                      />
                      <Box
                        className="typing-dot"
                        sx={{ animationDelay: "0.4s" }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Fade>
            )}

            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            borderTop: "1px solid #222",
            bgcolor: "#0a0a0a",
            p: { xs: 2, sm: 3 },
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Large Robot positioned above input, flush with border - COMMENTED OUT */}
          {/* <Box
            sx={{
              display: { xs: "none", sm: "block" },
              position: "absolute",
              left: 20,
              bottom: "100%",
              width: { sm: 120, md: 160, lg: 200, xl: 240 },
              height: { sm: 120, md: 160, lg: 200, xl: 240 },
              opacity: 0.85,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                transform: { 
                  sm: "scale(0.5)", 
                  md: "scale(0.67)", 
                  lg: "scale(0.83)", 
                  xl: "scale(1)" 
                },
                transformOrigin: "bottom left",
              }}
            >
              <AnimatedRobot size={240} />
            </Box>
          </Box> */}
          <Box sx={{ maxWidth: "900px", mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                alignItems: "flex-end",
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={5}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Z31 about Twitter analytics..."
                disabled={isLoading}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    bgcolor: "#1a1a1a",
                    borderRadius: 2,
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "#333",
                      borderWidth: 1,
                    },
                    "&:hover fieldset": {
                      borderColor: "#444",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff6b35",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 1.5, sm: 2 },
                    "&::placeholder": {
                      color: "#666",
                      opacity: 1,
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  bgcolor: inputValue.trim() && !isLoading ? "#ff6b35" : "#333",
                  color: inputValue.trim() && !isLoading ? "white" : "#666",
                  borderRadius: 2,
                  p: { xs: 1, sm: 1.5 },
                  minWidth: { xs: "44px", sm: "auto" },
                  "&:hover": {
                    bgcolor:
                      inputValue.trim() && !isLoading ? "#e55a00" : "#333",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                color: "#666",
                mt: 1.5,
                textAlign: "center",
                px: { xs: 2, sm: 0 },
              }}
            >
              Z31 can make mistakes. Consider checking important information.
            </Typography>
          </Box>
        </Box>
      </Box>

      <style>
        {`
          @keyframes blink {
            0%, 90%, 100% {
              opacity: 1;
            }
            95% {
              opacity: 0.1;
            }
          }
          
          @keyframes talk {
            0%, 100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(0.8);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
              filter: brightness(1);
            }
            50% {
              opacity: 1;
              filter: brightness(1.5) drop-shadow(0 0 10px rgba(255, 107, 0, 0.8));
            }
          }
          
          @keyframes glow {
            0% {
              filter: brightness(1) drop-shadow(0 0 5px rgba(255, 107, 0, 0.5));
            }
            100% {
              filter: brightness(1.3) drop-shadow(0 0 15px rgba(255, 107, 0, 1));
            }
          }
          
          .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #ff6b35;
            animation: typing 1.4s ease-in-out infinite;
          }
          
          @keyframes typing {
            0%, 60%, 100% {
              opacity: 0.3;
            }
            30% {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Z31Chat;
