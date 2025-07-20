import React, { useState } from 'react';
import { Button, Modal, Card, Spin, Typography, Space, Tag, Divider, Input, Table } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import aiService from '@/services/aiService';
import useLanguage from '@/locale/useLanguage';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const parseTable = (text) => {
  // Try to parse markdown table or CSV-like text to array of objects
  const lines = text.trim().split('\n');
  if (lines.length < 2) return null;
  const header = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  if (header.length < 2) return null;
  const data = lines.slice(1).map(line => {
    const values = line.split('|').map(v => v.trim()).filter(Boolean);
    if (values.length !== header.length) return null;
    const obj = {};
    header.forEach((h, i) => obj[h] = values[i]);
    return obj;
  }).filter(Boolean);
  if (data.length === 0) return null;
  return { columns: header.map(h => ({ title: h, dataIndex: h, key: h })), data };
};

const AIAssistant = () => {
  const translate = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [tableData, setTableData] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
    setAiResponse('');
    setTableData(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setUserInput('');
    setAiResponse('');
    setTableData(null);
  };

  const handleAsk = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setAiResponse('');
    setTableData(null);
    try {
      const prompt = `You are an AI assistant for a business web application. Answer the following user question in a clear, concise, and helpful way. If the answer is tabular, use markdown table format.\n\nUser question: ${userInput}`;
      const response = await aiService.generateResponse(prompt);
      setAiResponse(response);
      const parsed = parseTable(response);
      setTableData(parsed);
    } catch (error) {
      setAiResponse('Sorry, there was an error getting a response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<RobotOutlined />}
        onClick={showModal}
        style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
      >
        AI Assistant
      </Button>

      <Modal
        title={
          <div>
            <Space>
              <RobotOutlined style={{ color: '#1890ff' }} />
              <span>AI Assistant</span>
              {aiResponse && <Tag color="green">Response Ready</Tag>}
            </Space>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <Text strong>Ask anything about this page or business context:</Text>
          <TextArea
            rows={3}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Type your question..."
            onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); handleAsk(); } }}
            style={{ marginTop: 8, marginBottom: 8 }}
            disabled={loading}
          />
          <Button
            type="primary"
            onClick={handleAsk}
            loading={loading}
            disabled={!userInput.trim()}
          >
            Ask
          </Button>
        </Card>
        {loading && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin size="large" />
            <Paragraph style={{ marginTop: 16 }}>Thinking...</Paragraph>
          </div>
        )}
        {!loading && aiResponse && (
          <div style={{ marginTop: 16 }}>
            {tableData ? (
              <Table
                columns={tableData.columns}
                dataSource={tableData.data}
                pagination={false}
                bordered
                size="small"
                rowKey={(_, i) => i}
              />
            ) : (
              <Paragraph style={{ whiteSpace: 'pre-line' }}>{aiResponse}</Paragraph>
            )}
            <Divider />
            <Text type="secondary">AI response generated using Gemini API</Text>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AIAssistant; 