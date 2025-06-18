import React, { useState } from "react";
import {
  Box,
  Typography,
  Link,
  Divider,
  Collapse,
  IconButton,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";
import WebLogo from "../newlogo4.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    platform: false,
    legal: false,
    contact: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FooterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <Box sx={{ minWidth: { xs: "100%", md: "auto" } }}>
      {/* Desktop: Always visible title */}
      <Typography
        variant="h6"
        sx={{
          color: "white",
          fontWeight: 600,
          mb: 2,
          fontSize: "1rem",
          display: { xs: "none", md: "block" },
        }}
      >
        {title}
      </Typography>

      {/* Mobile: Clickable dropdown title */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          py: 1,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          mb: 1,
        }}
        onClick={() => toggleSection(sectionKey)}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>
        <IconButton size="small" sx={{ color: "white" }}>
          {openSections[sectionKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Desktop: Always visible content */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {children}
      </Box>

      {/* Mobile: Collapsible content */}
      <Collapse
        in={openSections[sectionKey]}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pb: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0a0a0a",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        mt: "auto",
        pt: 6,
        pb: 3,
      }}
    >
      {/* Match AppBar Container structure EXACTLY */}
      <Container
        maxWidth={false}
        sx={{ px: 0, mx: 0, width: "100%", maxWidth: "none !important" }}
      >
        <Box
          sx={{
            px: 2, // Match Toolbar padding exactly
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 4, md: 0 },
              justifyContent: "space-between",
            }}
          >
            {/* Company Info */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", md: "0 0 33%" },
                mb: { xs: 2, md: 0 },
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Box
                  component="img"
                  src={WebLogo}
                  alt="Logo"
                  sx={{ height: 40, mb: 2 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.6)", maxWidth: 300 }}
                >
                  Your trusted platform for cryptocurrency analytics and user
                  insights. Track, analyze, and discover crypto enthusiasts
                  worldwide.
                </Typography>
              </Box>

              {/* Social Links */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  href="https://twitter.com"
                  target="_blank"
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    "&:hover": { color: "#1DA1F2" },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  href="https://github.com"
                  target="_blank"
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    "&:hover": { color: "white" },
                  }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  href="https://linkedin.com"
                  target="_blank"
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    "&:hover": { color: "#0A66C2" },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  href="https://telegram.org"
                  target="_blank"
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    "&:hover": { color: "#0088cc" },
                  }}
                >
                  <TelegramIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Links Container */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", md: "0 0 65%" },
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flexWrap: "wrap",
                gap: { xs: 2, md: 4 },
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              {/* Platform Section */}
              <FooterSection title="Platform" sectionKey="platform">
                <Link
                  href="/"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Discover Users
                </Link>
                <Link
                  href="/analytics"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Analytics
                </Link>
                <Link
                  href="/ask-z31"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Ask Z31
                </Link>
                <Link
                  href="/api"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  API
                </Link>
              </FooterSection>

              {/* Legal Section */}
              <FooterSection title="Legal" sectionKey="legal">
                <Link
                  href="/privacy"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Cookie Policy
                </Link>
                <Link
                  href="/disclaimer"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Disclaimer
                </Link>
              </FooterSection>

              {/* Contact Section */}
              <FooterSection title="Contact" sectionKey="contact">
                <Link
                  href="/contact"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Contact Us
                </Link>
                <Link
                  href="/support"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "orange" },
                  }}
                >
                  Support
                </Link>
                <Link
                  href="mailto:support@z31.com"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": { color: "orange" },
                  }}
                >
                  <EmailIcon sx={{ fontSize: 16 }} />
                  support@z31.com
                </Link>
              </FooterSection>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 4 }} />

          {/* Bottom Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              © {currentYear} Z31. All rights reserved.
            </Typography>

            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                Built with 🧡 for the crypto community
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
