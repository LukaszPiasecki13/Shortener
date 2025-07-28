"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Alert,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Progress,
} from "antd";
import {
  CopyOutlined,
  LinkOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./App.css";

const { Title, Paragraph, Text } = Typography;

export default function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [foundOriginalUrl, setFoundOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [throttleStatus, setThrottleStatus] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);


 const API_BASE_URL = 'https://shortener-z3bg.onrender.com'
// const API_BASE_URL = "http://localhost:8000"; // Uncomment for local development

  useEffect(() => {
    fetchThrottleStatus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) clearInterval(interval);
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const fetchThrottleStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/throttle-status/`);
      if (response.ok) {
        const data = await response.json();
        setThrottleStatus(data);
        setSecondsLeft(data.reset_in_seconds);
      }
    } catch (err) {
      console.error("Error fetching throttle status:", err);
    }
  };

  const handleShortenUrl = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      setError("Please enter URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/shorten/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: originalUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortenedUrl(data.shortened_url);
        setSuccess("🎉 URL shortened successfully!");
        fetchThrottleStatus();
      } else {
        setError(data.error || "An error occurred while shortening the URL");
      }
    } catch {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUrl = async (e) => {
    e.preventDefault();
    if (!searchUrl.trim()) {
      setError("Please enter a shortened URL");
      return;
    }

    setSearchLoading(true);
    setError("");
    setFoundOriginalUrl("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/shorten/?shortened_url=${encodeURIComponent(
          searchUrl
        )}`
      );
      const data = await response.json();

      if (response.ok) {
        setFoundOriginalUrl(data.original_url);
        setSuccess("✨ Original URL found!");
      } else {
        setError(data.error || "Original URL not found");
      }
    } catch {
      setError("Server connection error");
    } finally {
      setSearchLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("📋 Copied to clipboard!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Could not copy to clipboard");
    }
  };

  const resetForm = () => {
    setOriginalUrl("");
    setShortenedUrl("");
    setSearchUrl("");
    setFoundOriginalUrl("");
    setError("");
    setSuccess("");
  };

  const progressPercent = throttleStatus
    ? ((throttleStatus.limit - throttleStatus.remaining) /
        throttleStatus.limit) *
      100
    : 0;

  return (
    <div className="app-container">
      <div className="bg-element bg-element-1" />
      <div className="bg-element bg-element-2" />

      <div className="content-wrapper">
        <div className="main-content">
          <div className="header">
            <Title level={1} className="main-title">
              ⚡ URL shortener
            </Title>
            <Paragraph className="main-subtitle">
              Transform long links into elegant, short URLs
            </Paragraph>
          </div>

          {throttleStatus && (
            <Card
              className="glass-card throttle-card"
              title={
                <Space size="middle">
                  <ThunderboltOutlined className="throttle-icon" />
                  <Text strong className="card-title">
                    API status
                  </Text>
                </Space>
              }
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Request limit"
                    value={throttleStatus.limit}
                    prefix={<ClockCircleOutlined className="stat-icon-green" />}
                    valueStyle={{ color: "#1f2937", fontWeight: "600" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Left"
                    value={throttleStatus.remaining}
                    prefix={<CheckCircleOutlined className="stat-icon-blue" />}
                    valueStyle={{ color: "#1f2937", fontWeight: "600" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Reset in"
                    value={`${secondsLeft}s`}
                    valueStyle={{ color: "#1f2937", fontWeight: "600" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text strong className="progress-label">
                      Usage
                    </Text>
                    <Progress
                      percent={Math.round(progressPercent)}
                      strokeColor={{
                        "0%": "#10b981",
                        "50%": "#f59e0b",
                        "100%": "#ef4444",
                      }}
                      className="usage-progress"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {error && (
            <Alert
              message={error}
              type="error"
              closable
              onClose={() => setError("")}
              className="alert-error"
              showIcon
            />
          )}

          {success && (
            <Alert
              message={success}
              type="success"
              closable
              onClose={() => setSuccess("")}
              className="alert-success"
              showIcon
            />
          )}

          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <Card
                className="glass-card main-card"
                title={
                  <Space size="middle">
                    <LinkOutlined className="shorten-icon" />
                    <Text strong className="card-title">
                      Short URL
                    </Text>
                  </Space>
                }
              >
                <form onSubmit={handleShortenUrl}>
                  <div className="input-group">
                    <Text strong className="input-label">
                      Enter your URL
                    </Text>
                    <Input
                      size="large"
                      type="url"
                      placeholder="https://example.com/very/long/url/that/needs/shortening"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                      required
                      className="custom-input"
                    />
                  </div>
                  <Button
                    className="gradient-button"
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    icon={<ThunderboltOutlined />}
                  >
                    {loading ? "Shorting..." : "Short URL"}
                  </Button>
                </form>

                {shortenedUrl && (
                  <Card
                    className="result-card"
                    type="inner"
                    title={
                      <Space>
                        <CheckCircleOutlined className="result-icon" />
                        <Text strong className="result-title">
                          Your shortened URL:
                        </Text>
                      </Space>
                    }
                  >
                    <div className="result-container">
                      <Input
                        size="large"
                        readOnly
                        value={shortenedUrl}
                        className="result-input"
                        addonAfter={
                          <Button
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(shortenedUrl)}
                            type="text"
                            className="copy-button"
                          >
                            Copy
                          </Button>
                        }
                      />
                      <div style={{ marginTop: 8 }}>
                        <Button
                          type="link"
                          onClick={async () => {
                            try {
                              const response = await fetch(shortenedUrl);
                              if (!response.ok) {
                                throw new Error(
                                  "Failed to redirect to the shortened URL"
                                );
                              }
                              const data = await response.json();
                              const originalUrl = data.original_url;
                              window.open(originalUrl, "_blank");
                            } catch (error) {
                              console.error(
                                "Error opening shortened URL:",
                                error
                              );
                            }
                          }}
                        >
                          Open shortened URL
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                className="glass-card main-card"
                title={
                  <Space size="middle">
                    <SearchOutlined className="search-icon" />
                    <Text strong className="card-title">
                      Find the original URL
                    </Text>
                  </Space>
                }
              >
                <form onSubmit={handleSearchUrl}>
                  <div className="input-group">
                    <Text strong className="input-label">
                      Enter shortened URL
                    </Text>
                    <Input
                      size="large"
                      type="url"
                      placeholder="https://short.ly/abc123"
                      value={searchUrl}
                      onChange={(e) => setSearchUrl(e.target.value)}
                      required
                      className="custom-input search-input"
                    />
                  </div>
                  <Button
                    className="search-button"
                    htmlType="submit"
                    block
                    loading={searchLoading}
                    icon={<SearchOutlined />}
                  >
                    {searchLoading ? "Searching..." : "Find oryginal URL"}
                  </Button>
                </form>

                {foundOriginalUrl && (
                  <Card
                    className="search-result-card"
                    type="inner"
                    title={
                      <Space>
                        <CheckCircleOutlined className="search-result-icon" />
                        <Text strong className="search-result-title">
                          Oryginal URL:
                        </Text>
                      </Space>
                    }
                  >
                    <Input
                      size="large"
                      readOnly
                      value={foundOriginalUrl}
                      className="search-result-input"
                      addonAfter={
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(foundOriginalUrl)}
                          type="text"
                          className="search-copy-button"
                        >
                          Coppy
                        </Button>
                      }
                    />
                  </Card>
                )}
              </Card>
            </Col>
          </Row>
          <div className="reset-container">
            <Button type="text" onClick={resetForm} className="reset-button">
              🔄 Clear form
            </Button>
          </div>

          <div className="footer">
            <Text className="footer-text">
              ✨{" "}
              <a
                href="https://github.com/LukaszPiasecki13"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Lukasz Piasecki
              </a>{" "}
              - Software/Python Developer ✨
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
