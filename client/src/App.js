import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import toast from 'react-hot-toast';
import './App.css'

const App = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [claimId, setClaimId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const authToken = queryParams.get('authToken');
    const claimId = queryParams.get('claimId');
    const templateId = queryParams.get('templateId');

    setAuthToken(authToken);
    setClaimId(claimId);
    setTemplateId(templateId);

    const verifyUser = async () => {
      try {
        const res = await axios.post('/verifyUser', { token: authToken, claim_id: claimId});
        const expirationTime = new Date().getTime() + 6 * 60 * 60 * 1000;
        const verificationData = {
          data: res.data.user.data,
          token: authToken,
          expiry: expirationTime,
        };
        sessionStorage.setItem('verificationData', JSON.stringify(verificationData));
      } catch (error) {
        console.error('Verification failed:', error);
      }
    };

    const checkSessionStorage = () => {
      const storedData = sessionStorage.getItem('verificationData');
      if (storedData) {
        const { data, expiry } = JSON.parse(storedData);
        if (new Date().getTime() < expiry) {
          console.log('Using cached verification data:', data);
          return true;
        } else {
          sessionStorage.removeItem('verificationData');
        }
      }
      return false;
    };

    if (authToken && !checkSessionStorage()) {
      verifyUser();
    }
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (templateId) {
        try {
          const response = await axios.get(`/api/v1/template?templateId=${templateId}`);
          const template = response.data.data.template;
          console.log('Fetched template:', template);
          setTemplateContent(template);
        } catch (error) {
          console.error('Failed to fetch template:', error);
          toast.error('Failed to fetch template');
        }
      }
    };

    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    if (authToken && claimId) {
      getPlaceHolders(authToken, claimId);
    }
  }, [templateContent]);

  useEffect(() => {
    if (templateContent) {
      setContent(templateContent);
    }
  }, [templateContent]);

  const getPlaceHolders = async (token, claimId) => {
    const loadingToastId = toast.loading('Please Wait...');
    try {
      const response = await axios.get(`/variables?claim_id=${claimId}&token=${token}`);
      console.log('API call successful:', response.data);
      const placeholders = response.data.claim.data;

      const additionalPlaceholders = {
        claim_id: claimId,
      };

      const updatedContent = replacePlaceholders(
        templateContent,
        placeholders,
        additionalPlaceholders
      );

      toast.dismiss(loadingToastId);
      toast.success('Your template is ready.');
      setContent(updatedContent);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('API call failed');
      console.error('API call failed:', error);
    }
  };

  const replacePlaceholders = (template, placeholders, additionalPlaceholders = {}) => {
    let updatedTemplate = template;
    const allPlaceholders = { ...placeholders, ...additionalPlaceholders };
    Object.keys(allPlaceholders).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedTemplate = updatedTemplate.replace(regex, allPlaceholders[key]);
    });
    return updatedTemplate;
  };

  const handleSave = () => {
    const blob = new Blob([editor.current.value], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'document.txt');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        setContent(fileContent);
      };

      reader.readAsText(file);
    }
  };

  const joditConfig = {
    buttons: [
      'undo',
      'redo',
      '|',
      'bold',
      'strikethrough',
      'underline',
      'italic',
      '|',
      'align',
      '|',
      'ul',
      'ol',
      'outdent',
      'indent',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'image',
      'link',
      'table',
      '|',
      'hr',
      'eraser',
      'copyformat',
      '|',
      'fullsize',
      'selectall',
      'print',
      '|',
      'source',
      '|',
      {
        name: 'Open File',
        exec: () => {
          document.getElementById('fileInput').click();
        },
      },
      {
        name: 'Save File',
        exec: handleSave,
      },
      {
        name: 'Clear',
        exec: () => {
          setContent('');
        },
      },
    ],
    minHeight: 600,
  };

  return (
<div className="main-container">
  <div className="editor-container">
    <JoditEditor
      ref={editor}
      value={content}
      tabIndex={1}
      onBlur={(newContent) => setContent(newContent)}
      onChange={(newContent) => {}}
      config={joditConfig}
      className="editor"
    />
  </div>
  <input
    id="fileInput"
    type="file"
    accept=".txt"
    onChange={handleFileUpload}
    style={{ display: 'none' }}
    className="input-container"
  />
</div>

  );
};

export default App;
